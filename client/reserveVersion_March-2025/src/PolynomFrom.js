import React, {useState} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';

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
const MatrixRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 180px;
  align-items: flex-start;
  padding: 10px;
  font-size: 15px;
`

function PolynomForm({scoreA,setScoreA,mssg, setMessage}) {
  // function PolynomForm({scorePolynom,setScorePolynom}) {
    var gpolynom, stGpolynom;
    // var gpolynom;
    var score=0
    const max = 25,
    eps = 0.01

    const [apolynom, setApolynom] = useState([]);
    const [bpolynom, setBpolynom] = useState([]);
    const [npolynom, setNpolynom] = useState([]);
    const [mpolynom, setMpolynom] = useState([]);
    // const [stGpolynom, setStGpolynom] = useState([]);

    const onInputNpolynom = (event) => {
        setNpolynom(Number(event.target.value));
        var ndegree = Number(event.target.value);
        let a = Array(ndegree).fill(0);
        setApolynom(a);
    
    }
    
    const onInputMpolynom = (event) => {
        setMpolynom(Number(event.target.value));
        var mdegree = Number(event.target.value);
        let a = Array(mdegree).fill(0);
        setBpolynom(a);
    }
    
    const onInputGpolynom = (event) => {
      stGpolynom = (event.target.value)
      if (stGpolynom!=="infty") stGpolynom = Number(event.target.value)
      
    }

      
      var bpol = Array(mpolynom);
    for (let i = 0; i < mpolynom; i++) {
      bpol[i] = 0;
    }
    

    var apol = Array(npolynom);
    for (let i = 0; i < npolynom; i++) {
      apol[i] = 0;
    }

    const [disabled, setDisabled] = useState(false);
  

  const handleSubmitPolynom = (event) => {
    let count = 0;
    setDisabled(!disabled);
    
    event.preventDefault();

    for (let i = 0; i < npolynom; i++) {
      apolynom[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
      apol[i] = apolynom[i];
      count += 1;
    }
    setApolynom(apol);
    // count += 1;

    for (let i = 0; i < mpolynom; i++) {
      bpolynom[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        bpol[i] = bpolynom[i];
      count += 1;
    }
    setBpolynom(bpol);
    console.log('bpolynom=', bpolynom)
  
    
    console.log('scorePolIni=', score)
    console.log("stGpolynom=",stGpolynom);
    if (npolynom>mpolynom) {
      gpolynom="infty" 
      if((stGpolynom===gpolynom))
      score=max/2
      // console.log("stGpolynom=",stGpolynom);
      // console.log("scorePolInfty=",score);
    } 
    else if (npolynom<mpolynom) {
      gpolynom=0
      if((Math.abs(stGpolynom-gpolynom)<eps))
      score=max/2
    }
    // else gpolynom=apolynom[npolynom+1]/bpolynom[mpolynom+1]
    else {
      console.log('bpol=', bpolynom[mpolynom-1])
      if (bpolynom[mpolynom-1]===0) {
        // mssg="Введено некорректное значение коэффициента для 1-задания"
        mssg="1-тапсырма үшін коэффициент қате енгізілген"
      console.log('mssg=', mssg)
      console.log('bpol=', bpolynom[mpolynom-1])}
      else {
        gpolynom=apolynom[npolynom-1]/bpolynom[mpolynom-1]
        // console.log("gpolynom=",gpolynom);
        if((Math.abs(stGpolynom-gpolynom)<eps)) score=max/2
      }
    
    }
    
    // scorePolynom=max/2
    
    // setScoreP(score)
    scoreA=score
    setScoreA(scoreA)
    console.log('scorePol=', scoreA)
    console.log('gpolynom=', gpolynom)
    setMessage(mssg)
    // setScoreA=setScoreP
    // console.log("scorePolynom=",score);
  }
  
return (
    <div >
    <Container0> 
      {/* <h4> Есептің берілгендерін және шекті есептеу нәтижесін төмендегі белгілеулерге сәйкес енгізіңіз </h4>*/}
       <h4> Введите данные и результаты вычислений предела в соответствии со следующими обозначениями </h4> 
      <div className="imageBox">
        <img alt="polynomial" src={`/image/polynomial.jpg`} width="40%" height="40%"/>
      </div>
    </Container0>
    {/* <form onSubmit={handleSubmitDegree}> */}
    <Container0>  
      <h4> Введите n и m  </h4>
      
      {/* <h4> n мен m-ді енгізіңіз </h4> */}

      <Row gutter={20}>
          <label> n </label>
          <Col span={2}>
            {" "}
            <Input type="Number" onChange={onInputNpolynom} min={1} max={100} />{" "}
          </Col>
          <label> m </label>

          <Col span={2}>
            <Input type="Number"
              onChange={(event) => onInputMpolynom(event, 2, 5)} min={1} max={100}
            />
          </Col>

        </Row> 
        {/* <StyledButton  type='submit'> сохранить </StyledButton> */}
        </Container0>
      {/* </form> */}
      

  <form onSubmit={handleSubmitPolynom}>
      <Container0>  
        <h4> {"Введите коэффициенты  многочлена:"} </h4>
        {/* <h4> {"Көпмүшеліктердің коэффициенттерін енгізіңіз:"} </h4> */}
        <MatrixRow > 
          
           {apolynom.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow} >
                {" "}
                <label > a_{indexRow + 1} </label> &nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  // onChange={onInputApolynom}
                /> 
                
              </MatrixRow>
            );
          })}
          </MatrixRow>
          <MatrixRow>
          {bpolynom.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow}>
                {" "}
                <label> b_{indexRow + 1} </label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  // onChange={onInputBpolynom}
                />
              </MatrixRow>
            );
          })}
          </MatrixRow>
    
        <h4> Введите значение предела g </h4> 
       {/*  <h4> Шектің мәні  g-ді енгізіңіз </h4>*/}

      <Row gutter={20}>
          <label> g </label>
          <Col span={2}>
            {" "}
            <Input type="text" onChange={onInputGpolynom} disabled = {disabled} />{" "}
          </Col>
        </Row> 
        </Container0>

        <StyledButton  type='submit' disabled={disabled} > сохранить </StyledButton>
  </form>

  </div>
)
}


export default PolynomForm