import React, {useState} from "react";
// import { render } from '@testing-library/react';
import styled from 'styled-components'
import { Input, Row, Col } from 'antd';
// import { button, Input, Row, Col,Form } from 'antd';

const Container0 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
`
const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`
  
// function RootForm({scoreRoot,setScoreRoot,mssg, setMessage,taskStatus,setStatus}) {
function RootForm({scoreRoot,setScoreRoot,taskStatus,setStatus}) {
  var a, b, c, d, k, p, g, stG
  // var numberOfImage=1
  const max = 25,
  eps = 0.01

  const onInputA = (event) => {
      a = Number(event.target.value)
  }
  
  const onInputB = (event) => {
      b = Number(event.target.value)
  }
  
  const onInputC = (event) => {
      c = Number(event.target.value)
  }
  
  const onInputD = (event) => {
      d = Number(event.target.value)
  }
  
  const onInputK = (event) => {
      k = Number(event.target.value)
  }
  
  const onInputP = (event) => {
      p = Number(event.target.value)
  }
  
  const onInputG = (event) => {
      stG = (event.target.value)
      if (stG!=="infty") stG=Number(stG)
  }
  const [disabled, setDisabled] = useState(false);
  const handleSubmitRoot = (event) => {
   
      console.log('a=', a, 'b=', b, 'c=', c)
      console.log('d=', d, 'k=', k, 'p=', p)
      console.log('stG=', stG)
      setDisabled(!disabled);
  
      event.preventDefault()
      if (a === d) {
        if (a === 0) {
          if (b === k) g = 0
          else {
            g = 'infty'
            console.log('thisg=', g)
            if (stG===g) scoreRoot=scoreRoot+max/2
            // else mssg="неверный ответ для 2-задачи"
            // scoreA=scoreA+max/2
            console.log('thisg=', g)
          }
        } else if (a > 0) {
          g = (b - k) / (2 * Math.sqrt(a))
          console.log('g_sqrt=', g)
          if (Math.abs(stG - g) < eps)
          scoreRoot=scoreRoot+max/2
          // else mssg="неверный ответ для 2-задачи"
        } 
        // else {
        //   mssg="2-тапсырма үшін a мәні қате енгізілген"
        //   // mssg="Введено некорректное значение а для 2-задачи"
        //   console.log('mssg=',mssg)
        //   scoreRoot=0
        // }
        
      } else {g = 'infty'
              if (stG===g)
              scoreRoot=scoreRoot+max/2
              // else mssg="неверный ответ для 2-задачи"
            }
      console.log('g=', g)
      // if (Math.abs(stG - g) < eps) scoreRoot=max / 2
      // scoreA = max / 2
      console.log('scoreRoot=', scoreRoot)
      setScoreRoot(scoreRoot)
      // setMessage(mssg)
      setStatus("done")
      console.log('stscore=',scoreRoot )
    }

  return(
    <div >
      {/* {console.log('scoreRootinitial=', scoreRoot)} */}
      <Container0> 
     {/* <h4> Есептің берілгендерін және шекті есептеу нәтижесін төмендегі белгілеулерге сәйкес енгізіңіз </h4> */}
      <h4> Введите данные и результаты вычислений  предела в соответствии со следующими обозначениями </h4>
    <div className="imageBox">
      {/* <img src={`/image/Root${a}.jpg`} /> */}
      {/* <img alt="formula" src={`/image/root1.jpg`} /> */}
      <img alt="formula" src={`/image/root.jpg`} width="50%" height="ғ0%"/>
    </div>
    </Container0>

    <form onSubmit={handleSubmitRoot}>
      <Container0>
       {/* <h4>  a, b, c мәндерін енгізіңіз</h4>*/}
        <h4>  Введите значения a, b, c  </h4>

        <Row gutter={20}>
          <label> a </label>
          <Col span={2}>
            {' '}
            <Input type="text" onChange={onInputA} />{' '}
            {/* <Input onChange={onInputA} defaultValue="0" />{" "} */}
          </Col>
          <label> b </label>

          <Col span={2}>
            <Input type="text" onChange={(event) => onInputB(event, 2, 5)} />
          </Col>
          <label> c </label>
          <Col span={2}>
            <Input type="text" onChange={(event) => onInputC(event, 2, 5)} />
          </Col>
        </Row>

       {/* <h4>  d, k, p мәндерін енгізіңіз</h4>*/}
        <h4>  Введите значения d, k, p   </h4>

        <Row gutter={20}>
          <label> d </label>
          <Col span={2}>
            {' '}
            <Input type="text" onChange={onInputD} />{' '}
          </Col>
          <label> k </label>

          <Col span={2}>
            <Input type="text" onChange={(event) => onInputK(event, 2, 5)} />
          </Col>
          <label> p </label>
          <Col span={2}>
            <Input type="text" onChange={(event) => onInputP(event, 2, 5)} />
          </Col>
        </Row>

        <h4> Введите значение предела g </h4> 
       {/* <h4> Шектің мәні  g-ді енгізіңіз </h4>*/}

        <Row gutter={20}>
          <label> g </label>
          <Col span={2}>
            {' '}
            <Input type="text" onChange={onInputG} disabled = {disabled}/>{' '}
          </Col>
        </Row>
      </Container0>

      <StyledButton type="submit" disabled={disabled} > сақтау </StyledButton>
    </form>
    </div>
  )
}

export default RootForm
