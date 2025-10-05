// src/DetCofactorTaskCombined.js
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Select, InputNumber, Button } from 'antd'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const Box = styled.div`
  padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:12px;
`
const SectionTitle = styled.h3`margin:12px 0 8px 0;`
const Actions = styled.div`display:flex;gap:8px;margin-top:10px;`

const Formula = ({ latex }) => (
  <div
    style={{ margin: '6px 0' }}
    dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false }) }}
  />
)

// ⬇️ инлайн-KaTeX для вставки формулы прямо в строку текста
const InlineMath = ({ latex }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(latex, { throwOnError: false })
    }}
  />
)

const EPS = 1e-9
const near = (a, b) => Number.isFinite(+a) && Number.isFinite(+b) && Math.abs(a - b) <= EPS

// ── PRNG ───────────────────────────────────────────────────────────────────────
function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const randint = (rng, a, b) => a + Math.floor(rng() * (b - a + 1))

function headerForCofactor(data, t1) {
  const [i, j] = t1.pos
  if (data.type === 1) {
    return '\\text{Разложение по }4\\text{-му столбцу}\\;'
  }
  if (data.type === 2) {
    return `\\text{Разложение по }${i}\\text{-й строке}\\;`
  }
  const k = data.X === 'row' ? i : j
  const tail = data.X === 'row' ? '\\text{-й строке}\\;' : '\\text{-му столбцу}\\;'
  return `\\text{Разложение по }${k}${tail}`
}
// ── det NxN через Гаусса ───────────────────────────────────────────────────────
function detOf(M) {
  const n = M.length
  if (n === 0) return 1
  const a = M.map(r => r.map(Number))
  let s = 1
  for (let i = 0; i < n; i++) {
    let piv = i
    for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[piv][i])) piv = r
    if (Math.abs(a[piv][i]) < EPS) return 0
    if (piv !== i) { [a[piv], a[i]] = [a[i], a[piv]]; s *= -1 }
    const inv = 1 / a[i][i]
    for (let r = i + 1; r < n; r++) {
      const f = a[r][i] * inv
      if (Math.abs(f) < EPS) continue
      for (let c = i; c < n; c++) a[r][c] -= f * a[i][c]
    }
  }
  let d = s
  for (let i = 0; i < n; i++) d *= a[i][i]
  return Math.abs(d) < EPS ? 0 : d
}

