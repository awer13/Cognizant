import React, {useState} from "react";
import { render } from '@testing-library/react';
import styled from 'styled-components'
// import { Button, Input, Row, Col,Form } from 'antd';
import { button, Input, Row, Col,Form } from 'antd';
// import DetA from "./DetA"; 
import Checkit from "./Checkit";
// import MathJax from 'react-mathjax';
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';


const Container = styled.div`
  width: 700px;
  height: 300px;
  padding: 30px;
  padding-left: 50px; 
  
`

const Container1 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50 px;
  padding-top: 30px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
`


var done=0, max=25;
var checked=0, score=0;
var indctr="det", summary="система не имеет решения";
var x_1=0, x_2=0, x_3=0;

function DetForm({dd, delta}) { 
 
  const [stDet, setStDet] = React.useState('');
  
  const [stD1, setStD1] = React.useState('');
  const [stD2, setStD2] = React.useState('');
  const [stD3, setStD3] = React.useState('');

  const [stx1, setStx1] = React.useState('');
  const [stx2, setStx2] = React.useState('');
  const [stx3, setStx3] = React.useState('');
  // const [Score, setScore] = React.useState(0);
  // const inlineFormula = '\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta';

  const D1Handler = (event) =>{
    // setStD1((event.target.value))
    setStD1(Number(event.target.value))
  }

  const D2Handler = (event) =>{
  setStD2(Number(event.target.value))
  }

  const D3Handler = (event) =>{
  setStD3(Number(event.target.value))
  }

  const x1Handler = (event) =>{
    setStx1(Number(event.target.value))
  }

  const x2Handler = (event) =>{
  setStx2(Number(event.target.value))
  }

  const x3Handler = (event) =>{
  setStx3(Number(event.target.value))
  }
  
  const detHandler = (event) =>{
    event.preventDefault();
    setStDet(Number(event.target.value))
    
  }

  const submitHandler = (event) =>{
    event.preventDefault();
    done=1;
  }
  const scores = [];

  indctr="det"
  console.log("corv for det=", dd)
  checked=Checkit(stDet,dd,indctr)
    score=checked
    scores[0] = checked;
    console.log("score for det=", checked)

  const stD=[stD1, stD2,stD3]
  const x=[x_1, x_2,x_3]
  
  indctr="notdet"
  console.log("correct delta=", delta)

for (let k = 0; k < delta.length; k++) {

  console.log("corv for delta",k+1,"=", delta[k])

    checked=Checkit(stD[k],delta[k],indctr)
    console.log("score for delta",k+1,"=", checked)

    scores[k+1] = checked;
    score+=checked
    console.log("score + delta", k+1, "=", score)
    if (dd!==0){
      summary="Итоговый балл"
      x[k+1]=delta[k]/dd

    indctr="x"
    console.log("corv for x",k+1,"=", x[k+1])
    checked=Checkit(stx1,x[k],indctr)
    console.log("score for x",k+1,"=", checked)

    scores[delta.length+k+1] = checked;
    score+=checked
    console.log("score + x",k+1,"=",score) 
    } 
}
  return (

    <Container>
      <form onSubmit={submitHandler}>
      <h5> 
             {"Введите определитель матрицы:"}  
             </h5> 
      <label> det   
        <input type="Number" value ={stDet} onChange={detHandler} />
        {/* <input type="number" value ={stDet} onChange={detHandler} /> */}
      </label>

    <h5> 
             {"Введите миноры:"}  
        </h5> 

        <Row gutter={20}>
           {/* <p>Inline formula: <InlineMath math={inlineFormula} /></p> */}
           {/* <MathJax.Node inline formula={blockFormula} />      */}
          <label>   delta_1    </label>
          <Col span={4}>  <Input  type="Number"  value ={stD1}  onChange={D1Handler}   defaultValue=""  /> </Col>

          <label>  delta_2    </label>
          <Col span={4}>  <Input  type="Number"  value ={stD2}  onChange={D2Handler}  defaultValue=""  /> </Col>

          <label>delta_3   </label>
    
          <Col span={4}>
              <Input type="Number"  value ={stD3}   onChange={D3Handler} defaultValue="" />   </Col>

        </Row>
        
                      <h5> 
             {"Введите решение системы:"}  
        </h5> 

        <Row gutter={20}>
          <label>  x_1    </label>
          <Col span={4}>  <Input   type="Number"  value ={stx1}  onChange={x1Handler}   defaultValue=""  /> </Col>

          <label>  x_2    </label>
          <Col span={4}>  <Input  type="Number"  value ={stx2}  onChange={x2Handler}  defaultValue=""  /> </Col>

          <label>x_3   </label>
    
          <Col span={4}>
              <Input   value ={stx3}  type="Number"  onChange={x3Handler} defaultValue="" />   </Col>

              <button type='submit'> отправить </button>              
        </Row>
  
        </form>


        {/* {done>0 && (<Checkit  stDet={stDet} dd={dd} indctr="det" Score={Score} setScore={setScore} > </Checkit>)} */}

  
        <h5>  {summary} {score}   из   {max} </h5>
        
    </Container>  


  )
}

export default DetForm



