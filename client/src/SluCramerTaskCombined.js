// src/SluCramerTaskCombined.js
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, InputNumber, Button } from 'antd'
import katex from 'katex'
import 'katex/dist/katex.min.css'

import { mulberry32, randint, det3, matVec, latexMatrix, latexVec, near } from './SluCommonMath'

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

function genSystemTZ(seed) {
  const rng = mulberry32(seed)
  while (true) {
    const x = [randint(rng,1,5), randint(rng,-7,4), randint(rng,-3,8)]
    const a12=randint(rng,-3,3), a13=randint(rng,1,5)
    const a22=randint(rng, 1,5), a23=randint(rng,-4,4)
    const a32=randint(rng, 1,5), a33=randint(rng,-1,4)
    const A=[[1,a12,a13],[1,a22,a23],[1,a32,a33]]
    const Δ = det3(A); if (Δ===0) continue
    const b = matVec(A,x)
    const detReplace = col => { const M=A.map(r=>r.slice()); for(let i=0;i<3;i++) M[i][col]=b[i]; return det3(M) }
    const Δ1=detReplace(0), Δ2=detReplace(1), Δ3=detReplace(2)
    if (Δ1===0 || Δ2===0 || Δ3===0) continue
    return { A,b,x,detA:Δ, Δ1,Δ2,Δ3 }
  }
}

