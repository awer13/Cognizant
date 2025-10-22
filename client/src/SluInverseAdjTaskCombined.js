// src/SluInverseAdjTaskCombined.js
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, InputNumber, Button, Select, Alert } from 'antd'
import katex from 'katex'
import 'katex/dist/katex.min.css'

import {
  mulberry32, randint, det3, cofactor, adjugate, inv3,
  latexMatrix, matMul, matEye, near
} from './SluCommonMath'

const Box = styled.div`padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:12px;`
const H3 = styled.h3`margin:12px 0 8px 0;`
const Formula = ({ latex }) => (
  <div style={{ margin: '6px 0' }}
       dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError:false }) }}/>
)
const TitleKx = ({ textLatex }) => (
  <H3 dangerouslySetInnerHTML={{ __html: katex.renderToString(textLatex, { throwOnError:false }) }} />
)

function genInvertible3(seed) {
  const rng = mulberry32(seed)
  while (true) {
    const A = Array.from({length:3},()=>Array.from({length:3},()=>randint(rng,-10,10)))
    if (det3(A) !== 0) return A
  }
}

// Helper to safely convert a value to a number, defaulting to 0
const toNumber = val => Number(val) || 0;
// Helper to safely convert an array of values to numbers
const toNumArray = arr => (arr || []).map(toNumber);
// Helper to safely convert a matrix of values to numbers
const toNumMatrix = matrix => (matrix || []).map(toNumArray);

