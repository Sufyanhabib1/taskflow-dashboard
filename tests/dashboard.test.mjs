import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { mkdir, rm } from 'node:fs/promises';
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://127.0.0.1:5173' });
for (const name of ['window','document','HTMLElement','HTMLInputElement','Event','MouseEvent','localStorage']) globalThis[name] = dom.window[name];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act } = await import('react');
const { createRoot } = await import('react-dom/client');
await mkdir('.test-output', { recursive: true });
await build({ entryPoints: ['src/App.jsx'], bundle: true, platform: 'node', format: 'esm', jsx: 'automatic', packages: 'external', outfile: '.test-output/app.mjs' });
const { default: App } = await import('../.test-output/app.mjs');
const { createElement } = await import('react');
let root;
async function mount() { root = createRoot(document.getElementById('root')); await act(async () => root.render(createElement(App))); }
async function click(element) { assert.ok(element, 'Expected control exists'); await act(async () => element.click()); }
async function setValue(selector, value) {
  const el = document.querySelector(selector);
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
  await act(async () => { setter.call(el, value); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); });
}
async function add(title, priority) {
  await setValue('#title', title); await setValue('#priority', priority);
  await act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
}
const cards = () => [...document.querySelectorAll('.task-card')];
try {
  localStorage.setItem('taskflow-tasks', '{bad json');
  await mount();
  assert.equal(cards().length, 0); assert.equal(document.activeElement.id, 'title');
  await add('Prepare React assignment', 'high');
  await add('Read lifecycle notes', 'low');
  assert.equal(cards().length, 2); assert.equal(document.activeElement.id, 'title');
  assert.equal(JSON.parse(localStorage.getItem('taskflow-tasks')).length, 2);
  assert.match(document.title, /2 pending/);
  await click(cards()[0].querySelector('input'));
  assert.match(document.title, /1 pending/);
  assert.ok(document.querySelector('.toast.visible'));
  await click([...document.querySelectorAll('.tabs button')].find(b => b.textContent === 'Completed'));
  assert.equal(cards().length, 1); assert.match(cards()[0].textContent, /Read lifecycle/);
  await click([...document.querySelectorAll('.tabs button')].find(b => b.textContent === 'All tasks'));
  await setValue('[aria-label="Filter by priority"]', 'high');
  assert.equal(cards().length, 1); assert.match(cards()[0].textContent, /Prepare React/);
  await setValue('[aria-label="Search tasks"]', 'nonexistent'); assert.equal(cards().length, 0);
  await setValue('[aria-label="Search tasks"]', '');
  await setValue('[aria-label="Filter by priority"]', 'all');
  await click(document.querySelector('.theme-toggle'));
  assert.equal(document.documentElement.dataset.theme, 'dark');
  const logCount = JSON.parse(localStorage.getItem('taskflow-activity')).length;
  assert.ok(logCount >= 7);
  await act(async () => root.unmount());
  await mount();
  assert.equal(cards().length, 2); assert.equal(document.documentElement.dataset.theme, 'dark');
  assert.equal(JSON.parse(localStorage.getItem('taskflow-activity')).length, logCount);
  await click(document.querySelector('.list-heading .text-button'));
  assert.equal(cards().length, 1);
  await click(cards()[0].querySelector('.delete-button'));
  assert.equal(cards().length, 0);
  assert.equal(JSON.parse(localStorage.getItem('taskflow-tasks')).length, 0);
  console.log('PASS: invalid-storage recovery, add, autofocus, completion, filters, search, title, toast, theme, persistence, activity restoration, clear completed, delete, and unmount cleanup.');
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  await rm('.test-output', { recursive: true, force: true });
}
