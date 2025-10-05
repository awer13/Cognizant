// src/DetTriangleTaskCombined.js
import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Row, Col, InputNumber, Button, Alert } from 'antd'
import 'katex/dist/katex.min.css'

// ───────────── UI ─────────────
const Box = styled.div`
  padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:12px;
`
const SectionTitle = styled.h3`margin:12px 0 8px 0;`

const Grid = styled.div`
  display:grid;
  grid-template-columns:repeat(3,84px);
  gap:8px;
  margin:8px 0 14px 0;
`

const CellBtn = styled.button`
  position:relative;
  height:64px;
  border-radius:12px;
  border:2px solid #d7e3f7;
  background:#fff;
  font-size:18px;
  cursor:pointer;
  box-shadow:0 1px 3px rgba(0,0,0,.06);
  transition:border-color .15s, background .15s, transform .05s;

  ${(p)=>p.$active ? `
    background:#eef6ff;
    box-shadow: inset 0 0 0 2px rgba(108,160,255,.7);
    font-weight:700;
  ` : ''}

  ${(p)=>p.$pindex ? `border-color:${p.$color};` : ''}

  &:active{ transform:scale(0.98); }
`

const PBadge = styled.span`
  position:absolute;
  top:-8px; right:-8px;
  background:${p=>p.$color};
  color:#fff;
  font-size:11px;
  line-height:1;
  padding:4px 6px;
  border-radius:10px;
  box-shadow:0 1px 3px rgba(0,0,0,.15);
`

// ——— подсказка справа от кнопки фиксации — с мягким пульсом, когда ждём действия
const Hint = styled.span`
  margin-left:10px;
  color:#6b7da6;
  font-size:13px;
  opacity:${p=>p.$enabled ? 1 : 0.4};
  ${(p)=>p.$pulse ? `
    animation: pulse 1.2s ease-in-out infinite;
  `: ''}

  @keyframes pulse {
    0% { opacity: 1 }
    50% { opacity: 0.55 }
    100% { opacity: 1 }
  }
`

const Actions = styled.div`display:flex; gap:8px; margin-top:10px;`

// ——— метка вопроса: красная и пульсирующая, пока не отвечено; приглушённая — когда отвечено
const QLabel = styled.span`
  display:inline-block;
  font-weight:${p => p.$state === 'pending' ? 700 : 600};
  color:
    ${p => p.$state === 'pending' ? '#c0392b' : p.$state === 'done' ? '#6b7da6' : 'inherit'};
  ${(p)=>p.$state === 'pending' ? 'animation: qpulse 1s ease-in-out infinite;' : ''}

  @keyframes qpulse {
    0% { transform: translateY(0) }
    50% { transform: translateY(-1px) }
    100% { transform: translateY(0) }
  }
`

