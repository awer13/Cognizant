// utils/answers.js
export const toKvPairs = (pairs) =>
    pairs.reduce((acc, { key, correct, student }) => {
      acc[key] = normalize(correct)
      acc[`${key}_ST`] = normalize(student)
      return acc
    }, {})
  
  export const mergeKv = (...objs) =>
    objs.reduce((acc, o) => (o ? Object.assign(acc, o) : acc), {})
  
  const normalize = (v) => {
    if (v === undefined) return null
    if (typeof v === 'string') {
      const maybe = v.replace(',', '.').trim()
      if (maybe !== '' && !isNaN(maybe)) return Number(maybe)
      return v
    }
    return v
  }
  