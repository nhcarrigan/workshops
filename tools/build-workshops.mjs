#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

const WORKSHOPS_DIR = 'src/workshops';
const OUTPUT_DIR = 'src/app/generated';
const OUTPUT_FILE = join(OUTPUT_DIR, 'workshops.ts');

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const renderMarkdown = async (source) => {
  if (!source || source.trim() === '') {
    return '';
  }
  return await marked.parse(source.trim());
};

const renderInline = async (source) => {
  if (!source || source.trim() === '') {
    return '';
  }
  return await marked.parseInline(source.trim());
};

const parseStandaloneYaml = (yamlString) => {
  const fenced = `---\n${yamlString}\n---\n`;
  return matter(fenced).data ?? {};
};

const splitBodyParts = (body) => {
  const lines = body.split('\n');
  const parts = [];
  let buffer = [];
  let i = 0;

  const flushHtml = () => {
    if (buffer.length === 0) {
      return;
    }
    const text = buffer.join('\n').trim();
    if (text) {
      parts.push({ type: 'html', source: text });
    }
    buffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    if (/^:::tabs\s*$/.test(line)) {
      flushHtml();
      const tabBlock = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
        tabBlock.push(lines[i]);
        i++;
      }
      i++;
      parts.push({ type: 'tabs', source: tabBlock.join('\n') });
      continue;
    }
    buffer.push(line);
    i++;
  }
  flushHtml();
  return parts;
};

const parseTabBlock = (source) => {
  const lines = source.split('\n');
  const tabs = [];
  let current = null;
  for (const line of lines) {
    const tabMatch = line.match(/^@tab\s+([\w-]+)(?:\s+(.+))?$/);
    if (tabMatch) {
      if (current) {
        tabs.push(current);
      }
      const key = tabMatch[1];
      const label = (tabMatch[2] ?? key).trim();
      current = { key, label, bodyLines: [] };
      continue;
    }
    if (current) {
      current.bodyLines.push(line);
    }
  }
  if (current) {
    tabs.push(current);
  }
  return tabs;
};

const renderBodyParts = async (body) => {
  const parts = splitBodyParts(body);
  return Promise.all(
    parts.map(async (part) => {
      if (part.type === 'html') {
        return { type: 'html', html: await renderMarkdown(part.source) };
      }
      const tabs = parseTabBlock(part.source);
      return {
        type: 'tabs',
        tabs: await Promise.all(
          tabs.map(async (tab) => ({
            key:   tab.key,
            label: tab.label,
            html:  await renderMarkdown(tab.bodyLines.join('\n')),
          })),
        ),
      };
    }),
  );
};

const splitSectionBody = (content) => {
  const lines = content.split('\n');
  const intro = [];
  const steps = [];
  let current = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)(?:\s+\{#([\w-]+)\})?\s*$/);
    if (headingMatch) {
      if (current) {
        steps.push(current);
      }
      const title = headingMatch[1].trim();
      const id = headingMatch[2] ?? slugify(title);
      current = { id, title, bodyLines: [] };
      continue;
    }
    if (current) {
      current.bodyLines.push(line);
    } else {
      intro.push(line);
    }
  }
  if (current) {
    steps.push(current);
  }
  return { intro: intro.join('\n'), steps };
};

const buildSection = async (filePath) => {
  const raw = await readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fileBase = basename(filePath, extname(filePath));
  const orderMatch = fileBase.match(/^(\d+)-(.+)$/);
  const order = orderMatch ? Number.parseInt(orderMatch[1], 10) : 999;
  const slug = orderMatch ? orderMatch[2] : fileBase;
  const checks = data.checks ?? {};
  const pauses = data.pauses ?? {};

  const { intro, steps } = splitSectionBody(content);
  const introHtml = await renderMarkdown(intro);

  const renderedSteps = await Promise.all(
    steps.map(async (step) => {
      const bodyParts = await renderBodyParts(step.bodyLines.join('\n'));
      const result = {
        id: step.id,
        title: await renderInline(step.title),
        bodyParts,
      };
      if (checks[step.id]) {
        const rawQuiz = checks[step.id];
        result.quiz = {
          question: await renderInline(rawQuiz.question),
          options: await Promise.all(
            (rawQuiz.options ?? []).map(async (option) => ({
              text: await renderInline(option.text),
              correct: Boolean(option.correct),
              feedback: option.feedback ? await renderInline(option.feedback) : undefined,
            })),
          ),
        };
      }
      if (pauses[step.id]) {
        result.pausePoint = await renderInline(pauses[step.id]);
      }
      return result;
    }),
  );

  return {
    slug,
    title: await renderInline(data.title ?? slug),
    order,
    intro: introHtml,
    steps: renderedSteps,
  };
};

const buildWorkshop = async (slug) => {
  const dir = join(WORKSHOPS_DIR, slug);
  const ymlPath = join(dir, 'workshop.yml');

  let meta = { title: slug };
  try {
    const yml = await readFile(ymlPath, 'utf8');
    meta = { ...meta, ...parseStandaloneYaml(yml) };
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const sectionFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();

  const sections = await Promise.all(
    sectionFiles.map((name) => buildSection(join(dir, name))),
  );
  sections.sort((a, b) => a.order - b.order);

  return {
    slug,
    title: await renderInline(meta.title),
    tagline: meta.tagline ? await renderInline(meta.tagline) : undefined,
    description: meta.description ? await renderInline(meta.description) : undefined,
    sections,
  };
};

const listWorkshopSlugs = async () => {
  try {
    const entries = await readdir(WORKSHOPS_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
};

const writeManifest = async (workshops) => {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const body = `// AUTO-GENERATED FILE — do not edit by hand.
// Source: src/workshops/<slug>/. Regenerate with \`pnpm build:workshops\`.
/* eslint-disable */
import type { Workshop } from '../types/workshop';

export const WORKSHOPS: readonly Workshop[] = ${JSON.stringify(workshops, null, 2)} as const;
`;
  await writeFile(OUTPUT_FILE, body, 'utf8');
};

const main = async () => {
  try {
    await stat(WORKSHOPS_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`No ${WORKSHOPS_DIR} directory found — writing empty manifest.`);
      await writeManifest([]);
      return;
    }
    throw err;
  }

  const slugs = await listWorkshopSlugs();
  const workshops = await Promise.all(slugs.map(buildWorkshop));
  workshops.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeManifest(workshops);
  console.log(
    `Built ${workshops.length} workshop(s): ${workshops.map((w) => w.slug).join(', ') || '(none)'}`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
