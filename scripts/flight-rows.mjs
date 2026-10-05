function isHexByte(byte) {
  return (byte >= 48 && byte <= 57) || (byte >= 97 && byte <= 102)
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
    while (index < bytes.length && isHexByte(bytes[index])) index += 1
    if (index === idStart || bytes[index] !== 58) {
      problems.push(`expected a flight row header at byte ${idStart}`)
      break
    }

    const id = bytes.subarray(idStart, index).toString('utf8')
    index += 1
    defined.add(id)

    if (bytes[index] === 84) {
      index += 1
      const lengthStart = index
      while (index < bytes.length && isHexByte(bytes[index])) index += 1
      if (bytes[index] !== 44) {
        problems.push(`text row ${id} is missing its byte length`)
        break
      }
      const length = Number.parseInt(bytes.subarray(lengthStart, index).toString('utf8'), 16)
      index += 1
      if (!Number.isFinite(length) || index + length > bytes.length) {
        problems.push(`text row ${id} declares ${length} bytes past the end of the payload`)
        break
      }
      index += length
      if (index < bytes.length && bytes[index] !== 10 && bytes[index] !== 13) {
        const next = bytes.subarray(index, Math.min(index + 32, bytes.length)).toString('utf8')
        problems.push(`text row ${id} length swallowed the following row (next bytes ${JSON.stringify(next)})`)
        break
      }
      continue
    }

    const bodyStart = index
    while (index < bytes.length && bytes[index] !== 10 && bytes[index] !== 13) index += 1
    const body = bytes.subarray(bodyStart, index).toString('utf8')
    for (const match of body.matchAll(/"\$L([0-9a-f]+)"/g)) {
      references.push({ from: id, to: match[1] })
    }
  }

  for (const reference of references) {
    if (!defined.has(reference.to)) {
      problems.push(`row ${reference.from} references $L${reference.to}, but that flight row is undefined`)
    }
  }

  return problems
}
