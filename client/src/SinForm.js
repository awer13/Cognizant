import React, {useState} from "react";
// import { render } from '@testing-library/react';
import styled from 'styled-components'
import {Input, Row, Col } from 'antd';

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
function SinForm({scoreSin,setScoreSin,mssg, setMessage,taskStatus,setStatus}) {
  var csin,asin,bsin,gsin, stGsin;
  // var numberOfImage=1
  const max = 25,
  eps = 0.01

  const onInputCsin = (event) =>{
      csin = Number(event.target.value)
    }
    
    const onInputAsin = (event) => {
      asin = Number(event.target.value)
    }
    const onInputBsin = (event) => {
      bsin = Number(event.target.value)
    }
    const onInputGsin = (event) => {
      stGsin = Number(event.target.value)
    }

    const [disabled, setDisabled] = useState(false);
  const handleSubmitSin = (event) => {
    
      console.log("c=",csin, "a=",asin, "b=",bsin);
      console.log("stGsin=",stGsin);
      setDisabled(!disabled);
      
      event.preventDefault();
      if (bsin===0) {mssg="2-тапсырма үшін b мәні қате енгізілген"
      gsin="2-тапсырма үшін b мәні қате енгізілген"
      console.log("mssg=",mssg);}
      else 
      gsin=asin/bsin
      console.log("gsin=",gsin);
      if(Math.abs(stGsin-gsin)<eps) 
      scoreSin=scoreSin+max/2
      // else mssg=mssg+"неверный ответ для 2-задачи"

      setScoreSin(scoreSin)
      console.log("scoreSin=",scoreSin);
      setMessage(mssg)
      setStatus("done")
    }
return (
    <div >
    <Container0> 
      <h4> Есептің берілгендерін және шекті есептеу нәтижесін төмендегі белгілеулерге сәйкес енгізіңіз </h4>
       {/* <h4> Введите данные и результаты вычислений предела в соответствии со следующими обозначениями </h4> */}
      <div className="imageBox">
        <img alt="first remarkable limit" src={`/image/sinus.jpg`}  width="20%" height="20%"/>
      </div>
    </Container0>

      
    <form onSubmit={handleSubmitSin}>
      
      <Container0>  
      <h4>  c, a, b мәндерін енгізіңіз</h4>

      <Row gutter={20}>
          <label> c </label>
          <Col span={2}>
            {" "}
            <Input type="text" onChange={onInputCsin} />{" "}
          </Col>
          <label> a </label>

          <Col span={2}>
            <Input type="text"
              onChange={(event) => onInputAsin(event, 2, 5)}
            />
          </Col>
          <label> b </label>
          <Col span={2}>
            <Input type="text"
              onChange={(event) => onInputBsin(event, 2, 5)}
              
            />
          </Col>

        </Row> 
    
        {/* <h4> Введите значение предела g </h4> */}
        <h4> Шектің мәні  g-ді енгізіңіз </h4>

      <Row gutter={20}>
          <label> g </label>
          <Col span={2}>
            {" "}
            <Input type="text" onChange={onInputGsin}  disabled = {disabled}/>{" "}
          </Col>
          
        </Row> 

        </Container0>

        <StyledButton  type='submit' disabled={disabled} > сақтау </StyledButton>
  </form> 
  </div>
)
}


export default SinForm