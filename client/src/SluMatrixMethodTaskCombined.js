// src/SluMatrixMethodTaskCombined.js
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, InputNumber, Button } from 'antd'
import katex from 'katex'
import 'katex/dist/katex.min.css'

import { mulberry32, randint, det3, inv3, matVec, latexMatrix, latexVec, near } from './SluCommonMath'

const Box = styled.div`padding:12px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:12px;`
const H3 = styled.h3`margin:12px 0 8px 0;`
const Formula = ({ latex }) => (
  <div style={{ margin:'6px 0' }}
       dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError:false }) }}/>
)
const TitleKx = ({ textLatex }) => (
  <H3 dangerouslySetInnerHTML={{ __html: katex.renderToString(textLatex, { throwOnError:false }) }} />
)

// Helper to safely convert a value to a number, defaulting to 0
const toNumber = val => Number(val) || 0;
// Helper to safely convert an array of values to numbers
const toNumArray = arr => (arr || []).map(toNumber);

function genSystem(seed) {
  const rng = mulberry32(seed)
  let A, d
  do {
    A = Array.from({length:3},()=> Array.from({length:3},()=> randint(rng,-5,5)))
    d = det3(A)
  } while (d === 0)
  const x = [randint(rng,-3,3), randint(rng,-3,3), randint(rng,-3,3)]
  const b = matVec(A,x)
  return { A, b, x, detA:d, inv:inv3(A) }
}

export default function SluMatrixMethodTaskCombined({ taskNumber, onDone }) {
  const seed = useMemo(()=> 0x5151 ^ (Number(taskNumber)||1), [taskNumber])
  const { A, b, x, detA } = useMemo(()=> genSystem(seed), [seed])

  const [step, setStep] = useState(1)
  const [detUser, setDetUser] = useState()
  const [xUser, setXUser] = useState([undefined,undefined,undefined])
  const [AxUser, setAxUser] = useState([undefined,undefined,undefined])

  const header = `\\text{}A\\,x=b,\\; ${latexMatrix(A,'A')}\\;,\\; ${latexVec(b,'b')}`
  const setVec = (setter,i,v)=> setter(prev=>{const cp=prev.slice(); cp[i]=v; return cp})

  const verify = () => {
    const rows=[]
    const W={ det:20, sol:45, check:35 }
    const tolerance = 0.01

    rows.push({ key:1, label:'Определитель \\det(A)', w:W.det, gained: near(toNumber(detUser),detA, tolerance)?W.det:0, correctAnswer: detA, studentAnswer: toNumber(detUser) })
    rows.push({ key:2, label:'Решение x', w:W.sol, gained: x.every((v,i)=>near(toNumber(xUser[i]),v, tolerance))?W.sol:0, correctAnswer: x, studentAnswer: toNumArray(xUser) })
    rows.push({ key:3, label:'AX\\;\\text{(подстановка)}', w:W.check, gained: [0,1,2].every(i=>near(toNumber(AxUser[i]), b[i], tolerance))?W.check:0, correctAnswer: b, studentAnswer: toNumArray(AxUser) })
    const scorePercent = rows.reduce((s,r)=>s+r.gained,0)
    onDone?.({ scorePercent, rows, A })
  }

  return (
    <Box>
      <H3>СЛАУ — матричный метод</H3>
      <Formula latex={header} />

      {step===1 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 1 — }\\det(A)'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="10px"><Formula latex="\\det(A):" /></Col>
            <Col flex="170px"><InputNumber style={{width:'100%'}} value={detUser} onChange={setDetUser} precision={4} /></Col>
          </Row>
          <Button type="primary" onClick={()=>setStep(2)} disabled={detUser===undefined}>Далее</Button>
        </>
      )}

      {step===2 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 2 — Введите решение системы }'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="0px"><Formula latex="x_1:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[0]} onChange={v=>setVec(setXUser,0,v)} precision={4} /></Col>
            <Col flex="0px"><Formula latex="x_2:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[1]} onChange={v=>setVec(setXUser,1,v)} precision={4} /></Col>
            <Col flex="0px"><Formula latex="x_3:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[2]} onChange={v=>setVec(setXUser,2,v)} precision={4} /></Col>
          </Row>
          <Button onClick={()=>setStep(1)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(3)} disabled={xUser.some(v=>v===undefined)}>Далее</Button>
        </>
      )}

      {step===3 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 3 — проверка }AX=b'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="70px"><Formula latex="(AX)_1:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[0]} onChange={v=>setVec(setAxUser,0,v)} precision={4} /></Col>
            <Col flex="70px"><Formula latex="(AX)_2:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[1]} onChange={v=>setVec(setAxUser,1,v)} precision={4} /></Col>
            <Col flex="70px"><Formula latex="(AX)_3:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[2]} onChange={v=>setVec(setAxUser,2,v)} precision={4} /></Col>
          </Row>
          <Button onClick={()=>setStep(2)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={verify}>Проверить</Button>
        </>
      )}
    </Box>
  )
}

