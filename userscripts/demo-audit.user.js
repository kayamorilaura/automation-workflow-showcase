// ==UserScript==
// @name         Demo Completeness Audit (LOCAL ONLY)
// @namespace    https://github.com/kayamorilaura/automation-workflow-showcase
// @version      1.0.0
// @description  Check a fictional local form; never submits or saves data.
// @match        http://localhost:4173/demo/editor.html
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (location.origin !== 'http://localhost:4173' ||
      document.body?.dataset.demoEditor !== 'safe-offline-v1') return;
  const fields = ['title', 'description', 'alt'];
  const langs = ['en', 'pt', 'es', 'fr'];
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Audit demo';
  button.style.background = '#2b3233';
  button.style.color = '#fff';
  document.querySelector('#demo-content-form')?.before(button);
  button.addEventListener('click', () => {
    const missing = [];
    for (const type of fields) for (const lang of langs) {
      const key = `${type}-${lang}`;
      if (!document.querySelector(`[name="${key}"]`)?.value.trim()) missing.push(key);
    }
    document.querySelector('#demo-script-status').textContent = missing.length
      ? `Incomplete (${12 - missing.length}/12). Missing: ${missing.join(', ')}`
      : 'Complete (12/12). Local demo only; no data was saved.';
  });
})();
