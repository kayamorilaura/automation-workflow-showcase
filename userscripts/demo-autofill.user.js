// ==UserScript==
// @name         Demo Content Autofill (LOCAL ONLY)
// @namespace    https://github.com/kayamorilaura/automation-workflow-showcase
// @version      1.0.0
// @description  Populate a fictional local test form after a manual click.
// @match        http://localhost:4173/demo/editor.html
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (location.origin !== 'http://localhost:4173' ||
      document.body?.dataset.demoEditor !== 'safe-offline-v1') return;

  // Synthetic demo values. These are not copied from any private system.
  const values = {
    'title-en': 'Harbor Studio — Fictional Stay',
    'title-pt': 'Harbor Studio — Alojamento fictício',
    'title-es': 'Harbor Studio — Alojamiento ficticio',
    'title-fr': 'Harbor Studio — Logement fictif',
    'description-en': 'A bright, fictional apartment created to demonstrate content workflows.',
    'description-pt': 'Um apartamento fictício criado para demonstrar fluxos de conteúdo.',
    'description-es': 'Un apartamento ficticio creado para demostrar flujos de contenido.',
    'description-fr': 'Un appartement fictif créé pour illustrer les flux de contenu.',
    'alt-en': 'Bright living room in the fictional Harbor Studio',
    'alt-pt': 'Sala luminosa do alojamento fictício Harbor Studio',
    'alt-es': 'Salón luminoso del alojamiento ficticio Harbor Studio',
    'alt-fr': 'Salon lumineux du logement fictif Harbor Studio',
  };

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Fill demo';
  button.style.marginRight = '8px';
  document.querySelector('#demo-content-form')?.before(button);
  button.addEventListener('click', () => {
    let filled = 0;
    for (const [name, text] of Object.entries(values)) {
      const input = document.querySelector(`[name="${name}"]`);
      if (!input) continue;
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
    }
    document.querySelector('#demo-script-status').textContent =
      `Filled ${filled} local demo fields. Nothing was submitted.`;
  });
})();
