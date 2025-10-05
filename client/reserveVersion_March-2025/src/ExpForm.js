// import React from "react";
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
function ExpForm({scoreExp,setScoreExp, mssg, setMessage,taskStatus,setStatus}) {
    var aexp,pexp,bexp,kexp,gexp, stGexp;
    const max = 25,
    eps = 0.01
    
    const onInputAexp = (event) =>{
        aexp = Number(event.target.value)
    }
    
    const onInputPexp = (event) => {
      pexp = Number(event.target.value)
    }
    
    const onInputBexp = (event) => {
      bexp = Number(event.target.value)
    }
    
    const onInputKexp = (event) =>{
      kexp = Number(event.target.value)
    }
    
    const onInputGexp = (event) => {
      stGexp = Number(event.target.value)
    }
    const [disabled, setDisabled] = useState(false);
    const handleSubmitExp = (event) => {
    //   // sent=1
      console.log("a=",aexp, "p=",pexp, "b=",bexp, "k=",kexp);
      console.log("stGb=",stGexp);
      setDisabled(!disabled);
      
      event.preventDefault();
      gexp=Math.exp(bexp*(aexp-pexp))
      console.log("gexp=",gexp);
      if(Math.abs(stGexp-gexp)<eps) 
      scoreExp=max/2
      // else mssg="неверный ответ для 2-задачи"
      setScoreExp(scoreExp)
      setMessage(mssg)
      taskStatus="done"
      setStatus(taskStatus)
      console.log("scoreExp=",scoreExp);
 }

return (
    <div >
    <Container0> 
    <h4> Введите данные и результаты вычислений предела в соответствии со следующими обозначениями </h4> 
       {/* <h4> Есептің берілгендерін және шекті есептеу нәтижесін төмендегі белгілеулерге сәйкес енгізіңіз </h4> */}

       <div className="imageBox">
        <img alt="second remarkable limit" src={`/image/exp.jpg`}  width="20%" height="20%"/>
      </div>
    </Container0>

    <form onSubmit={handleSubmitExp}>
      <Container0>  
      <h4>  Введите значения a, p, b, k </h4>
      {/* <h4>  a, p, b, k мәндерін енгізіңіз </h4> */}

      <Row gutter={20}>
          <label> a </label>
          <Col span={2}>
            {" "}
            <Input type="text" onChange={onInputAexp} />{" "}
          </Col>
          <label> p </label>

          <Col span={2}>
            <Input type="text"
              onChange={(event) => onInputPexp(event, 2, 5)}
            />
          </Col>
          <label> b </label>
          <Col span={2}>
            <Input type="text"
              onChange={(event) => onInputBexp(event, 2, 5)}
              
            />
          </Col>

          <label> k </label>
          <Col span={2}>
            <Input type="text"
              onChange={(event) => onInputKexp(event, 2, 5)}
            />
          </Col>
        </Row> 

    
        {/* <h4> Шектің мәні  g-ді енгізіңіз </h4> */}
        <h4> Введите значение предела g </h4> 

      <Row gutter={20}>
          <label> g </label>
          <Col span={2}>
            {" "}
            <Input type="text" onChange={onInputGexp}  disabled = {disabled}/>{" "}
          </Col>
        </Row> 

        </Container0>

        <StyledButton  type='submit' disabled={disabled} > сақтау </StyledButton>
  </form>
  </div>
)
}


export default ExpForm