// src/DetCofactorEffTaskCombined.js
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Select, InputNumber, Button, Divider, Alert } from 'antd'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─── UI helpers ────────────────────────────────────────────────────────────────
const Box = styled.div`
  padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:12px;
`
const SectionTitle = styled.h3`margin:12px 0 8px 0;`
const Actions = styled.div`display:flex; gap:8px; margin-top:10px;`

const Formula = ({ latex }) => (
  <div
    style={{ margin: '6px 0' }}
    dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false }) }}
  />
)

// ─── Math helpers ──────────────────────────────────────────────────────────────
const EPS = 1e-9
const near = (a, b, eps = EPS) => Number.isFinite(+a) && Number.isFinite(+b) && Math.abs(a - b) <= eps

// дет через Гаусса
function detOf(matrix) {
  const n = matrix.length
  if (n === 0) return 1
  const a = matrix.map(row => row.map(Number))
  let sign = 1
  for (let i = 0; i < n; i++) {
    let piv = i
    for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[piv][i])) piv = r
    if (Math.abs(a[piv][i]) < EPS) return 0
    if (piv !== i) { [a[piv], a[i]] = [a[i], a[piv]]; sign *= -1 }
    const inv = 1 / a[i][i]
    for (let r = i + 1; r < n; r++) {
      const f = a[r][i] * inv
      if (Math.abs(f) < EPS) continue
      for (let c = i; c < n; c++) a[r][c] -= f * a[i][c]
    }
  }
  let d = sign
  for (let i = 0; i < n; i++) d *= a[i][i]
  return Math.abs(d) < EPS ? 0 : d
}

// PRNG (фиксируем вариант по номеру)
function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const randint = (rng, a, b) => a + Math.floor(rng() * (b - a + 1))

// ─── Генерация «сырой» матрицы (БЕЗ предварительного зануления линии) ─────────
function genRawMatrix({ seed, size = 4 }) {
  const rng = mulberry32(seed)
  const A0 = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => randint(rng, -3, 6))
  )
  return { A0, size }
}

// ─── Рендер LaTeX матриц ───────────────────────────────────────────────────────
function renderMatrix(A, name = 'A') {
  const rows = A.map(r => r.join(' & ')).join(' \\\\ ')
  const latex = `${name} = \\begin{pmatrix} ${rows} \\end{pmatrix}`
  return <Formula latex={latex} />
}

const signOptions = [
  { label: '+', value: 1 },
  { label: '−', value: -1 },
]

// ─── Elementary ops UI helpers ─────────────────────────────────────────────────
const opTypeOptions = [
  { label: 'Перестановка строк', value: 'swap_rows' },
  { label: 'Перестановка столбцов', value: 'swap_cols' },
  { label: 'Умножить строку на k (k≠0)', value: 'scale_row' },
  { label: 'Умножить столбец на k (k≠0)', value: 'scale_col' },
  { label: 'Строка i := i + t·j', value: 'add_row' },
  { label: 'Столбец i := i + t·j', value: 'add_col' },
]

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * props:
 * - taskNumber: number — seed/вариант
 * - onDone({ scorePercent, rows, detCorrect, klass, params, A })
 */
