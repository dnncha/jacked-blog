import assert from 'node:assert/strict'
import { summarizeAuditStatuses } from './seo-audit.mjs'

const summary = summarizeAuditStatuses([
  { audit_status: 'audited' },
  { audit_status: 'asset' },
  { audit_status: 'blocked' },
  { audit_status: 'not_audited' },
  { audit_status: 'audited' },
  { audit_status: 'unexpected' },
])

assert.deepEqual(summary, {
  audited: 2,
  assets: 1,
  notAudited: 1,
  blocked: 1,
  other: 1,
})
assert.equal(
  summary.audited + summary.assets + summary.notAudited + summary.blocked + summary.other,
  6,
  'every discovered record must belong to exactly one status bucket',
)

console.log('seo audit status tests passed')
