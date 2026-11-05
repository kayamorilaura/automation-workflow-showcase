import { initialize, processNext, exportValidated } from './engine.js';

const table = document.querySelector('#records');
const eventText = document.querySelector('#event');
let records = [];
let source = [];

function render() {
  table.replaceChildren();
  for (const record of records) {
    const tr = document.createElement('tr');
    for (const value of [record.name, String(record.photos.length), `${record.results.length} / ${record.photos.length}`]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    const td = document.createElement('td');
    const status = document.createElement('span');
    status.className = `state ${record.status.toLowerCase()}`;
    status.textContent = record.status;
    td.append(status);
    tr.append(td);
    table.append(tr);
  }
  document.querySelector('#export').disabled = exportValidated(records).length === 0;
  document.querySelector('#process').disabled = records.every((r) => r.status === 'VALIDATED');
  document.querySelector('#limit').disabled = records.every((r) => r.status === 'VALIDATED');
}

function process(photoBudget) {
  const result = processNext(records, photoBudget);
  records = result.records;
  eventText.textContent = result.event;
  render();
}

document.querySelector('#process').addEventListener('click', () => process(Infinity));
document.querySelector('#limit').addEventListener('click', () => process(1));
document.querySelector('#reset').addEventListener('click', () => {
  records = initialize(source);
  eventText.textContent = 'Demo reset. No external services connected.';
  render();
});
document.querySelector('#export').addEventListener('click', () => {
  const result = exportValidated(records);
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'validated-demo-output.json';
  link.click();
  URL.revokeObjectURL(url);
  eventText.textContent = `Exported ${result.length} validated fictional record(s).`;
});

try {
  const response = await fetch('./data/example-records.json');
  if (!response.ok) throw new Error('Demo dataset unavailable');
  source = await response.json();
  records = initialize(source);
  render();
} catch {
  eventText.textContent = 'Could not load example records. Run a local web server (see README).';
  table.replaceChildren();
}
