import React, {useState} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';

/* nonzero - minimum;   zero - not an extremum */

const Container0 = styled.div`
  display: inline-block;
  flex-direction: column;
  padding: 20px;
  padding-left: 20px;
  padding-right: 10px;
  font-weight: bold;
  font-size: 15px;
  background: aliceblue;
  margin: 2%; 
  font-family: Roboto; 
  text-align: center;
  
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
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
  width: і200px;
  //width: 180px;
  align-items: flex-start;
  padding: 10px;
  font-size: 15 px;
  column-gap: 2px;

`

const MatrixColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 180 px;
  align-items: flex-start;
  padding: 20 px;
  font-size: 15 px;
  
`

function ExtrCubic_1({scoreA, setScoreA, totalScoreA,setTotalScoreA,mssg, setMessage}) {
   
    const max = 25, q=10;
    const eps = 0.01;
    //var spx,spy,xx,xy,yy, det;
  
    var nonzero;
    var spx=Array(2).fill(0),
    spy=Array(2).fill(0),
    xx=Array(2).fill(0),
    xy=Array(2).fill(0),
    yy=Array(2).fill(0),
    det=Array(2).fill(0),
    ans=Array(2).fill(" ");

    var scoreA=Array(q+1).fill(0);
    var a, b,c, maxc,d,k;
   

    const [x, setXpoint] = useState([]);
    const [y, setYpoint] = useState([]);
    const [n, setNpoints] = useState([]);
    const [dzx, setdzX] = useState([]);
    const [dzy, setdzY] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);

    const [dxx, setdXX] = useState([]);
    const [dxy, setdXY] = useState([]);
    const [dyx, setdYX] = useState([]);
    const [dyy, setdYY] = useState([]);
    const [D, setstD] = useState([]);
    const [stAns, setstAns] = useState([]);
    //const [qstatus, setQstatus] = React.useState('openQ')

    const myrandom = (min,max) => {
      return Math.trunc(Math.random()*(max-min+1))+min;
    }

    a=myrandom(2,5);
    maxc=8;
    b=8;
    console.log("bnew=",b); 
    c=myrandom(2,maxc);
    console.log("cnew=",c); 
    d=myrandom(10,maxc*3);
    console.log("dnew=",d); 

    k=b**(1/3)

    spx[0]=0;                  spx[1]=c/(3*k);            
    spy[0]=0;                  spy[1]=a*c/(3*(k**2));     

    xx[0]=0;                    xx[1]=2*c/k;
    xy[0]=-c;                   xy[1]=-c;
    yy[0]=0;                    yy[1]=-2*a*b*c/(k**2);

    for (let i = 0; i < n; i++) {
      det[i]=xx[i]*yy[i]-xy[i]**2;  
      if ((det[i]>0)&&(xx[i]>0)) ans[i]="минималды мәні"
      else if ((det[i]>0)&&(xx[i]<0)) ans[i]="максималды мәні"
      else if (det[i]<0)  ans[i]="extremum мәні емес"
      else ans[i]="белгісіз" 
  }

    const onInputNpoints = (event) => {
        setNpoints(Number(event.target.value));
        var nstationar = Number(event.target.value);

        let x = Array(nstationar).fill(0);
        setXpoint(x);
        let y = Array(nstationar).fill(0);
        setYpoint(y);
        let dzx = Array(nstationar).fill(0);
        setdzX(dzx);
        let dzy = Array(nstationar).fill(0);
        setdzY(dzy);

        let dxx = Array(nstationar).fill(0);
        setdXX(dxx);
        let dxy = Array(nstationar).fill(0);
        setdXY(dxy);
        let dyx = Array(nstationar).fill(0);
        setdYX(dyx);
        let dyy = Array(nstationar).fill(0);
        setdYY(dyy);

        let D = Array(nstationar).fill(0);
        setstD(D);

        let stAns = Array(nstationar).fill(0);
        setstAns(stAns);
    }
    

   

    var xpoi = Array(n);
    var ypoi = Array(n);

    for (let i = 0; i < n; i++) {
      xpoi[i] = 0;
      ypoi[i] = 0;
    }

    const [disabled, setDisabled] = useState(false);
  
/*
    const handleSubmitFirstQ = (event) => {
      setQstatus("done");
      setDisabled(!disabled);
    }*/

    const handleSubmitExtrCubic_1 = (event) => {
    let count = 0;
    
    setDisabled(!disabled);
    
    event.preventDefault();

    for (let i = 0; i < n; i++) {
      x[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      xpoi[i] = x[i];
      count += 1;
      y[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : "NaN";
      count += 1;
    }
    setXpoint(xpoi);
    setYpoint(ypoi);

    // count += 1;
  
    for (let i = 0; i < n; i++) {
      dzx[i] =!isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      
      count += 1;
      dzy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";;
      count += 1;
    }
    setdzX(dzx);
    setdzY(dzy);

    for (let i = 0; i < n; i++) {
      //dxx[i] = Number(event.target[count].value);

      dxx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      
      count += 1;
      dxy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      /*
      dxy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;*/

      count += 1;

      dyx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      
      count += 1;
      dyy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      count += 1;

    
      D[i]=(Number(event.target.value));
      count += 1;
      stAns[i]=(event.target.value);
      count += 1;

    }
    setdXX(dxx);
    setdXY(dxy);
    setdYX(dyx);
    setdYY(dyy);
    setstD(D);
    setstAns(stAns);

    
    
   if (n===2) {
    scoreA[0]=10;
    } 
    totalScoreA=totalScoreA+scoreA[0];
    console.log("stN=",n);
    console.log("score1=",scoreA[0], "totalScore=", totalScoreA);

    if ((x[0]===0) && (y[0]===0)) {
      nonzero=1;
      if ((x[1]===spx)&&(y[1]===spy)) {
        scoreA[1]=10;
      } }
    else if((x[1]===0) && (y[1]===0)) {
      nonzero=0;
      if ((x[0]===spx)&&(y[0]===spy)){
        scoreA[1]=10;
      } 
    else if ((x[0]===spx)&&(y[0]===spy)){
      scoreA[1]=5;
      nonzero=0;
    }
    else if ((x[1]===spx)&&(y[1]===spy)){
      scoreA[1]=5;
      nonzero=1;
    }
    } 

    console.log("nonzero=", nonzero);
    console.log("x=",x[nonzero], "spx=",spx[1]);
    totalScoreA=totalScoreA+scoreA[1];
    console.log();
    console.log("score2=",scoreA[1], "totalScore=", totalScoreA);

    
    console.log("y=",y[nonzero], "spy=",spy[1]);
    totalScoreA=totalScoreA+scoreA[2];
    console.log();
    console.log("score3=",scoreA[2], "totalScore=", totalScoreA);

    if (dzx[n-1]===0) {
      scoreA[3]=5;
    } 
    console.log("dzx=",dzx[n-1]);
    totalScoreA=totalScoreA+scoreA[3];
    console.log();
    console.log("score3=",scoreA[3], "totalScore=", totalScoreA);

    if (dzy[n-1]===0) {
      scoreA[4]=5;
    } 
    console.log("dzy=",dzy[n-1]);
    totalScoreA=totalScoreA+scoreA[4];
    console.log();
    console.log("score3=",scoreA[4], "totalScore=", totalScoreA);

    if (nonzero==1){
      if (dxx[1]===xx[1]) {
        scoreA[5]=10;
      } 
      console.log("dxx=",dxx[n-1], "xx[1]=",xx[1]);
      totalScoreA=totalScoreA+scoreA[5];
      console.log();
      console.log("score3=",scoreA[5], "totalScore=", totalScoreA);
  
      if (dxy[1]==xy[1]) {
        scoreA[6]=10;
      } 
      console.log("dxy=",dxy[n-1], "xy[1]=",xy[1]);
      totalScoreA=totalScoreA+scoreA[6];
      console.log();
      console.log("score6=",scoreA[6], "totalScore=", totalScoreA);
  
      if (dyx[1]==xy[1]) {
        scoreA[7]=10;
      } 
      console.log("dyx=",dyx[n-1], "yx[1]=",xy[1]);
      totalScoreA=totalScoreA+scoreA[7];
      console.log();
      console.log("score7=",scoreA[7], "totalScore=", totalScoreA);
  
      if (dyy[1]==yy[1]) {
        scoreA[8]=10;
      } 
      console.log("dyy=",dyy[n-1], "yy[1]=",yy[1]);
      totalScoreA=totalScoreA+scoreA[8];
      console.log();
      console.log("score3=",scoreA[8], "totalScore=", totalScoreA);
  
      if (det[1]==D[1]) {
        scoreA[9]=10;
      } 
      console.log("det[1]=",det[1], "D[1]=",D[1]);
      totalScoreA=totalScoreA+scoreA[9];
      //console.log();
      //console.log("score3=",score[9], "totalScore=", totalScore);
  
    if (stAns[1]==ans[1]){
      scoreA[10]=10;
    }
    console.log("ans[1]=",ans[1], "stAns[1]=",stAns[1]);
      totalScoreA=totalScoreA+scoreA[10];
  }
  else {
    if (dxx[0]===xx[1]) {
      scoreA[5]=10;
    } 
    console.log("dxx[0]=",dxx[0], "xx=",xx[1]);
    totalScoreA=totalScoreA+scoreA[5];
    console.log();
    console.log("score3=",scoreA[5], "totalScore=", totalScoreA);

    if (dxy[0]==xy[1]) {
      scoreA[6]=10;
    } 
    console.log("dxy[0]=",dxy[0], "xy[1]=",xy[1]);
    totalScoreA=totalScoreA+scoreA[6];
    console.log();
    console.log("score6=",scoreA[6], "totalScore=", totalScoreA);

    if (dyx[0]==xy[1]) {
      scoreA[7]=10;
    } 
    console.log("dyx[0]=",dyx[0], "yx=",xy[1]);
    totalScoreA=totalScoreA+scoreA[7];
    console.log();
    console.log("score7=",scoreA[7], "totalScore=", totalScoreA);

    if (dyy[0]==yy[1]) {
      scoreA[8]=10;
    } 
    console.log("dyy[0]=",dyy[0], "yy[1]=",yy[1]);
    totalScoreA=totalScoreA+scoreA[8];
    console.log();
    console.log("score3=",scoreA[8], "totalScore=", totalScoreA);

    if (D[0]==det[1]) {
      scoreA[9]=10;
    } 
    console.log("det[1]=",det[1], "D[0]=",D[0]);
    totalScoreA=totalScoreA+scoreA[9];
    //console.log();
    //console.log("score3=",score[9], "totalScore=", totalScore);

  if (stAns[0]==ans[1]){
    scoreA[10]=10;
  }
  console.log("ans[1]=",ans[1], "stAns[0]=",stAns[0]);
    totalScoreA=totalScoreA+scoreA[10];
  }

        //console.log();
    //console.log("score10=",score[10], "totalScore=", totalScore);

    setScoreA(scoreA)
    setTotalScoreA(totalScoreA)
    mssg="1done"
    setMessage(mssg)
  }

return (
    <div>
      <Container0>   
      
     <mymath>  z = {a}x³ + {b}y³ - {c}xy+{d}  </mymath>
     <h3> функциясының экстремумын тауып, төмендегі сұрақтарға жауаптарыңызды енгізіңіз: </h3>
 
    </Container0> 
   
       <Container> 
      <h4> 1. Стационар нүктелерінің санын енгізіңіз </h4>
      <Row gutter={20}>
          <Col span={2}>
            {" "}
            <Input type="Number" onChange={onInputNpoints} min={1} max={100}   />{" "}
          </Col>

        </Row> 
        
        </Container>
       
        
  <form onSubmit={handleSubmitExtrCubic_1}>
  <Container>  
        <h4> {"2. Стационар нүкте(лері)нің координаттарын енгізіңіз:"} </h4>
           <MatrixColumn>
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
               <myh> (x_{indexRow+1}, y_{indexRow+1}):     </myh> 
                <label>  x_{indexRow+1}</label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  //required
                />
                 <label>  y_{indexRow+1}  </label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                />
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>
          </Container>  
          
         <Container>
          <h4> {"3. Стационар нүктедегі 1-ші туындылардың мәндерін енгізіңіз:"} </h4>
             
          <Row gutter={0}>
          <myh> z'(x₁ , y₁):  </myh> 
          <label>  z'ₓ </label>&nbsp;
          <Col span={2}>
            {" "}
            <Input type="Number" disabled = {disabled} />{" "}
          </Col> 

          <label>  z'_y </label>&nbsp;
          <Col span={2}>
            {" "}
            <Input type="Number" disabled = {disabled} />{" "}

          </Col>
        </Row> 
        </Container>

        <Container>

          <h4> {"4. Стационар нүкте(лер)дегі 2-ші туындылардың мәндерін енгізіңіз:"} </h4>
             
          <Row gutter={0}>
                  <myh> z''(x₁, y₁):  </myh> 
                  
                  <label>  z''_xx </label>&nbsp;
                  <Col span={2}> {" "}
            <Input type="Number" disabled = {disabled} />{" "}
          </Col> 

          <label>   z''_xy</label>&nbsp;
                  <Col span={2}> {" "}
            <Input type="Number" disabled = {disabled} />{" "}
          </Col> 

          <label>   z''_yx</label>&nbsp;
                  <Col span={2}> {" "}
            <Input type="Number" disabled = {disabled} />{" "}
          </Col> 
 
          <label>   z''_yy</label>&nbsp;
                  <Col span={2}> {" "}
            <Input type="Number" disabled = {disabled} />{" "}
          </Col>
          </Row>
          </Container>

          <Container>
        <h4> 5. Экстремумның жеткілікті шартындағы D мәнін енгізіңіз </h4>

        <MatrixColumn>
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
               <myh> D(x_{indexRow+1}, y_{indexRow+1}):     </myh> 
               
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  //required
                />
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>

        <h4> 6. Берілген функция үшін  </h4> 

        <MatrixColumn> 
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
               <myh> z(x_{indexRow+1}, y_{indexRow+1}) -    </myh> 
               
               <select> 
      <option value="defaultValue " disabled selected>таңдаңыз </option>
        <option value="максималды мәні"> максималды мәні</option>
        <option value="минималды мәні"> минималды мәні</option>
        <option value="extremum мәні емес"> extremum мәні емес</option>
        <option value="белгісіз"> белгісіз </option>
      </select>
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>

        </Container>

        

        <StyledButton  type='submit' disabled={disabled} > сақтау </StyledButton>
  </form>
  </div>
)
}

export default ExtrCubic_1