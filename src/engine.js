/**
 * Offline, synthetic workflow simulation.
 * No credentials, private data, network calls or third-party integrations.
 */
export const STATES = Object.freeze({ READY: 'READY', PARTIAL: 'PARTIAL', VALIDATED: 'VALIDATED' });

export function initialize(records) {
  return records.map((record) => ({
    ...record,
    status: STATES.READY,
    nextPhoto: 0,
    results: [],
    issue: null,
  }));
}

export function nextRecord(records) {
  return [...records]
    .filter((record) => record.status !== STATES.VALIDATED)
    .sort((a, b) => a.photos.length - b.photos.length || a.name.localeCompare(b.name))[0] ?? null;
}

function describePhoto(record, index) {
  const scene = record.photos[index];
  return {
    photoId: `${record.id}-${index + 1}`,
    index: index + 1,
    label: scene,
    captions: {
      en: `${scene} at ${record.name}`,
      pt: `${scene} — ${record.name}`,
      es: `${scene} — ${record.name}`,
      fr: `${scene} — ${record.name}`,
    },
    source: 'local-mock',
  };
}

/** Process one record, respecting a simulated per-run photo budget.
 * A budget of 0 imitates a provider refusing the next request.
 * Partial progress is persisted in returned data and is resumable.
 */
export function processNext(records, photoBudget = Infinity) {
  if (!Number.isInteger(photoBudget) && photoBudget !== Infinity) {
    throw new TypeError('photoBudget must be an integer or Infinity');
  }
  if (photoBudget < 0) throw new RangeError('photoBudget cannot be negative');
  const target = nextRecord(records);
  if (!target) return { records, event: 'All demo records are validated.', changed: false };
  const updated = { ...target, results: [...target.results] };
  let used = 0;
  while (updated.nextPhoto < updated.photos.length && used < photoBudget) {
    // This is deliberately a local mock; no HTTP call is ever made.
    updated.results.push(describePhoto(updated, updated.nextPhoto));
    updated.nextPhoto += 1;
    used += 1;
  }
  if (updated.nextPhoto === updated.photos.length) {
    updated.status = STATES.VALIDATED;
    updated.issue = null;
  } else {
    updated.status = STATES.PARTIAL;
    updated.issue = { type: 'SIMULATED_RATE_LIMIT', resumeFrom: updated.nextPhoto + 1 };
  }
  const nextRecords = records.map((record) => record.id === updated.id ? updated : record);
  return {
    records: nextRecords,
    record: updated,
    changed: true,
    event: updated.status === STATES.VALIDATED
      ? `${updated.name}: validated ${updated.results.length}/${updated.photos.length} photos.`
      : `${updated.name}: stopped at ${updated.results.length}/${updated.photos.length}; progress retained.`,
  };
}

/** Fail closed: incomplete records cannot be exported as publishable content. */
export function exportValidated(records) {
  return records.filter((record) => {
    return record.status === STATES.VALIDATED &&
      record.results.length === record.photos.length &&
      record.results.every((result, i) => result.index === i + 1);
  }).map(({ id, name, results }) => ({ id, name, captions: results }));
}