export default function SluInverseAdjTaskCombined({ taskNumber, onDone }) {
  const seed = useMemo(()=> 0x51AD ^ (Number(taskNumber)||1), [taskNumber])

  const A    = useMemo(()=> genInvertible3(seed), [seed])
  const detA = useMemo(()=> det3(A), [A])
  const Adj  = useMemo(()=> adjugate(A), [A])
  const Ainv = useMemo(()=> inv3(A), [A])
  const cofJ = useMemo(()=> randint(mulberry32(seed ^ 0xBEE),0,2), [seed])
  const adjPick = useMemo(()=>{
    const rng = mulberry32(seed ^ 0xA11)
    const isRow = Math.floor(rng()*2)===0
    const k = randint(rng,0,2)
    return { isRow, k }
  },[seed])
  const prodType = useMemo(()=> (mulberry32(seed ^ 0xACE)()<0.5?'AAinv':'AinvA'), [seed])

  const [step, setStep] = useState(1)
  const [detUser, setDetUser] = useState()
  const [degFlag, setDegFlag] = useState()
  const [invFlag, setInvFlag] = useState()
  const [cofVals, setCofVals] = useState([undefined,undefined,undefined])
  const [adjLine, setAdjLine] = useState([undefined,undefined,undefined])
  const [userInv, setUserInv] = useState(Array.from({length:3},()=>Array(3).fill(undefined)))
  const [prodVal, setProdVal] = useState(Array.from({length:3},()=>Array(3).fill(undefined)))

  const updateMat = (setter,i,j,v)=> setter(prev=>{ const cp=prev.map(r=>r.slice()); cp[i][j]=v; return cp })

  const verify = () => {
    const rows=[]
    const W={det:11,deg:11,invFlag:11,cof1:11,cof2:11,cof3:11,adj:11,inv:12,prod:11}
    const tolerance = 0.01

    const okDet = near(toNumber(detUser), detA, tolerance)
    rows.push({ key:1, label:'Определитель \\det(A)', w:W.det, gained: okDet?W.det:0, correctAnswer: detA, studentAnswer: toNumber(detUser) })

    const okDeg = toNumber(degFlag)===1
    rows.push({ key:2, label:'Матрица невырождённая?', w:W.deg, gained: okDeg?W.deg:0, correctAnswer: 1, studentAnswer: toNumber(degFlag) })

    const okInvFlag = toNumber(invFlag)===1
    rows.push({ key:3, label:'Обратная существует?', w:W.invFlag, gained: okInvFlag?W.invFlag:0, correctAnswer: 1, studentAnswer: toNumber(invFlag) })

    const c1=cofactor(A,0,cofJ), c2=cofactor(A,1,cofJ), c3=cofactor(A,2,cofJ)
    rows.push({ key:4, label:`Алгебраическое дополнение A_{1${cofJ+1}}`, w:W.cof1, gained: near(toNumber(cofVals[0]),c1, tolerance)?W.cof1:0, correctAnswer: c1, studentAnswer: toNumber(cofVals[0]) })
    rows.push({ key:5, label:`Алгебраическое дополнение A_{2${cofJ+1}}`, w:W.cof2, gained: near(toNumber(cofVals[1]),c2, tolerance)?W.cof2:0, correctAnswer: c2, studentAnswer: toNumber(cofVals[1]) })
    rows.push({ key:6, label:`Алгебраическое дополнение A_{3${cofJ+1}}`, w:W.cof3, gained: near(toNumber(cofVals[2]),c3, tolerance)?W.cof3:0, correctAnswer: c3, studentAnswer: toNumber(cofVals[2]) })

    const expLine = adjPick.isRow ? Adj[adjPick.k] : [Adj[0][adjPick.k],Adj[1][adjPick.k],Adj[2][adjPick.k]]
    const okAdj = expLine.every((v,i)=> near(toNumber(adjLine[i]),v, tolerance))
    rows.push({ key:7, label: adjPick.isRow ? 'Строка \\operatorname{adj}(A)' : 'Столбец \\operatorname{adj}(A)', w:W.adj, gained: okAdj?W.adj:0, correctAnswer: expLine, studentAnswer: toNumArray(adjLine) })

    let okInv=true
    for (let i=0;i<3;i++) for (let j=0;j<3;j++) okInv &= near(toNumber(userInv[i]?.[j]), Ainv[i][j], tolerance)
    rows.push({ key:8, label:'Матрица A^{-1}', w:W.inv, gained: okInv?W.inv:0, correctAnswer: Ainv, studentAnswer: toNumMatrix(userInv) })

    const expected = prodType==='AAinv' ? matMul(A,Ainv) : matMul(Ainv,A)
    let okProd=true
    for (let i=0;i<3;i++) for (let j=0;j<3;j++) okProd &= near(toNumber(prodVal[i]?.[j]), expected[i][j], tolerance)
    rows.push({ key:9, label: prodType==='AAinv' ? 'Произведение A\\cdot A^{-1}' : 'Произведение A^{-1}\\cdot A', w:W.prod, gained: okProd?W.prod:0, correctAnswer: expected, studentAnswer: toNumMatrix(prodVal) })

    const scorePercent = rows.reduce((s,r)=>s+r.gained,0)
    onDone?.({ scorePercent, rows, A })
  }

  const header = `\\text{Дана матрица }\\;${latexMatrix(A,'A')}`

  return (
    <Box>
      <H3>Обратная матрица (через присоединённую)</H3>
      <Formula latex={header} />

      {step===1 && (
        <>
          <TitleKx textLatex={'\\text{Шаг 1 — }\\det(A),\\ \\text{невырождённость и существование }A^{-1}'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="110px"><Formula latex="\\det(A):" /></Col>
            <Col flex="170px"><InputNumber style={{width:'100%'}} value={detUser} onChange={setDetUser} precision={4} /></Col>
          </Row>
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="110px"><span>Матрица:</span></Col>
            <Col flex="170px">
              <Select style={{width:'100%'}} value={degFlag} onChange={setDegFlag}
                      options={[{label:'вырожденная',value:0},{label:'невырождённая',value:1}]}/>
            </Col>
          </Row>
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="110px"><span>Обратная:</span></Col>
            <Col flex="170px">
              <Select style={{width:'100%'}} value={invFlag} onChange={setInvFlag}
                      options={[{label:'не существует',value:0},{label:'существует',value:1}]}/>
            </Col>
          </Row>
          <Button type="primary"
                  onClick={()=>setStep(2)}
                  disabled={detUser===undefined || degFlag===undefined || invFlag===undefined}>
            Далее
          </Button>
        </>
      )}

      {step===2 && (
        <>
          <TitleKx textLatex={`\\text{Шаг 2 — алгебраические дополнения столбца }${cofJ+1}`} />
          {[0,1,2].map(i=>(
            <Row key={i} gutter={8} align="middle" style={{ marginBottom:8 }}>
              <Col flex="10px"><Formula latex={`A_{${i+1}${cofJ+1}}:`} /></Col>
              <Col flex="170px">
                <InputNumber style={{width:'100%'}} value={cofVals[i]} precision={4}
                             onChange={v=>{ const cp=cofVals.slice(); cp[i]=v; setCofVals(cp) }}/>
              </Col>
            </Row>
          ))}
          <Button onClick={()=>setStep(1)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(3)} disabled={cofVals.some(v=>v===undefined)}>Далее</Button>
        </>
      )}

      {step===3 && (
        <>
          <TitleKx textLatex={'\\text{Шаг 3 — часть }\\operatorname{adj}(A)'} />
          <Alert type="info" showIcon style={{marginBottom:8}}
                 message={adjPick.isRow?`Введите элементы ${adjPick.k+1}-й строки adj(A)`:`Введите элементы ${adjPick.k+1}-го столбца adj(A)`}/>
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            {[0,1,2].map(t=>(
              <Col key={t} flex="160px">
                <InputNumber style={{width:'100%'}} value={adjLine[t]} precision={4}
                             onChange={v=>{ const cp=adjLine.slice(); cp[t]=v; setAdjLine(cp) }}/>
              </Col>
            ))}
          </Row>
          <Button onClick={()=>setStep(2)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(4)} disabled={adjLine.some(v=>v===undefined)}>Далее</Button>
        </>
      )}

      {step===4 && (
        <>
          <TitleKx textLatex={'\\text{Шаг 4 — матрица }A^{-1}'} />
          {Array.from({length:3},(_,i)=>(
            <Row key={i} gutter={8} align="middle" style={{ marginBottom:6 }}>
              {[0,1,2].map(j=>(
                <Col key={j} flex="160px">
                  <InputNumber style={{width:'100%'}} value={userInv[i][j]} precision={4}
                               onChange={v=>updateMat(setUserInv,i,j,v)}/>
                </Col>
              ))}
            </Row>
          ))}
          <Button onClick={()=>setStep(3)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(5)}
                  disabled={userInv.some(r=>r.some(v=>v===undefined))}>Далее</Button>
        </>
      )}

      {step===5 && (
        <>
          <TitleKx textLatex={'\\text{Шаг 5 — проверка произведения}'} />
          <Formula latex={prodType==='AAinv' ? 'A\\cdot A^{-1}' : 'A^{-1}\\cdot A'} />
          {Array.from({length:3},(_,i)=>(
            <Row key={i} gutter={8} align="middle" style={{ marginBottom:6 }}>
              {[0,1,2].map(j=>(
                <Col key={j} flex="160px">
                  <InputNumber style={{width:'100%'}} value={prodVal[i][j]} precision={4}
                               onChange={v=>updateMat(setProdVal,i,j,v)}/>
                </Col>
              ))}
            </Row>
          ))}
          <Button onClick={()=>setStep(4)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={verify}>Проверить</Button>
        </>
      )}
    </Box>
  )
}