// ───────────── Math helpers ─────────────
const EPS = 1e-6
const near = (a,b,eps=EPS) => Number.isFinite(+a) && Math.abs(+a - +b) <= eps
function mulberry32(a){return function(){let t=(a+=0x6D2B79F5);t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const randIntRng=(rng,a,b)=>a+Math.floor(rng()*(b-a+1))
const choiceRng=(rng,arr)=>arr[Math.floor(rng()*arr.length)]

// ───────────── Генерация матриц ─────────────
function genMatrix1(rng){
  const c = choiceRng(rng,[1,2,3])
  const x1 = randIntRng(rng,0,9)
  const x2 = randIntRng(rng,-8,-1)
  let x3 = randIntRng(rng,1,11); if (x3===x1) x3 = x3===11?10:x3+1
  return { A:[[c,x1,x1**2],[c,x2,x2**2],[c,x3,x3**2]], params:{c,x1,x2,x3} }
}
function genMatrix2(rng){
  const a = choiceRng(rng,[-3,-2,-1,1,2,3])
  const x = randIntRng(rng,0,9), y = randIntRng(rng,-8,-1)
  let z = randIntRng(rng,1,11); if (z===x) z = z===11?10:z+1
  return { A:[[x*x+a*a,a*x,1],[y*y+a*a,a*y,1],[z*z+a*a,a*z,1]], params:{a,x,y,z} }
}
function genMatrix3(rng){
  const a = randIntRng(rng,1,9), x = randIntRng(rng,10,20)
  return { A:[[1+a*x,x,1],[a,x,0],[1,0,a]], params:{a,x} }
}
function genMatrix4(rng){
  const a = randIntRng(rng,1,9), b = randIntRng(rng,1,9)
  const x = Math.floor(2*a*b)+1
  return { A:[[x,a,a],[b,x,0],[b,0,x]], params:{a,b,x} }
}

// ───────────── Паттерны треугольника (координаты) ─────────────
// P1..P3
const POS_PATTERNS = {
  pos1: [[0,0],[1,1],[2,2]],
  pos2: [[0,1],[1,2],[2,0]],
  pos3: [[0,2],[1,0],[2,1]],
}
// P4..P6
const NEG_PATTERNS = {
  neg1: [[0,2],[1,1],[2,0]],
  neg2: [[0,0],[1,2],[2,1]],
  neg3: [[0,1],[1,0],[2,2]],
}

const setKey = (cells) => cells
  .slice().sort((a,b)=>(a[0]-b[0])|| (a[1]-b[1]))
  .map(([i,j])=>`${i}${j}`).join('|')

const patternIndex = (cells, type) => {
  const key = setKey(cells)
  const dict = type==='pos'?POS_PATTERNS:NEG_PATTERNS
  return Object.entries(dict).find(([,coords])=> setKey(coords)===key)?.[0] || null
}

const productFor = (A, coords) => coords.reduce((p,[i,j])=>p*A[i][j],1)

// цвета для подсветки подтверждённых троек
const P_COLORS = { 1:'#2f8aeb', 2:'#e67e22', 3:'#9b59b6', 4:'#16a085', 5:'#c0392b', 6:'#7f8c8d' }

// строим карту ячеек, входящих в уже подтверждённые Pk.
function buildConfirmedCellMap(posPick, negPick, step){
  const map = new Map()
  const push = (pindex, coords) => coords.forEach(([i,j])=>{
    map.set(`${i}${j}`, { pindex, color: P_COLORS[pindex] })
  })
  if (step===1){
    if (posPick[1]) push(1, POS_PATTERNS[posPick[1]])
    if (posPick[2]) push(2, POS_PATTERNS[posPick[2]])
    if (posPick[3]) push(3, POS_PATTERNS[posPick[3]])
  } else {
    if (negPick[4]) push(4, NEG_PATTERNS[negPick[4]])
    if (negPick[5]) push(5, NEG_PATTERNS[negPick[5]])
    if (negPick[6]) push(6, NEG_PATTERNS[negPick[6]])
  }
  return map
}

// ───────────── Компонент ─────────────
export default function DetTriangleTaskCombined({ taskNumber, onDone }) {
  const klass = useMemo(()=> ((Number(taskNumber)-1)%4)+1, [taskNumber])
  const rng = useMemo(()=> mulberry32(0x9e3779b9 ^ (Number(taskNumber)||1)), [taskNumber])

  const { A, params } = useMemo(()=>{
    if (klass===1) return genMatrix1(rng)
    if (klass===2) return genMatrix2(rng)
    if (klass===3) return genMatrix3(rng)
    return genMatrix4(rng)
  }, [klass, rng])

  // шаги: 1 = P1..P3, 2 = P4..P6, 3 = det
  const [step, setStep] = useState(1)

  // текущее временное выделение (до трёх элементов)
  const [sel, setSel] = useState([])
  useEffect(() => { setSel([]) }, [step]) // очистка при смене шага

  // фиксации и значения
  const [posPick, setPosPick] = useState({1:null,2:null,3:null})
  const [posVal, setPosVal]   = useState({1:undefined,2:undefined,3:undefined})
  const [negPick, setNegPick] = useState({4:null,5:null,6:null})
  const [negVal, setNegVal]   = useState({4:undefined,5:undefined,6:undefined})
  const [valDet, setValDet]   = useState()

  // refs для автофокуса
  const posRefs = useRef({1:null,2:null,3:null})
  const negRefs = useRef({4:null,5:null,6:null})
  const detRef  = useRef(null)

  const curIndex = step===1 ? ( !posPick[1]?1 : !posPick[2]?2 : 3 )
                           : ( !negPick[4]?4 : !negPick[5]?5 : 6 )

  const toggleCell = (i,j) => {
    setSel(prev=>{
      const ex = prev.findIndex(([r,c])=> r===i && c===j)
      if (ex>=0) { const cp=prev.slice(); cp.splice(ex,1); return cp }
      if (prev.length>=3) return prev
      return [...prev,[i,j]]
    })
  }

  const confirmSelection = () => {
    if (sel.length!==3) return
    const kind = step===1 ? 'pos' : 'neg'
    const id = patternIndex(sel, kind)
    if (!id) { alert('Нужно выбрать ровно 3 элемента, соответствующие одному из треугольников.'); return }

    const setHas = step===1 ? new Set(Object.values(posPick).filter(Boolean))
                            : new Set(Object.values(negPick).filter(Boolean))
    if (setHas.has(id)) { alert('Эта тройка уже использована. Выберите другую.'); return }

    if (step===1) {
      if (!posPick[1]) {
        setPosPick(p=>({...p,1:id}))
        setTimeout(()=> posRefs.current[1]?.focus?.(), 0)
      } else if (!posPick[2]) {
        setPosPick(p=>({...p,2:id}))
        setTimeout(()=> posRefs.current[2]?.focus?.(), 0)
      } else {
        setPosPick(p=>({...p,3:id}))
        setTimeout(()=> posRefs.current[3]?.focus?.(), 0)
      }
    } else {
      if (!negPick[4]) {
        setNegPick(p=>({...p,4:id}))
        setTimeout(()=> negRefs.current[4]?.focus?.(), 0)
      } else if (!negPick[5]) {
        setNegPick(p=>({...p,5:id}))
        setTimeout(()=> negRefs.current[5]?.focus?.(), 0)
      } else {
        setNegPick(p=>({...p,6:id}))
        setTimeout(()=> negRefs.current[6]?.focus?.(), 0)
      }
    }
    setSel([])
  }

  const cellIsActive = (i,j) => sel.some(([r,c])=> r===i && c===j)
  const confirmedMap = useMemo(()=>buildConfirmedCellMap(posPick, negPick, step), [posPick, negPick, step])

  const checkAndScore = () => {
    const weights = Array(12).fill(7.5).concat(10)
    const rows = []
    const push=(key,label,entered,correct,ok,w,g)=> rows.push({key,label,entered,correct,ok,w,gained:g})
    let score = 0
    const add=(ok,w)=> (ok?(score+=w,w):0)

    for (let i=1;i<=3;i++){
      const pick = posPick[i]
      const okPick = !!pick
      push(i*2-1, `Формирование P${i}`, okPick ? '✓' : '', '', okPick, weights[i*2-2], add(okPick,weights[i*2-2]))
      const corr = pick ? productFor(A, POS_PATTERNS[pick]) : NaN
      const okVal = near(posVal[i] ?? NaN, corr)
      push(i*2, `Значение P${i}`, posVal[i], corr, okVal, weights[i*2-1], add(okVal,weights[i*2-1]))
    }

    for (const i of [4,5,6]){
      const pick = negPick[i]
      const base = 6 + (i-4)*2
      const okPick = !!pick
      push(base+1, `Формирование P${i}`, okPick ? '✓' : '', '', okPick, weights[base], add(okPick,weights[base]))
      const corr = pick ? productFor(A, NEG_PATTERNS[pick]) : NaN
      const okVal = near(negVal[i] ?? NaN, corr)
      push(base+2, `Значение P${i}`, negVal[i], corr, okVal, weights[base+1], add(okVal,weights[base+1]))
    }

    const sumPos =
      (posPick[1]?productFor(A,POS_PATTERNS[posPick[1]]):NaN) +
      (posPick[2]?productFor(A,POS_PATTERNS[posPick[2]]):NaN) +
      (posPick[3]?productFor(A,POS_PATTERNS[posPick[3]]):NaN)
    const sumNeg =
      (negPick[4]?productFor(A,NEG_PATTERNS[negPick[4]]):NaN) +
      (negPick[5]?productFor(A,NEG_PATTERNS[negPick[5]]):NaN) +
      (negPick[6]?productFor(A,NEG_PATTERNS[negPick[6]]):NaN)
    const corrDet = sumPos - sumNeg
    const okDet = near(Number(valDet), corrDet)
    push(13, 'Определитель Δ (Δ)', Number(valDet), corrDet, okDet, weights[12], add(okDet,weights[12]))

    const total = Math.round(score*100)/100
    onDone?.({ scorePercent: total, rows, detCorrect: corrDet, klass, params, A })
  }

  // текст заголовка шага
  const title =
    step===1
      ? `Отметьте элементы матрицы A, по которым определяется P${curIndex}:`
      : step===2
      ? `Отметьте элементы матрицы A, по которым определяется P${curIndex}:`
      : 'Вычислите определитель матрицы и введите:'

  const canGoNextStep =
    (step===1 && posPick[1] && posPick[2] && posPick[3] &&
      posVal[1]!=null && posVal[2]!=null && posVal[3]!=null) ||
    (step===2 && negPick[4] && negPick[5] && negPick[6] &&
      negVal[4]!=null && negVal[5]!=null && negVal[6]!=null)

  // какая подсказка справа от кнопки
  const nextHintIndex =
    step===1 ? (!posPick[1] ? 1 : !posPick[2] ? 2 : 3)
             : (!negPick[4] ? 4 : !negPick[5] ? 5 : 6)
  const hintEnabled =
    step===1 ? !!posPick[1] || !!posPick[2]
             : !!negPick[4] || !!negPick[5]

  // состояния вопросов (pending/done) для окраски
  const qState = (hasPick, val) => {
    if (!hasPick) return null
    return (val == null) ? 'pending' : 'done'
  }

  return (
    <Box>
      <h2>Вычисление определителя матрицы по формуле треугольника</h2>

      {/* Матрица A */}
      <Grid>
        {A.map((row,i)=> row.map((val,j)=>{
          const key=`${i}-${j}`
          const active = cellIsActive(i,j)
          const meta = confirmedMap.get(`${i}${j}`) // {pindex,color} | undefined
          return (
            <CellBtn
              key={key}
              onClick={()=>toggleCell(i,j)}
              $active={active}
              $pindex={meta?.pindex}
              $color={meta?.color}
              title={meta ? `Этот элемент входит в P${meta.pindex}` : undefined}
            >
              {val}
              {meta && <PBadge $color={meta.color}>P{meta.pindex}</PBadge>}
            </CellBtn>
          )
        }))}
      </Grid>

      {step!==3 && (
        <>
          <SectionTitle>{title}</SectionTitle>

          <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="220px">
              <Button
                onClick={confirmSelection}
                disabled={
                  sel.length!==3 ||
                  (step===1 && posPick[1] && posPick[2] && posPick[3]) ||
                  (step===2 && negPick[4] && negPick[5] && negPick[6])
                }
              >
                Зафиксировать P{curIndex}
              </Button>
              <Hint $enabled={hintEnabled} $pulse={!hintEnabled}>
                Отметьте элементы матрицы A для P{nextHintIndex}
              </Hint>
            </Col>
            <Col flex="auto">
              {sel.length>0 && <Alert type="info" showIcon message="Выделите ровно 3 элемента, соответствующие одному из трреугольников." />}
            </Col>
          </Row>

          {/* ПОЛЯ ВВОДА для уже зафиксированных на текущем шаге */}
          {step===1 && (
            <>
              {posPick[1] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(posPick[1], posVal[1])}>Значение P1:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (posRefs.current[1]=el)}
                      style={{ width:'100%' }}
                      value={posVal[1]}
                      onChange={(v)=>setPosVal(s=>({...s,1:v}))}
                    />
                  </Col>
                </Row>
              )}
              {posPick[2] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(posPick[2], posVal[2])}>Значение P2:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (posRefs.current[2]=el)}
                      style={{ width:'100%' }}
                      value={posVal[2]}
                      onChange={(v)=>setPosVal(s=>({...s,2:v}))}
                    />
                  </Col>
                </Row>
              )}
              {posPick[3] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(posPick[3], posVal[3])}>Значение P3:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (posRefs.current[3]=el)}
                      style={{ width:'100%' }}
                      value={posVal[3]}
                      onChange={(v)=>setPosVal(s=>({...s,3:v}))}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}

          {step===2 && (
            <>
              {negPick[4] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(negPick[4], negVal[4])}>Значение P4:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (negRefs.current[4]=el)}
                      style={{ width:'100%' }}
                      value={negVal[4]}
                      onChange={(v)=>setNegVal(s=>({...s,4:v}))}
                    />
                  </Col>
                </Row>
              )}
              {negPick[5] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(negPick[5], negVal[5])}>Значение P5:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (negRefs.current[5]=el)}
                      style={{ width:'100%' }}
                      value={negVal[5]}
                      onChange={(v)=>setNegVal(s=>({...s,5:v}))}
                    />
                  </Col>
                </Row>
              )}
              {negPick[6] && (
                <Row gutter={8} align="middle" style={{ marginBottom: 6 }}>
                  <Col flex="180px">
                    <QLabel $state={qState(negPick[6], negVal[6])}>Значение P6:</QLabel>
                  </Col>
                  <Col flex="220px">
                    <InputNumber
                      ref={(el)=> (negRefs.current[6]=el)}
                      style={{ width:'100%' }}
                      value={negVal[6]}
                      onChange={(v)=>setNegVal(s=>({...s,6:v}))}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}

          <Actions>
            {step===2 && <Button onClick={()=>setStep(1)}>Назад</Button>}
            <Button type="primary" onClick={()=> {
              if (step===1) {
                // перед переходом во 2-й шаг — сфокусируемся на первом вопросе шага 2 после фиксации
                setStep(2)
                setTimeout(()=> negRefs.current[4]?.focus?.(), 0)
              } else {
                setStep(3)
                setTimeout(()=> detRef.current?.focus?.(), 0)
              }
            }} disabled={!canGoNextStep}>Далее</Button>
          </Actions>
        </>
      )}

      {step===3 && (
        <>
          <SectionTitle>Вычислите определитель матрицы и введите:</SectionTitle>
          <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="180px">
              <QLabel $state={valDet==null ? 'pending' : 'done'}>Δ = det(A):</QLabel>
            </Col>
            <Col flex="220px">
              <InputNumber
                ref={detRef}
                style={{ width:'100%' }}
                value={valDet}
                onChange={setValDet}
                parser={(v)=>Number(String(v).replace(',', '.'))}
              />
            </Col>
          </Row>
          <Actions>
            <Button onClick={()=>{ setStep(2); setTimeout(()=> negRefs.current[6]?.focus?.(), 0) }}>Назад</Button>
            <Button type="primary" onClick={checkAndScore}>Проверить</Button>
          </Actions>
        </>
      )}
    </Box>
  )
}
