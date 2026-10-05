const BINARY_TAGS = new Set([
  84, 65, 79, 111, 98, 85, 83, 115, 76, 108, 71, 103, 77, 109, 86,
])

function isHexByte(byte) {
  return (byte >= 48 && byte <= 57) || (byte >= 97 && byte <= 102)
}

function isLineTag(byte) {
  return (byte > 64 && byte < 91) || byte === 35 || byte === 114 || byte === 120
}

function readLine(bytes, index) {
  const start = index
  while (index < bytes.length && bytes[index] !== 10) index += 1
  const body = bytes.subarray(start, index).toString('utf8')
  if (index < bytes.length && bytes[index] === 10) index += 1
  return { body, index, closed: index > start && bytes[index - 1] === 10 }
}

export function flightRowProblems(flight) {
  const bytes = Buffer.from(String(flight || ''), 'utf8')
  const defined = new Set()
  const references = []
  const problems = []
  let index = 0

  while (index < bytes.length) {
    if (bytes[index] === 10 || bytes[index] === 13) {
      index += 1
      continue
    }

    const idStart = index
    let id = 0
    let sawDigit = false
    while (index < bytes.length && bytes[index] !== 58) {
      const byte = bytes[index]
      if (!isHexByte(byte)) {
        problems.push(`expected a flight row header at byte ${idStart}`)
        return problems
      }
      sawDigit = true
      id = (id << 4) | (byte >= 97 ? byte - 87 : byte - 48)
      index += 1
    }
    if (index >= bytes.length || bytes[index] !== 58) {
      problems.push(`expected a flight row header at byte ${idStart}`)
      return problems
    }
    const rowId = sawDigit ? id.toString(16) : ''
    index += 1
    if (sawDigit) defined.add(rowId)

    const tag = bytes[index]
    if (BINARY_TAGS.has(tag)) {
      index += 1
      let length = 0
      let sawLength = false
      while (index < bytes.length && bytes[index] !== 44) {
        const byte = bytes[index]
        if (!isHexByte(byte)) {
          problems.push(`text row ${rowId} has a non-hex byte length`)
          return problems
        }
        sawLength = true
        length = (length << 4) | (byte >= 97 ? byte - 87 : byte - 48)
        index += 1
      }
      if (!sawLength || bytes[index] !== 44) {
        problems.push(`text row ${rowId} is missing its byte length`)
        return problems
      }
      index += 1
      if (index + length > bytes.length) {
        problems.push(`text row ${rowId} declares ${length} bytes past the end of the payload`)
        return problems
      }
      index += length
      if (index < bytes.length && !isHexByte(bytes[index])) {
        const next = bytes.subarray(index, Math.min(index + 32, bytes.length)).toString('utf8')
        problems.push(`text row ${rowId} length swallowed the following row (next bytes ${JSON.stringify(next)})`)
        break
      }
      continue
    }

    if (isLineTag(tag)) index += 1
    const line = readLine(bytes, index)
    index = line.index
    if (!line.closed && index < bytes.length) {
      problems.push(`row ${rowId} did not end on a newline`)
      return problems
    }
    for (const match of line.body.matchAll(/"\$L([0-9a-f]+)"/g)) {
      references.push({ from: rowId, to: match[1] })
    }
  }

  for (const reference of references) {
    if (!defined.has(reference.to)) {
      problems.push(`row ${reference.from} references $L${reference.to}, but that flight row is undefined`)
    }
  }

  return problems
}
