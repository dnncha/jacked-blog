export const MAX_URL_BYTES = 12_000
export const MAX_ENCODED_PAYLOAD_BYTES = 8_000
export const MAX_PAYLOAD_BYTES = 6_000
export const MAX_DAYS = 6
export const MAX_EXERCISES_PER_DAY = 12
export const MAX_EXERCISES = 48
export const MAX_EXERCISE_ID_LENGTH = 96

function safeText(value, maximum) {
  return typeof value === 'string'
    && value.length <= maximum
    && !/[\u0000-\u001f\u007f]/.test(value)
}

function validPrescription(value) {
  return value
    && typeof value.i === 'string'
    && value.i.length >= 1 && value.i.length <= MAX_EXERCISE_ID_LENGTH
    && /^[A-Za-z0-9_.-]+$/.test(value.i)
    && Number.isInteger(value.s) && value.s >= 1 && value.s <= 20
    && Number.isInteger(value.a) && value.a >= 1 && value.a <= 100
    && Number.isInteger(value.b) && value.b >= 1 && value.b <= 100
    && value.a <= value.b
    && Number.isFinite(value.r) && value.r >= 0 && value.r <= 5
    && Number.isInteger(value.t) && value.t >= 0 && value.t <= 1_800
}

function decodeBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('invalid payload')
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(base64)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function checksum(bytes, subtle) {
  if (!subtle?.digest) throw new Error('checksum unavailable')
  const digest = await subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function isValidPlan(plan) {
  if (!plan || plan.v !== 1 || !safeText(plan.t, 96)
    || !Array.isArray(plan.d) || plan.d.length < 1 || plan.d.length > MAX_DAYS) {
    return false
  }

  let totalExercises = 0
  return plan.d.every((day) => {
    if (!day || !safeText(day.n, 72)
      || !Number.isInteger(day.c) || day.c < 0
      || !Number.isInteger(day.s) || day.s < 0
      || !Array.isArray(day.x) || day.x.length > MAX_EXERCISES_PER_DAY
      || (day.p != null && (!Array.isArray(day.p)
        || day.p.length > MAX_EXERCISES_PER_DAY
        || !day.p.every(validPrescription)))
      || (day.r != null && !safeText(day.r, 32))
      || (day.q != null && !safeText(day.q, 32))) {
      return false
    }

    totalExercises += day.c
    return day.x.every((line) => safeText(line, 220))
  }) && totalExercises <= MAX_EXERCISES
}

export async function decodePlanPayload({ query, href, subtle = globalThis.crypto?.subtle }) {
  const params = query instanceof URLSearchParams ? query : new URLSearchParams(query)
  const encoded = params.get('p')
  const expectedChecksum = params.get('c')
  if (!encoded || encoded.length > MAX_ENCODED_PAYLOAD_BYTES || !expectedChecksum) {
    throw new Error('missing payload')
  }

  const bytes = decodeBase64Url(encoded)
  if (bytes.byteLength > MAX_PAYLOAD_BYTES) throw new Error('payload too large')
  if (typeof href !== 'string' || new TextEncoder().encode(href).byteLength > MAX_URL_BYTES) {
    throw new Error('url too large')
  }
  if (!/^[0-9a-f]{16}$/i.test(expectedChecksum)
    || expectedChecksum.toLowerCase() !== await checksum(bytes, subtle)) {
    throw new Error('checksum mismatch')
  }

  const plan = JSON.parse(new TextDecoder().decode(bytes))
  if (!isValidPlan(plan)) throw new Error('invalid plan')
  return plan
}
