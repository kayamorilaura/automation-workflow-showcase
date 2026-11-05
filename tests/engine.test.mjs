import test from 'node:test';
import assert from 'node:assert/strict';
import { initialize, nextRecord, processNext, exportValidated } from '../src/engine.js';

const fixtures = [
  { id: 'b', name: 'B', photos: ['1', '2', '3'] },
  { id: 'a', name: 'A', photos: ['1', '2'] },
];

test('prioritizes shortest unfinished record', () => {
  assert.equal(nextRecord(initialize(fixtures)).id, 'a');
});

test('retains progress after simulated rate limit, then resumes without duplicates', () => {
  const initial = initialize(fixtures);
  const first = processNext(initial, 1);
  assert.equal(first.record.status, 'PARTIAL');
  assert.equal(first.record.nextPhoto, 1);
  assert.equal(exportValidated(first.records).length, 0);
  const second = processNext(first.records);
  assert.equal(second.record.status, 'VALIDATED');
  assert.deepEqual(second.record.results.map((r) => r.index), [1, 2]);
  assert.equal(exportValidated(second.records).length, 1);
});

test('blocks unsafe export when completeness is inconsistent', () => {
  const records = initialize(fixtures);
  records[0].status = 'VALIDATED';
  assert.deepEqual(exportValidated(records), []);
});

test('does not process a completed record again', () => {
  let records = initialize([{ id: 'one', name: 'One', photos: ['1'] }]);
  records = processNext(records).records;
  assert.equal(processNext(records).changed, false);
});