export default function DetCofactorEffTaskCombined({ taskNumber, onDone }) {
  const seed = 0xabcdef ^ (Number(taskNumber) || 1)

  // базовая «сырая» матрица
  const data = useMemo(() => genRawMatrix({ seed, size: 4 }), [seed])
  const N = data.A0.length

  // текущая рабочая матрица (меняется от преобразований)
  const [Awork, setAwork] = useState(data.A0.map(r => r.slice()))
  // множитель детерминанта от сделанных операций: det(Awork) = detMul * det(A0)
  const [detMul, setDetMul] = useState(1)

  // история (информативно)
  const [ops, setOps] = useState([])

  // ── UI состояния для операций
  const [opType, setOpType] = useState('swap_rows')
  const [iIdx, setIIdx] = useState()
  const [jIdx, setJIdx] = useState()
  const [kVal, setKVal] = useState() // для scale
  const [tVal, setTVal] = useState() // для add

  // применить элементарную операцию
  const applyOp = () => {
    const i = Number(iIdx), j = Number(jIdx)
    const k = Number(kVal), t = Number(tVal)
    const within = (x) => Number.isInteger(x) && x >= 1 && x <= N
    const clone = Awork.map(r => r.slice())
    let newMul = detMul
    let ok = false
    let label = ''

    switch (opType) {
      case 'swap_rows':
        if (within(i) && within(j) && i !== j) {
          ;[clone[i - 1], clone[j - 1]] = [clone[j - 1], clone[i - 1]]
          newMul *= -1
          ok = true
          label = `R${i} ↔ R${j}`
        }
        break
      case 'swap_cols':
        if (within(i) && within(j) && i !== j) {
          for (let r = 0; r < N; r++) [clone[r][i - 1], clone[r][j - 1]] = [clone[r][j - 1], clone[r][i - 1]]
          newMul *= -1
          ok = true
          label = `C${i} ↔ C${j}`
        }
        break
      case 'scale_row':
        if (within(i) && Number.isFinite(k) && Math.abs(k) > EPS) {
          for (let c = 0; c < N; c++) clone[i - 1][c] *= k
          newMul *= k
          ok = true
          label = `R${i} := ${k}·R${i}`
        }
        break
      case 'scale_col':
        if (within(i) && Number.isFinite(k) && Math.abs(k) > EPS) {
          for (let r = 0; r < N; r++) clone[r][i - 1] *= k
          newMul *= k
          ok = true
          label = `C${i} := ${k}·C${i}`
        }
        break
      case 'add_row':
        if (within(i) && within(j) && i !== j && Number.isFinite(t)) {
          for (let c = 0; c < N; c++) clone[i - 1][c] += t * clone[j - 1][c]
          // det не меняется
          ok = true
          label = `R${i} := R${i} + ${t}·R${j}`
        }
        break
      case 'add_col':
        if (within(i) && within(j) && i !== j && Number.isFinite(t)) {
          for (let r = 0; r < N; r++) clone[r][i - 1] += t * clone[r][j - 1]
          // det не меняется
          ok = true
          label = `C${i} := C${i} + ${t}·C${j}`
        }
        break
      default: break
    }

    if (ok) {
      setAwork(clone)
      setDetMul(newMul)
      setOps(prev => [...prev, { label }])
    }
  }

  const resetOps = () => {
    setAwork(data.A0.map(r => r.slice()))
    setDetMul(1)
    setOps([])
    setIIdx(undefined); setJIdx(undefined); setKVal(undefined); setTVal(undefined)
  }

  // ── шаги (0: преобразования → 1: выбор X,n,m,c → 2: ввод B/знак/коэф → 3: доп. и det(A0))
  const [step, setStep] = useState(0)

  // вводы студента (как и раньше)
  const [xType, setXType] = useState(null) // 'row' | 'col'
  const [nUser, setNUser] = useState()
  const [mUser, setMUser] = useState()
  const [cUser, setCUser] = useState()

  const [signUser, setSignUser] = useState(undefined) // 1 or -1
  const [coefUser, setCoefUser] = useState() // коэффициент в формуле detA' = sign*coef*detB'
  const [BUser, setBUser] = useState(
    Array.from({ length: N - 1 }, () =>
      Array.from({ length: N - 1 }, () => undefined)
    )
  )

  const [cofactorUser, setCofactorUser] = useState()
  const [detAUser, setDetAUser] = useState() // det исходной матрицы A0

  // helpers для сетки ввода B
  const updateB = (i, j, val) => {
    setBUser(prev => {
      const next = prev.map(r => r.slice())
      next[i][j] = val
      return next
    })
  }

  // минор текущей матрицы Awork
  const minorOf = (A, rm, cm) => A.filter((_, i) => i !== rm).map(r => r.filter((_, j) => j !== cm))

  // ── проверка
  const checkAndFinish = () => {
    // 1) Разложение: сверяем X, n, m, c и матрицу B — ВСЁ по текущей Awork
    let okDecomp = true
    okDecomp = okDecomp && (xType === 'row' || xType === 'col')
    okDecomp = okDecomp && Number(nUser) >= 1 && Number(nUser) <= N
    okDecomp = okDecomp && Number(mUser) >= 1 && Number(mUser) <= N

    const n0 = Number(nUser) - 1
    const m0 = Number(mUser) - 1
    const cFromA = (xType === 'row') ? Awork[n0][m0] : Awork[m0][n0]
    okDecomp = okDecomp && near(Number(cUser), cFromA)

    // корректность введенного B
    const Bexp = (xType === 'row')
      ? minorOf(Awork, n0, m0)
      : minorOf(Awork, m0, n0)
    let Bok = true
    for (let i = 0; i < Bexp.length; i++) {
      for (let j = 0; j < Bexp.length; j++) {
        if (!near(Number(BUser[i][j]), Bexp[i][j])) { Bok = false; break }
      }
      if (!Bok) break
    }
    okDecomp = okDecomp && Bok

    // 2) Знак: (-1)^{n+m}
    const signExp = ((Number(nUser) + Number(mUser)) % 2 === 0) ? 1 : -1
    const okSign = Number(signUser) === signExp

    // 3) Алгебраическое дополнение = (-1)^{n+m} * det(Bexp)
    const detBexp = detOf(Bexp)
    const okCofactor = near(Number(cofactorUser), signExp * detBexp)

    // 4) Итог det(A0): сначала det текущей матрицы по разложению,
    // затем учесть произведённые преобразования: det(A0) = det(Awork) / detMul
    const coefIsOk = near(Number(coefUser), cFromA)
    const detWorkByDecomp = signExp * Number(coefUser) * detBexp
    const detA0exp = near(detMul, 0) ? NaN : detWorkByDecomp / detMul
    const okDet = coefIsOk && near(Number(detAUser), detA0exp)

    const rows = [
      { key: 1, label: 'Разложение', pick: '', studentValue: '', correctValue: '', ok: okDecomp, w: 25, gained: okDecomp ? 25 : 0 },
      { key: 2, label: 'Знак в разложении', pick: '', studentValue: signUser, correctValue: signExp, ok: okSign, w: 25, gained: okSign ? 25 : 0 },
      { key: 3, label: 'Алгебраическое дополнение', pick: '', studentValue: cofactorUser, correctValue: signExp * detBexp, ok: okCofactor, w: 25, gained: okCofactor ? 25 : 0 },
      { key: 4, label: 'Определитель det(A)', pick: '', studentValue: detAUser, correctValue: detA0exp, ok: okDet, w: 25, gained: okDet ? 25 : 0 },
    ]
    const scorePercent = rows.reduce((s, r) => s + r.gained, 0)

    onDone?.({
      scorePercent,
      rows,
      detCorrect: detA0exp, // дет исходной матрицы
      klass: 'cofactorEff',
      params: { xType, n: Number(nUser), m: Number(mUser), detMul },
      A: Awork, // можно передать текущую, но отчёт её не рисует
    })
  }

  // ─── рендер ──────────────────────────────────────────────────────────────────
  const sizeB = N - 1
  const xOptions = [
    { label: 'строка', value: 'row' },
    { label: 'столбец', value: 'col' },
  ]

  return (
    <Box>
      <h2>Задание 2: Вычислить определитель матрицы методом эффективного понижения порядка</h2>

      {/* Всегда показываем текущую матрицу A (после преобразований) */}
      {renderMatrix(Awork, 'A')}
      <Formula latex={'\\text{Сначала выполните элементарные преобразования, затем разложите по элементам строки/столбца с единственным ненулевым элементом.}'} />

      {/* ── ШАГ 0: Преобразования ─────────────────────────────────────────────── */}
      {step === 0 && (
        <>
          <SectionTitle>Шаг 0 — элементарные преобразования матрицы</SectionTitle>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 10 }}
            message="Допустимые операции и их влияние на det(A)"
            description={
              <div>
                <div>Rᵢ ↔ Rⱼ или Cᵢ ↔ Cⱼ: det меняет знак.</div>
                <div>Rᵢ := k·Rᵢ или Cᵢ := k·Cᵢ (k≠0): det умножается на k.</div>
                <div>Rᵢ := Rᵢ + t·Rⱼ или Cᵢ := Cᵢ + t·Cⱼ: det не меняется.</div>
              </div>
            }
          />

          <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="260px">Операция:</Col>
            <Col flex="300px">
              <Select style={{ width: '100%' }} options={opTypeOptions} value={opType} onChange={setOpType} />
            </Col>
          </Row>

          {/* Параметры операций */}
          {(opType === 'swap_rows' || opType === 'swap_cols' || opType === 'add_row' || opType === 'add_col') && (
            <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
              <Col flex="180px">Индекс i:</Col>
              <Col flex="160px"><InputNumber style={{ width:'100%' }} value={iIdx} onChange={setIIdx} min={1} max={N}/></Col>
              <Col flex="120px">Индекс j:</Col>
              <Col flex="160px"><InputNumber style={{ width:'100%' }} value={jIdx} onChange={setJIdx} min={1} max={N}/></Col>
              {(opType === 'add_row' || opType === 'add_col') && (
                <>
                  <Col flex="120px">t:</Col>
                  <Col flex="160px"><InputNumber style={{ width:'100%' }} value={tVal} onChange={setTVal}/></Col>
                </>
              )}
            </Row>
          )}

          {(opType === 'scale_row' || opType === 'scale_col') && (
            <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
              <Col flex="180px">Индекс {opType === 'scale_row' ? 'строки' : 'столбца'} i:</Col>
              <Col flex="160px"><InputNumber style={{ width:'100%' }} value={iIdx} onChange={setIIdx} min={1} max={N}/></Col>
              <Col flex="120px">Множитель k (≠0):</Col>
              <Col flex="160px"><InputNumber style={{ width:'100%' }} value={kVal} onChange={setKVal}/></Col>
            </Row>
          )}

          <Actions>
            <Button onClick={resetOps}>Сбросить преобразования</Button>
            <Button type="primary" onClick={applyOp}>Применить операцию</Button>
          </Actions>

          {ops.length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: 6, fontWeight: 600 }}>Выполненные операции (в порядке применения):</div>
              <ul style={{ marginTop: 4 }}>
                {ops.map((o, idx) => <li key={idx} style={{ lineHeight: 1.6 }}>{o.label}</li>)}
              </ul>
            </>
          )}

          <Actions>
            <Button type="primary" onClick={() => setStep(1)}>Далее</Button>
          </Actions>
        </>
      )}

      {/* ── ШАГ 1: выбор X (строка/столбец), n, m и значение c ──────────────── */}
      {step === 1 && (
        <>
          <SectionTitle>Шаг 1 — выбор строки/столбца и координат ненулевого элемента</SectionTitle>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="300px">Что получилось после преобразований:</Col>
            <Col flex="220px">
              <Select
                style={{ width: '100%' }}
                value={xType}
                onChange={setXType}
                options={xOptions}
                placeholder="строка / столбец"
              />
            </Col>
            <Col flex="auto">с единственным ненулевым элементом.</Col>
          </Row>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="420px">
              Введите номер <b>n</b> ({xType === 'col' ? 'столбца' : 'строки'}):
            </Col>
            <Col flex="220px">
              <InputNumber style={{ width: '100%' }} value={nUser} onChange={setNUser} min={1} max={N}/>
            </Col>
          </Row>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="420px">
              Введите номер <b>m</b> ({xType === 'col' ? 'строки' : 'столбца'}), где расположен ненулевой элемент:
            </Col>
            <Col flex="220px">
              <InputNumber style={{ width: '100%' }} value={mUser} onChange={setMUser} min={1} max={N}/>
            </Col>
          </Row>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="420px">Значение ненулевого элемента <b></b>:</Col>
            <Col flex="220px">
              <InputNumber style={{ width: '100%' }} value={cUser} onChange={setCUser}/>
            </Col>
          </Row>

          <Actions>
            <Button onClick={() => setStep(0)}>Назад</Button>
            <Button type="primary" onClick={() => setStep(2)} disabled={!xType || !nUser || !mUser || (cUser===undefined)}>Далее</Button>
          </Actions>
        </>
      )}

      {/* ── ШАГ 2: ввод матрицы B (minor), знак и коэффициент ──────────────── */}
      {step === 2 && (
        <>
          <SectionTitle>Шаг 2 — разложение det(A) = знак · коэффициент · det(B)</SectionTitle>

          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 6 }}>
              <b>Матрица B</b>:
            </div>
            <div style={{ display:'inline-block', padding:'8px', background:'#f9fbff', border:'1px solid #e5eefb', borderRadius:8 }}>
              {Array.from({ length: sizeB }, (_, i) => (
                <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                  {Array.from({ length: sizeB }, (_, j) => (
                    <InputNumber
                      key={j}
                      value={BUser[i][j]}
                      onChange={(v) => updateB(i, j, v)}
                      style={{ width: 90 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="180px">Знак в разложении:</Col>
            <Col flex="180px">
              <Select style={{ width:'100%' }} options={signOptions} value={signUser} onChange={setSignUser} placeholder="+ / −" />
            </Col>
            <Col flex="160px">Коэффициент:</Col>
            <Col flex="180px">
              <InputNumber style={{ width:'100%' }} value={coefUser} onChange={setCoefUser}/>
            </Col>
          </Row>

          <Actions>
            <Button onClick={() => setStep(1)}>Назад</Button>
            <Button type="primary"
              onClick={() => setStep(3)}
              disabled={
                signUser===undefined || coefUser===undefined ||
                BUser.some(row => row.some(v => v===undefined))
              }
            >Далее</Button>
          </Actions>
        </>
      )}

      {/* ── ШАГ 3: алгебраическое дополнение и det(A0) ─────────────────────── */}
      {step === 3 && (
        <>
          <SectionTitle>Шаг 3 — алгебраическое дополнение и det(A)</SectionTitle>

          <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
            <Col flex="260px">Введите значение алгебраического дополнения в этом разложении:</Col>
            <Col flex="220px">
              <InputNumber style={{ width:'100%' }} value={cofactorUser} onChange={setCofactorUser}/>
            </Col>
          </Row>

          <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="260px">Итоговый det(A) исходной матрицы:</Col>
            <Col flex="220px">
              <InputNumber style={{ width:'100%' }} value={detAUser} onChange={setDetAUser}/>
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
