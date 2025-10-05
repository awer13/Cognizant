import React, {useState} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';

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
  width: 180px;
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

function ExtrRoot_5({score, setScore, totalScore,setTotalScore,mssg, setMessage}) {
   
    const max = 25, q=10;
    const eps = 0.01;
    const a=1;
    var spx,spy,xx,xy,yy, det;
    var score=Array(q+1).fill(0);
    var stAns, ans, b,c, d, maxc, dep;
   

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

    const onInputAns = (event) => {
      stAns = (event.target.value)
      console.log("stAns=",stAns); 
    }

    const myrandom = (min,max) => {
      return Math.trunc(Math.random()*(max-min+1))+min;
    }

    maxc=8;
    b=0;
    console.log("bnew=",b); 
    c=myrandom(2,maxc);
    console.log("cnew=",c); 
    d=myrandom(2,maxc);
    console.log("dnew=",d); 

    dep=4*b*c-a**2;
    spx=(a*d/dep)**2;
    spy=2*c*d/dep;

    xx=-c*dep**2/(2*(a**2)*(d**2));
    xy=dep/(2*d);
    yy=-2*b;
    det=xx*yy-xy**2;
   // det=xx*yy-xy**2;

   console.log("spx=",spx);
   console.log("spy=",spy); 
   console.log("xx=",xx);
   console.log("xy=",xy);
   console.log("yy=",yy); 
   console.log("det=",det);


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
    }
    

    const onInputD = (event) => {
      setstD(Number(event.target.value));
    }
    var xpoi = Array(n);
    var ypoi = Array(n);

    for (let i = 0; i < n; i++) {
      xpoi[i] = 0;
      ypoi[i] = 0;
    }

    const [disabled, setDisabled] = useState(false);
  

  const handleSubmitExtrRoot = (event) => {
    let count = 0;
    setDisabled(!disabled);
    
    event.preventDefault();

    for (let i = 0; i < n; i++) {
      x[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;
      xpoi[i] = x[i];
      count += 1;
      y[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
      count += 1;
    }
    setXpoint(xpoi);
    setYpoint(ypoi);

    // count += 1;
  
    for (let i = 0; i < n; i++) {
      dzx[i] =Number(event.target[count].value);
      
      count += 1;
      dzy[i] = Number(event.target[count].value);
      count += 1;
    }
    setdzX(dzx);
    setdzY(dzy);

    for (let i = 0; i < n; i++) {
      dxx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;
      
      count += 1;
      dxy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;

      count += 1;

      dyx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;
      
      count += 1;
      dyy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : 0;

      count += 1;

    }
    setdXX(dxx);
    setdXY(dxy);
    setdYX(dyx);
    setdYY(dyy);
   
    console.log('scoreIni=', score)
    console.log("D=",D);
    console.log("stAns=",stAns);
    
    console.log("DselectedOption=",selectedOption);
    
   if (n===1) {
    score[0]=10;
    } 
    totalScore=totalScore+score[0];
    console.log("stN=",n);
    console.log("score1=",score[0], "totalScore=", totalScore);

    if (x[n-1]===spx) {
      score[1]=10;
    } 
    console.log("x=",x, "spx=",spx);
    totalScore=totalScore+score[1];
    console.log();
    console.log("score2=",score[1], "totalScore=", totalScore);

    if (y[n-1]===spy) {
      score[2]=10;
    } 
    console.log("y=",y, "spy=",spy);
    totalScore=totalScore+score[2];
    console.log();
    console.log("score3=",score[2], "totalScore=", totalScore);

    if (dzx[n-1]===0) {
      score[3]=5;
    } 
    console.log("dzx=",dzx[n-1]);
    totalScore=totalScore+score[3];
    console.log();
    console.log("score3=",score[3], "totalScore=", totalScore);

    if (dzy[n-1]===0) {
      score[4]=5;
    } 
    console.log("dzy=",dzy[n-1]);
    totalScore=totalScore+score[4];
    console.log();
    console.log("score3=",score[4], "totalScore=", totalScore);

    

    if (dxx[n-1]===xx) {
      score[5]=10;
    } 
    console.log("dxx=",dxx[n-1], "xx=",xx);
    totalScore=totalScore+score[5];
    console.log();
    console.log("score3=",score[5], "totalScore=", totalScore);

    if (dxy[n-1]==xy) {
      score[6]=10;
    } 
    console.log("dxy=",dxy[n-1], "xy=",xy);
    totalScore=totalScore+score[6];
    console.log();
    console.log("score3=",score[6], "totalScore=", totalScore);

    if (dyx[n-1]==xy) {
      score[7]=10;
    } 
    console.log("dyx=",dyx[n-1], "yx=",xy);
    totalScore=totalScore+score[7];
    console.log();
    console.log("score3=",score[7], "totalScore=", totalScore);

    if (dyy[n-1]==yy) {
      score[8]=10;
    } 
    console.log("dyy=",dyy[n-1], "yy=",yy);
    totalScore=totalScore+score[8];
    console.log();
    console.log("score3=",score[8], "totalScore=", totalScore);

    if (det==D) {
      score[9]=10;
    } 
    console.log("det=",det, "D=",D);
    totalScore=totalScore+score[9];
    console.log();
    console.log("score3=",score[9], "totalScore=", totalScore);

    if ((det>0)&&(xx>0)) ans="minimum"
    else if ((det>0)&&(xx<0)) ans="maximum"
    else if (det<0)  ans="extremum емес"
    else ans="белгісіз"

  if (stAns==ans){
    score[10]=10;
  }
  console.log("ans=",ans, "stAns=",stAns);
    totalScore=totalScore+score[10];
    console.log();
    console.log("score10=",score[10], "totalScore=", totalScore);

    setScore(score)
    setTotalScore(totalScore)
    setMessage(mssg)
  }

return (

    <div >
      <Container0>   
      
     <mymath>  z = - {c}x + {d}y + y√x  </mymath>
     <h3> функциясының экстремумын тауып, төмендегі сұрақтарға жауаптарыңызды енгізіңіз: </h3>
 
    </Container0>

       <Container> 
      <h4> 1. Стационар нүктелерінің санын енгізіңіз </h4>
      <Row gutter={20}>
          <Col span={2}>
            {" "}
            <Input type="Number" onChange={onInputNpoints} min={1} max={100}  />{" "}
          </Col>

        </Row> 
        
        </Container>
  <form onSubmit={handleSubmitExtrRoot}>

  <Container>  
        <h4> {"2. Стационар нүктелерінің координаттарын енгізіңіз:"} </h4>
             
           <MatrixColumn>
          {x.map((row, indexRow = 1) => {
            return (
               
              <MatrixRow  key={indexRow}>
                {" "}
                
                <label>  x_{indexRow+1}</label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
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
         
          <h4> {"3. Стационар нүктедегі 1-ші туындылардың мәндерін енгізіңіз:"} </h4>
             
             <MatrixColumn>
            {dzx.map((row, indexRow = 1) => {
              return (
                 
                <MatrixRow  key={indexRow}>
                  {" "}
                  
                  <label>  z'_x</label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                  />
                   <label>  z'_y  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                  />
                </MatrixRow>
             
              );
            })}
            </MatrixColumn>

          <h4> {"4. Стационар нүктедегі 2-ші туындылардың мәндерін енгізіңіз:"} </h4>
             
             <MatrixColumn>
            {dxx.map((row, indexRow = 1) => {
              return (
                 
                <MatrixRow  key={indexRow}>
                  {" "}
                  
                  <label>  z''_xx</label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    // onChange={onInputBpolynom}
                  />
                   <label>  z''_xy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                  />

<label>  z''_yx  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                  />
                    <label>  z''_yy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                  />
                </MatrixRow>
             
              );
            })}
            </MatrixColumn>
         

        <h4> 5. Экстремумның жеткілікті шартындағы D мәнін енгізіңіз </h4>

      <Row gutter={0}>
          <label> D  </label>
          <Col span={2}>
            {" "}
            <Input type="Number" onChange={onInputD} disabled = {disabled} />{" "}

          </Col>
        </Row> 

        <h4> 6. Берілген функция үшін табылған стационар нүкте </h4> 
<Row gutter={20}>
    
    <Col span={2}>
      {" "}
      <select onChange={onInputAns} > 
      <option value="" disabled selected>таңдаңыз </option>
        <option value="maximum"> Maximum</option>
        <option value="minimum"> Minimum</option>
        <option value="extremum емес"> extremum емес</option>
        <option value="белгісіз"> белгісіз </option>
      </select>
    </Col>
  </Row> 

        </Container>

        <StyledButton  type='submit' disabled={disabled} > сақтау </StyledButton>
  </form>

  </div>
)
}

export default ExtrRoot_5