export default function SluCramerTaskCombined({ taskNumber, onDone }) {
  const seed = useMemo(()=> 0x51C ^ (Number(taskNumber)||1), [taskNumber])
  const { A,b,x,detA,Δ1,Δ2,Δ3 } = useMemo(()=> genSystemTZ(seed), [seed])

  const [step, setStep] = useState(1)
  const [detUser, setDetUser] = useState()
  const [d1, setD1] = useState()
  const [d2, setD2] = useState()
  const [d3, setD3] = useState()
  const [xUser, setXUser] = useState([undefined,undefined,undefined])
  const [AxUser, setAxUser] = useState([undefined,undefined,undefined])

  const header = `\\text{}A\\,x=b\\quad ${latexMatrix(A,'A')}\\;,\\; ${latexVec(b,'b')}`
  const setVec = (setter,i,v)=> setter(prev=>{const cp=prev.slice(); cp[i]=v; return cp})

  const verify = () => {
    const rows=[]
    const W=10
    const tolerance = 0.01

    rows.push({ key:1, label:'Определитель \\det(A)', w:W, gained: near(toNumber(detUser),detA, tolerance)?W:0, correctAnswer: detA, studentAnswer: toNumber(detUser) })
    rows.push({ key:2, label:'\\Delta_1', w:W, gained: near(toNumber(d1),Δ1, tolerance)?W:0, correctAnswer: Δ1, studentAnswer: toNumber(d1) })
    rows.push({ key:3, label:'\\Delta_2', w:W, gained: near(toNumber(d2),Δ2, tolerance)?W:0, correctAnswer: Δ2, studentAnswer: toNumber(d2) })
    rows.push({ key:4, label:'\\Delta_3', w:W, gained: near(toNumber(d3),Δ3, tolerance)?W:0, correctAnswer: Δ3, studentAnswer: toNumber(d3) })
    rows.push({ key:5, label:'Решение x_1', w:W, gained: near(toNumber(xUser[0]),x[0], tolerance)?W:0, correctAnswer: x[0], studentAnswer: toNumber(xUser[0]) })
    rows.push({ key:6, label:'Решение x_2', w:W, gained: near(toNumber(xUser[1]),x[1], tolerance)?W:0, correctAnswer: x[1], studentAnswer: toNumber(xUser[1]) })
    rows.push({ key:7, label:'Решение x_3', w:W, gained: near(toNumber(xUser[2]),x[2], tolerance)?W:0, correctAnswer: x[2], studentAnswer: toNumber(xUser[2]) })
    rows.push({ key:8, label:'(AX)_1', w:W, gained: near(toNumber(AxUser[0]), b[0], tolerance)?W:0, correctAnswer: b[0], studentAnswer: toNumber(AxUser[0]) })
    rows.push({ key:9, label:'(AX)_2', w:W, gained: near(toNumber(AxUser[1]), b[1], tolerance)?W:0, correctAnswer: b[1], studentAnswer: toNumber(AxUser[1]) })
    rows.push({ key:10,label:'(AX)_3', w:W, gained: near(toNumber(AxUser[2]), b[2], tolerance)?W:0, correctAnswer: b[2], studentAnswer: toNumber(AxUser[2]) })
    const scorePercent = rows.reduce((s,r)=>s+r.gained,0)
    onDone?.({ scorePercent, rows, A })
  }

  return (
    <Box>
      <H3>СЛАУ — метод Крамера</H3>
      <Formula latex={header} />

      {step===1 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 1 — Введите}\\Delta = \\det(A)'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
          <Col flex="110px"><Formula latex={'\\Delta = \\det(A):'} /></Col>
            <Col flex="170px"><InputNumber style={{width:'100%'}} value={detUser} onChange={setDetUser} precision={4} /></Col>
          </Row>
          <Button type="primary" onClick={()=>setStep(2)} disabled={detUser===undefined}>Далее</Button>
        </>
      )}

      {step===2 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 2 — Введите }\\Delta_1,\\,\\Delta_2,\\,\\Delta_3'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
          <Col flex="0px"><Formula latex={'\\Delta_1:'}/></Col>
          <Col flex="140px"><InputNumber style={{width:'100%'}} value={d1} onChange={setD1} precision={4} /></Col>

          <Col flex="0px"><Formula latex={'\\Delta_2:'}/></Col>
          <Col flex="140px"><InputNumber style={{width:'100%'}} value={d2} onChange={setD2} precision={4} /></Col>

          <Col flex="0px"><Formula latex={'\\Delta_3:'}/></Col>
          <Col flex="140px"><InputNumber style={{width:'100%'}} value={d3} onChange={setD3} precision={4} /></Col>

          </Row>
          <Button onClick={()=>setStep(1)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(3)} disabled={d1===undefined||d2===undefined||d3===undefined}>Далее</Button>
        </>
      )}

      {step===3 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 3 — Введите решение системы}'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="0px"><Formula latex="x_1:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[0]} onChange={v=>setVec(setXUser,0,v)} precision={4} /></Col>
            <Col flex="0px"><Formula latex="x_2:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[1]} onChange={v=>setVec(setXUser,1,v)} precision={4} /></Col>
            <Col flex="0px"><Formula latex="x_3:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={xUser[2]} onChange={v=>setVec(setXUser,2,v)} precision={4} /></Col>
          </Row>
          <Button onClick={()=>setStep(2)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={()=>setStep(4)} disabled={xUser.some(v=>v===undefined)}>Далее</Button>
        </>
      )}

      {step===4 && (
        <>
          <TitleKx textLatex={'\\text{Вопрос 4 — проверка }AX_i, i=1,2,3'} />
          <Row gutter={8} align="middle" style={{ marginBottom:8 }}>
            <Col flex="70px"><Formula latex="(AX)_1:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[0]} onChange={v=>setVec(setAxUser,0,v)} precision={4} /></Col>
            <Col flex="70px"><Formula latex="(AX)_2:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[1]} onChange={v=>setVec(setAxUser,1,v)} precision={4} /></Col>
            <Col flex="70px"><Formula latex="(AX)_3:"/></Col><Col flex="140px"><InputNumber style={{width:'100%'}} value={AxUser[2]} onChange={v=>setVec(setAxUser,2,v)} precision={4} /></Col>
          </Row>
          <Button onClick={()=>setStep(3)} style={{marginRight:8}}>Назад</Button>
          <Button type="primary" onClick={verify}>Проверить</Button>
        </>
      )}
    </Box>
  )
}

