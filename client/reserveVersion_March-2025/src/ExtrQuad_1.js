import React, {useState, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

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

function ExtrQuad_1({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage,taskNumber}) {
   
    const max = 10, q=10;
    const eps = 0.001;
    var spx,spy,xx,xy,yy, det;
    var scoreA=Array(q+1).fill(0);
    var ans;
   

    const [x, setXpoint] = useState([]);
    const [y, setYpoint] = useState([]);
    const [n, setNpoints] = useState([]);
    const [dzx, setdzX] = useState([]);
    const [dzy, setdzY] = useState([]);
    const [stAns, setstAns] = useState([]);
    const [sol, setSol] = useState([]);
    //const [selectedOption, setSelectedOption] = useState([]);

    const [dxx, setdXX] = useState([]);
    const [dxy, setdXY] = useState([]);
    const [dyx, setdYX] = useState([]);
    const [dyy, setdYY] = useState([]);
    const [stD, setstD] = useState([]);
    const [a, setA] = useState([]);
    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    

    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const saveData = async (a, b, c, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'quad1mydata'), {
        const docRef = await addDoc(collection(db, 'quad1stdata'), { //thepeng
          z: "ax³ + by³ - cxy+p      variants N=1+4*i",
          taskNumber: taskNumber,
          a: a,     
          b: b, 
          c: c
          //p: p
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
    React.useEffect(() => {
      saveData(a, b, c, taskNumber)
    }, [mssg])

    const saveCalc = async (n, x,y,spx, spy, dzx, dzy, dxx,dxy,dyx,dyy, stD, det, stAns, sol, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'quad1mycalc'), {
          const docRef = await addDoc(collection(db, 'quad1stcalc'), {// thepeng
          z: "ax³ + by³ - cxy+p-->extr    variants N=1+4*i",
          taskNumber: taskNumber,
          studentsStatPointsNum: n,    
          studentsX: x,
          studentsY: y,
          statpointX: spx, 
          statpointy: spy, 
          zx: dzx, 
          zy: dzy, 
          zxx: dxx, 
          zxy: dxy,
          zyx: dyx,
          zyy: dyy,
          studentsDet: stD,
          correctDet: det,
          stConclusion: stAns,
          correctConclusion: sol
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    React.useEffect(() => {
      saveCalc(n, x,y,spx, spy,dzx, dzy, dxx,dxy,dyx,dyy, stD, det, stAns, sol, taskNumber)
    }, [mssg])

    const myrandom = (min,maxi) => {
      return Math.trunc(Math.random()*(maxi-min+1))+min;
    }

    const maxc=8;
    useEffect(() => {
        setA(myrandom(10,20));
        setB(myrandom(2,maxc));
        setC(myrandom(2,maxc));
    }, [])

    spx=a/(2*c);
    spy=-a/(2*b);

    xx=-2*c;
    xy=0;
    yy=-2*b;
    det=xx*yy-xy**2;


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


    const handleSubmitExtrQuad = (event) => {
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
        ypoi[i] = y[i];
      count += 1;
    }
    setXpoint(xpoi);
    setYpoint(ypoi);
  
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

      dxx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      
      count += 1;
      dxy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
  
      count += 1;

      dyx[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      
      count += 1;
      dyy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";

      count += 1;

    }
    setdXX(dxx);
    setdXY(dxy);
    setdYX(dyx);
    setdYY(dyy);
    
   if (n===1) {
    scoreA[0]=10;
    } 
    totalScoreA=totalScoreA+scoreA[0];

    if (Math.abs(x[n-1]-spx)<eps) {
      scoreA[1]=10;
    } 
    totalScoreA=totalScoreA+scoreA[1];
    

    if (Math.abs(y[n-1]-spy)<eps) {
      scoreA[2]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[2];
    

    if (dzx[n-1]===0) {
      scoreA[3]=5;
    } 
    
    totalScoreA=totalScoreA+scoreA[3];
    

    if (dzy[n-1]===0) {
      scoreA[4]=5;
    } 
    
    totalScoreA=totalScoreA+scoreA[4];
    

    if (Math.abs(dxx[n-1]-xx)<eps) {
      scoreA[5]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[5];
    

    if (Math.abs(dxy[n-1]-xy)<eps) {
      scoreA[6]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[6];
    

    if (Math.abs(dyx[n-1]-xy)<eps) {
      scoreA[7]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[7];
    

    if (Math.abs(dyy[n-1]-yy)<eps) {
      scoreA[8]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[8];
    

    if (Math.abs(det-stD)<eps) {
      scoreA[9]=10;
    } 
    
    totalScoreA=totalScoreA+scoreA[9];


   if ((det>0)&&(xx>0)) ans="minimum"
   else if ((det>0)&&(xx<0))  ans="maximum"
   else if (det<0)  ans="extremum емес"
   else ans="белгісіз"

   setSol(ans);

  if (stAns===ans){
    scoreA[10]=10;
  }
  
    totalScoreA=totalScoreA+scoreA[10];

    setScoreA(scoreA)
    setTotalScoreA(totalScoreA)
    stScore=totalScoreA*(max/2)/100;
    setStScore(stScore)
    mssg="1done"
    setMessage(mssg)

    console.log("data, correct ans, stAns");
    console.log("a=", a, "b=", b, "c=", c);
    console.log("stN=",n);
    console.log("spx=", spx);
    console.log("spY=", spy);
    console.log("stX=",x, "stY=",y);
    console.log("stZx=",dzx, "stZy=",dzy);  

    console.log("xx=", xx, "xy=",xy);
    console.log("yy=", yy);
    console.log("stXx=",dxx, "stXy=",dxy); 
    console.log("stYy=", dyy);
    console.log("stDet=", stD,"det=", det);
    console.log("stAns=",stAns, "ans=", ans);  
  }

return (
    <div>
      <Container0>   
      
     <mymath>  z = {a}(x-y) - {b}y² - {c}x²  </mymath>
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
       
        
        
  <form onSubmit={handleSubmitExtrQuad}>

  <Container>  
        <h4> {"2. Стационар нүкте(лер)інің координаттарын енгізіңіз:"} </h4>
             
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
                  required
                />
                 <label>  y_{indexRow+1}  </label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  required
                />
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>
          </Container>  
          
         <Container>
          <h4> {"3. Стационар нүктедегі 1-ші туындылардың мәндерін енгізіңіз:"} </h4>
             
             <MatrixColumn>
            {dzx.map((row, indexRow = 1) => {
              return (
                 
                <MatrixRow  key={indexRow}>
                  {" "}
                  
                  <label>  z'ₓ </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                  />
                   <label>  z'_y  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
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
                    required
                    // onChange={onInputBpolynom}
                  />
                   <label>  z''_xy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                  />

<label>  z''_yx  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                  />
                    <label>  z''_yy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
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
            <Input type="Number" onChange={onInputD} disabled = {disabled} required />{" "}

          </Col>
        </Row> 

        <h4> 6. Берілген функция үшін табылған стационар нүкте </h4> 
<Row gutter={20}>
    
    <Col span={2}>
      {" "}
      <select onChange={onInputAns} required> 
      <option value="" disabled selected>таңдаңыз </option>
        <option value="maximum"> maximum</option>
        <option value="minimum"> minimum</option>
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

export default ExtrQuad_1