// ───────────────────────────────────────────────────────────────────────────────
// Матрица-1 (строго как в ТЗ): разложение по 4-му столбцу
// A = [[a+1,1,1,1],[-1,a,0,0],[0,-1,a,0],[0,0,-1,a]], a ∈ {2..7}
// ───────────────────────────────────────────────────────────────────────────────
function genMatrix1(seed) {
  const rng = mulberry32(seed)
  const a = randint(rng, 2, 7)
  const A = [
    [a + 1, 1, 1, 1],
    [-1, a, 0, 0],
    [0, -1, a, 0],
    [0, 0, -1, a],
  ]
  const B1 = [[-1, a, 0], [0, -1, a], [0, 0, -1]]               // (1,4)
  const B2 = [[a + 1, 1, 1], [-1, a, 0], [0, -1, a]]            // (4,4)
  const M14 = detOf(B1), M44 = detOf(B2)
  const s1 = -1, s2 = +1
  const a14 = 1, a44 = a
  const detA = s1 * a14 * M14 + s2 * a44 * M44
  return {
    type: 1, A, X: 'col',
    terms: [
      { pos: [1, 4], coef: a14, sign: s1, B: B1 },
      { pos: [4, 4], coef: a44, sign: s2, B: B2 },
    ],
    askA: { label: 'A_{14}', value: s1 * M14 },
    askM: { label: 'M_{44}', value: M44 },
    detA,
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Матрица-2 (строго форма из ТЗ)
// ───────────────────────────────────────────────────────────────────────────────
function genMatrix2(seed) {
  const rng = mulberry32(seed)
  const a = randint(rng, 1, 4)
  let x
  do { x = randint(rng, -4, 12) } while (x === 0 || x === a)

  const A = [
    [a + 1, x, x, x],
    [1, a, x, x],
    [1, 0, a, x],
    [1, 0, 0, a],
  ]

  const k = 4, p = 1, q = 4
  const minor = (rm, cm) => A.filter((_, i) => i !== rm - 1).map(r => r.filter((_, j) => j !== cm - 1))
  const Bp = minor(k, p), Bq = minor(k, q)
  const Mp = detOf(Bp), Mq = detOf(Bq)
  const sp = ((k + p) % 2 === 0) ? 1 : -1
  const sq = ((k + q) % 2 === 0) ? 1 : -1
  const c1 = 1, c2 = a
  const detA = sp * c1 * Mp + sq * c2 * Mq

  return {
    type: 2, A, X: 'row',
    terms: [
      { pos: [k, p], coef: c1, sign: sp, B: Bp },
      { pos: [k, q], coef: c2, sign: sq, B: Bq },
    ],
    askA: { label: `A_{${k}${p}}`, value: sp * Mp },
    askM: { label: `M_{${k}${q}}`, value: Mq },
    detA,
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Матрица-3 (строго форма из ТЗ)
// ───────────────────────────────────────────────────────────────────────────────
function countZerosAndOnes(A) {
  const n = A.length
  const zrow = Array(n).fill(0), zcol = Array(n).fill(0)
  const drow = Array(n).fill(0), dcol = Array(n).fill(0)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (A[i][j] === 0) { zrow[i]++; zcol[j]++; }
    if (Math.abs(A[i][j]) === 1) { drow[i]++; dcol[j]++; }
  }
  return { zrow, zcol, drow, dcol }
}
function pickKandX(A) {
  const { zrow, zcol, drow, dcol } = countZerosAndOnes(A)
  const maxR = Math.max(...zrow), maxC = Math.max(...zcol)
  if (maxC > maxR) {
    let k = 1, bestZ = -1, bestD = -1
    for (let j = 0; j < A.length; j++) {
      if (zcol[j] > bestZ || (zcol[j] === bestZ && dcol[j] > bestD)) {
        bestZ = zcol[j]; bestD = dcol[j]; k = j + 1
      }
    }
    return { X: 'col', k }
  } else {
    let k = 1, bestZ = -1, bestD = -1
    for (let i = 0; i < A.length; i++) {
      if (zrow[i] > bestZ || (zrow[i] === bestZ && drow[i] > bestD)) {
        bestZ = zrow[i]; bestD = drow[i]; k = i + 1
      }
    }
    return { X: 'row', k }
  }
}
function pickPQ(A, k, X) {
  const n = A.length
  const idx = []
  if (X === 'row') {
    for (let j = 1; j <= n; j++) if (A[k - 1][j - 1] !== 0) idx.push(j)
  } else {
    for (let i = 1; i <= n; i++) if (A[i - 1][k - 1] !== 0) idx.push(i)
  }
  return { p: idx[0], q: idx[idx.length - 1] }
}
function genMatrix3(seed) {
  const rng = mulberry32(seed)
  let a, b, x
  do { x = randint(rng, 1, 5) } while (x === 0)
  do { a = randint(rng, -5, -1) } while (a === 0 || a === x)
  do { b = randint(rng, 6, 10) } while (b === 0 || b === x || b === a)
  if (x * x === 3 * a * b) { x = x === 5 ? 4 : x + 1 }

  const A = [
    [x, a, a, a],
    [b, x, 0, 0],
    [b, 0, x, 0],
    [b, 0, 0, x],
  ]

  const { X, k } = pickKandX(A)
  const { p, q } = pickPQ(A, k, X)

  const minor = (rm, cm) => A.filter((_, i) => i !== rm - 1).map(r => r.filter((_, j) => j !== cm - 1))
  let Bp, Bq, Mp, Mq, sp, sq, c1, c2, askA, askM, t1, t2
  if (X === 'row') {
    Bp = minor(k, p); Bq = minor(k, q)
    Mp = detOf(Bp); Mq = detOf(Bq)
    sp = ((k + p) % 2 === 0) ? 1 : -1
    sq = ((k + q) % 2 === 0) ? 1 : -1
    c1 = A[k - 1][p - 1]; c2 = A[k - 1][q - 1]
    askA = { label: `A_{${k}${p}}`, value: sp * Mp }
    askM = { label: `M_{${k}${q}}`, value: Mq }
    t1 = { pos: [k, p], coef: c1, sign: sp, B: Bp }
    t2 = { pos: [k, q], coef: c2, sign: sq, B: Bq }
  } else {
    Bp = minor(p, k); Bq = minor(q, k)
    Mp = detOf(Bp); Mq = detOf(Bq)
    sp = ((p + k) % 2 === 0) ? 1 : -1
    sq = ((q + k) % 2 === 0) ? 1 : -1
    c1 = A[p - 1][k - 1]; c2 = A[q - 1][k - 1]
    askA = { label: `A_{${p}${k}}`, value: sp * Mp }
    askM = { label: `M_{${q}${k}}`, value: Mq }
    t1 = { pos: [p, k], coef: c1, sign: sp, B: Bp }
    t2 = { pos: [q, k], coef: c2, sign: sq, B: Bq }
  }
  const detA = sp * c1 * Mp + sq * c2 * Mq
  return { type: 3, A, X, terms: [t1, t2], askA, askM, detA }
}

// ── Основной компонент ────────────────────────────────────────────────────────
export default function DetCofactorTaskCombined({ taskNumber, onDone }) {
  const klass = useMemo(() => ((Number(taskNumber) - 1) % 3) + 1, [taskNumber])
  const seed = useMemo(() => 0xC0FA ^ (Number(taskNumber) || 1), [taskNumber])

  const data = useMemo(() => {
    if (klass === 1) return genMatrix1(seed)
    if (klass === 2) return genMatrix2(seed)
    return genMatrix3(seed)
  }, [klass, seed])

  const { A, terms: [t1, t2], askA, askM, detA } = data

  const [step, setStep] = useState(1)

  // динамические слагаемые
  const empty3 = () => Array.from({ length: 3 }, () => Array(3).fill(undefined))
  const [terms, setTerms] = useState([
    { sign: undefined, coef: undefined, B: empty3() },
    { sign: undefined, coef: undefined, B: empty3() },
  ])
  const addTerm = () =>
    setTerms(t => t.length < A.length ? [...t, { sign: undefined, coef: undefined, B: empty3() }] : t)
  const removeTerm = (idx) =>
    setTerms(t => t.length > 1 ? t.filter((_, i) => i !== idx) : t)
  const updateTermB = (idx, i, j, v) =>
    setTerms(ts => {
      const copy = ts.map(x => ({ ...x, B: x.B.map(r => r.slice()) }))
      copy[idx].B[i][j] = v
      return copy
    })

  const [Aask, setAask] = useState()
  const [Mask, setMask] = useState()
  const [detUser, setDetUser] = useState()

  const eqMat = (U, R) => {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (!near(Number(U[i][j]), R[i][j])) return false
    return true
  }

  const [i1, j1] = t1.pos
  const headerLatex = headerForCofactor(data, t1)

  // ── Проверка ────────────────────────────────────────────────────────────────
  const checkAndFinish = () => {
    const expected = [t1, t2]
    const used = Array(expected.length).fill(false)

    const matchIdx = terms.map(term => {
      let hit = -1
      for (let k = 0; k < expected.length; k++) {
        if (used[k]) continue
        const e = expected[k]
        const sameB = eqMat(term.B, e.B)
        const sameCoef = near(Number(term.coef), e.coef)
        const sameSign = Number(term.sign) === e.sign
        if (sameB && sameCoef && sameSign) { hit = k; used[k] = true; break }
      }
      return hit
    })

    const okCount = terms.length === expected.length

    const W = { cnt:10, z:10, c:5, m:10, A:20, M:10, D:10 }
    const rows = []
    rows.push({
      key: 'cnt',
      label: 'Количество слагаемых',
      w: W.cnt,
      gained: okCount ? W.cnt : 0,
      entered: terms.length,
      correct: expected.length
    })

    terms.forEach((t, idx) => {
      const k = matchIdx[idx]
      const e = k >= 0 ? expected[k] : null
      const wZ = idx < 2 ? W.z : 0
      const wC = idx < 2 ? W.c : 0
      const wM = idx < 2 ? W.m : 0

      rows.push({
        key: `z-${idx}`, label: `Разложение: знак ${idx + 1}-го`, w: wZ,
        gained: (k >= 0 ? wZ : 0),
        entered: Number(t.sign),
        correct: (e ? e.sign : null)
      })
      rows.push({
        key: `c-${idx}`, label: `Разложение: коэффициент ${idx + 1}-го`, w: wC,
        gained: (k >= 0 ? wC : 0),
        entered: Number(t.coef),
        correct: (e ? e.coef : null)
      })
      rows.push({
        key: `m-${idx}`, label: `Разложение: минор ${idx + 1}-го`, w: wM,
        gained: (k >= 0 ? wM : 0),
        entered: t.B,
        correct: (e ? e.B : null)
      })
    })

    rows.push({
      key: 'A',
      label: `Алгебраическое дополнение ${askA.label}`,
      w: W.A,
      gained: near(Number(Aask), askA.value) ? W.A : 0,
      entered: Number(Aask),
      correct: askA.value
    })
    rows.push({
      key: 'M',
      label: `Минор ${askM.label}`,
      w: W.M,
      gained: near(Number(Mask), askM.value) ? W.M : 0,
      entered: Number(Mask),
      correct: askM.value
    })
    rows.push({
      key: 'D',
      label: 'Определитель det(A)',
      w: W.D,
      gained: near(Number(detUser), detA) ? W.D : 0,
      entered: Number(detUser),
      correct: detA
    })

    const scorePercent = rows.reduce((s, r) => s + r.gained, 0)

    onDone?.({
      scorePercent,
      rows,
      detCorrect: detA,
      klass: `cofactor-${data.type}`,
      params: { t1: t1.pos, t2: t2.pos, Aask: askA.label, Mask: askM.label, X: data.X },
      A,
    })
  }

  // ── Рендер ───────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* CHANGED: заголовок ближе к ТЗ */}
      <h2>Вычисление определителя матрицы разложением по алгебраическим дополнениям</h2>

      <div style={{ marginBottom: 6 }}>
        <Formula latex={`A = \\begin{pmatrix}${A.map(r=>r.join(' & ')).join(' \\\\ ')}\\end{pmatrix}`} />
      </div>
      <Formula latex={headerLatex} />

      {/* Шаг 1: разложение (динамическое число слагаемых) */}
      {step === 1 && (
        <>
          {/* CHANGED: формулировка вопроса по ТЗ */}
          <SectionTitle>Введите результат разложения:</SectionTitle>

          {terms.map((t, idx) => (
            <Row key={idx} gutter={10} align="top" style={{ marginBottom: 10 }}>
              <Col flex="120px">Слагаемое {idx + 1}:</Col>
              <Col flex="120px">
                <Select
                  placeholder="знак"
                  style={{ width: '100%' }}
                  options={[{ label: '+', value: 1 }, { label: '−', value: -1 }]}
                  value={t.sign}
                  onChange={(v) => setTerms(ts => ts.map((x, i) => i === idx ? { ...x, sign: v } : x))}
                />
              </Col>
              <Col flex="140px">
                <InputNumber
                  placeholder="коэффициент"
                  style={{ width: '100%' }}
                  value={t.coef}
                  onChange={(v) => setTerms(ts => ts.map((x, i) => i === idx ? { ...x, coef: v } : x))}
                />
              </Col>
              <Col flex="auto">
                <div style={{ display: 'inline-block', padding: '8px', background: '#f9fbff', border: '1px solid #e5eefb', borderRadius: 8 }}>
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      {Array.from({ length: 3 }, (_, j) => (
                        <InputNumber key={j} value={t.B[i][j]} onChange={(v) => updateTermB(idx, i, j, v)} style={{ width: 90 }} />
                      ))}
                    </div>
                  ))}
                </div>
              </Col>
              <Col flex="90px">
                <Button danger onClick={() => removeTerm(idx)} disabled={terms.length <= 1}>удалить</Button>
              </Col>
            </Row>
          ))}

          <Actions>
            <Button onClick={addTerm} disabled={terms.length >= A.length}>добавить</Button>
          </Actions>

          <Actions>
            <Button
              type="primary"
              onClick={() => setStep(2)}
              disabled={
                terms.length === 0 ||
                terms.some(t => t.sign === undefined || t.coef === undefined || t.B.some(r => r.some(v => v === undefined)))
              }
            >Далее</Button>
          </Actions>
        </>
      )}

      {/* Шаг 2: A_{ij} */}
      {step === 2 && (
        <>
          <SectionTitle>Шаг 2 — алгебраическое дополнение</SectionTitle>
          {/* ⬇️ тут был обычный текст {askA.label}; заменили на инлайн-KaTeX */}
          <Row gutter={10} align="middle" style={{ marginBottom: 10 }}>
            <Col flex="380px">
              Введите значение алгебраического дополнения элемента <InlineMath latex={askA.label} />:
            </Col>
            <Col flex="200px">
              <InputNumber style={{ width: '100%' }} value={Aask} onChange={setAask} />
            </Col>
          </Row>
          <Actions>
            <Button onClick={() => setStep(1)}>Назад</Button>
            <Button type="primary" onClick={() => setStep(3)} disabled={Aask === undefined}>Далее</Button>
          </Actions>
        </>
      )}

      {/* Шаг 3: M_{ij} и det(A) */}
      {step === 3 && (
        <>
          <SectionTitle>Шаг 3 — минор и det(A)</SectionTitle>
          {/* ⬇️ и здесь — инлайн-KaTeX для M_{..} */}
          <Row gutter={10} align="middle" style={{ marginBottom: 10 }}>
            <Col flex="380px">
              Введите значение минора элемента <InlineMath latex={askM.label} />:
            </Col>
            <Col flex="200px">
              <InputNumber style={{ width: '100%' }} value={Mask} onChange={setMask} />
            </Col>
          </Row>

          <Row gutter={10} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="380px">Введите определитель матрицы det(A):</Col>
            <Col flex="200px">
              <InputNumber style={{ width: '100%' }} value={detUser} onChange={setDetUser} />
            </Col>
          </Row>

          <Actions>
            <Button onClick={() => setStep(2)}>Назад</Button>
            <Button type="primary" onClick={checkAndFinish}>Проверить</Button>
          </Actions>
        </>
      )}
    </Box>
  )
}
