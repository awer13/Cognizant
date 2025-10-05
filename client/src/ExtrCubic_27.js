import React, {useState, useRef, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import katex from "katex";
import "katex/dist/katex.min.css";

/*
2 stationary points

  z = {a}x³ + {b}y³ - {c}xy+{p}  

this version contains flexible input boxes 
depending on a number of stationary points 
February 21, 2024 
_______________________
by Assem Kabidoldanova
*/

const Container0 = styled.div`
  display: inline-block;
  flex-direction: column;
  padding: 20px;
  padding-left: 40px;
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

function ExtrCubic_27({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskStatus, setStatus, taskNumber, setTaskNumber}) {
  const  q=10;
  var scoreA=Array(q+1).fill(0);
  var  k, spNum, nonzero="nothing";
  var index=1, tmax=10, qmax =tmax/10, eps = 0.001;
  var spx=Array(2).fill(0),
  spy=Array(2).fill(0),
  xx=Array(2).fill(0),
  xy=Array(2).fill(0),
  yy=Array(2).fill(0),
  det=Array(2).fill(0),
  ans=Array(2).fill(" ");
  var stX=Array(2).fill(0),
  stY=Array(2).fill(0),
  stZx=Array(2).fill(0),
  stZy=Array(2).fill(0),
  stXx=Array(2).fill(0),    
  stXy=Array(2).fill(0),
  stYx=Array(2).fill(0),
  stYy=Array(2).fill(0),
  stDet=Array(2).fill(0),
  stSol=Array(2).fill(" ");
  const [x, setXpoint] = useState([]);
  const [y, setYpoint] = useState([]);
  const [n, setNpoints] = useState("undef");
  const [dzx, setdzX] = useState([]);
  const [dzy, setdzY] = useState([]);
  const [dxx, setdXX] = useState([]);
  const [dxy, setdXY] = useState([]);
  const [dyx, setdYX] = useState([]);
  const [dyy, setdYY] = useState([]);
  const [stD, setstD] = useState([]);
  const [stAns, setstAns] = useState([]);
  const [a, setA] = useState([]);
  const [c, setC] = useState([]);
  const [p, setP] = useState([]);
  //const [stExtr, setExtr] = useState([]);

 // const [onoff, setOnoff] = React.useState([])

  const maxc=8,  b=8;
  const aa=27;

  const containerRef = useRef(null);
  const [texExpression,setTextExpression] = useState('z={a}x^3+{b}y^3-{c}xy+{p}   ')
  useEffect(() => {
    katex.render(`z=\\dfrac{1}{\\sqrt{${aa}}}x^3+${b}y^3-${c}xy+${p}    `, containerRef.current); //tut skobki drugie i ${tut variable}
  }, [texExpression,a,b,c,p]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

  const saveCalc = async (a, b, c, p, spNum, n, x,y,spx, spy,  dzx, dzy, xx, dxx, xy, dxy, dyx, yy, dyy, stD, det, stAns, ans, taskNumber) => {
    try {
        const docRef = await addDoc(collection(db, '00_ExtrCubic27'), { //thepeng
          z: "ax³ + by³ - cxy+p-->extr    variants N=1+4*i",
          TaskNumber: taskNumber,
          a_b_c_p: [a, b, c, p],
  
          b_numSP_stuN: [spNum, n],   
          c_statPointX: spx,  
          c_stu_spX: x,

          d_statPointY: spy, 
          d_stu_spY: y,
         
          e_zx: dzx, 
          e_zy: dzy, 

          f_corr_xx: xx,
          f_stu_xx: dxx, 

          g_corr_xy: xy,
          g_stu_xy: dxy,
          g_stu_yx: dyx,

          h_corr_yy: yy,
          h_stu_yy: dyy,

          i_Det: det,
          i_stu_Det: stD,
          
          j_Conclusion: ans,
          j_stu_Conclusion: stAns,
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
    }
  }

  React.useEffect(() => {
    //console.log("taskStatus=", taskStatus); 
   console.log("mssg=", mssg); 
    if (mssg==="1done"){
      console.log("mssg=", mssg); 
      //console.log("taskStatus=", taskStatus); 
      saveCalc(a, b, c, p, spNum, n, x,y,spx, spy, dzx, dzy, xx, dxx, xy, dxy,dyx, yy, dyy, stD, det, stAns, ans, taskNumber)
    }
  }, [mssg])
  
  const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }
    //const maxc=8,  b=8;   [stD, stAns]

    useEffect(() => {
      /*setA(3);      setC(6);    setP(16);  */
      setA(1/(27**(0.5)));  
      //setA(myrandom(2,5));
        setC(myrandom(2,maxc));
        setP(myrandom(10,3*maxc));
    }, [])


    k=b**(1/3);
    spx[0]=0;             spy[0]=0;

    xx[0]=0;              xy[0]=-c;
    yy[0]=0;
    det[0]=xx[0]*yy[0]-xy[0]**2;

    spx[1]=c/k;       spy[1]=3*a*c/(k**2);

    xx[1]=6*a*spx[1];        xy[1]=-c;
    yy[1]=6*b*spy[1];
    det[1]=xx[1]*yy[1]-xy[1]**2;

    spNum=2;
    for (let i = 0; i < spNum; i++) {
      if ((det[i]>0)&&(xx[i]>0)) ans[i]="minimum"
      else if ((det[i]>0)&&(xx[i]<0)) ans[i]="maximum"
      else if (det[i]<0)  ans[i]="не extremum"
      else ans[i]="неизвестно"
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
        let stD = Array(nstationar).fill("undef");
        setstD(stD);
        //console.log("stD=", stD); 
        let stAns = Array(nstationar).fill("undef");
        setstAns(stAns);
    }

   

    const [disabled, setDisabled] = useState(false);

    const handleSubmitExtrCubic_0 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();

    
    for (let i = 0; i < n; i++) {
        x[i] = !isNaN(Number(event.target[count].value))
       ? Number(event.target[count].value)
       : "NaN";
      count += 1;
      y[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : "NaN";
      count += 1;
    }
   // setXpoint(x);      
     setYpoint(y);

    for (let i = 0; i < n; i++) {
      dzx[i] =!isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      count += 1;
      dzy[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      count += 1;
    }
    setdzX(dzx);       setdzY(dzy);

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
    setdXX(dxx);        setdXY(dxy);      setdYX(dyx);       setdYY(dyy);

    for (let i = 0; i < n; i++) {
      stD[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      count += 1;
    }
    setstD(stD);

    for (let i = 0; i < n; i++) {
      stAns[i] = (event.target[count].value);
        count += 1;
    }
    setstAns(stAns);   

  
    //onoff="on"
    //setOnoff(onoff)
    //console.log("onoff=", onoff); 
    
   if (n===spNum) { //the case student's n=2
    nonzero=0;  
    scoreA[0]=qmax;
    if ((x[0]===0) && (y[0]===0)) {
      nonzero=1;   
      scoreA[1]=scoreA[1]+qmax;  
      stX=x;       stY=y;
      stZx=dzx;    stZy=dzy;
      stXx=dxx;    stXy=dxy;
      stYx=dyx;    stYy=dyy;
      stDet=stD;       stSol=stAns;
    }
    else if((x[1]===0) && (y[1]===0)) {
      scoreA[2]=scoreA[2]+qmax;     
      stX[0]=x[1];    stX[1]=x[0];
      stY[0]=y[1];    stY[1]=y[0];
      stZx[0]=dzx[1];    stZx[1]=dzx[0];
      stZy[0]=dzy[1];    stZy[1]=dzy[0];
      stXx[0]=dxx[1];    stXx[1]=dxx[0];
      stXy[0]=dxy[1];    stXy[1]=dxy[0];
      stYx[0]=dyx[1];    stYx[1]=dyx[0];
      stYy[0]=dyy[1];    stYy[1]=dyy[0];
      stDet[0]=stD[1];    stDet[1]=stD[0];     
      stSol[0]=stAns[1];    stSol[1]=stAns[0];  
    } 
    else nonzero=[0, 1];

    if ((Math.abs(stX[1]-spx[1])<eps) && (Math.abs(stY[1]-spy[1])<eps)){
      if (nonzero===1)
      scoreA[2]=scoreA[2]+qmax;
      else scoreA[1]=scoreA[1]+qmax;
    }
    for (let i = 0; i < n; i++){
      if (Math.abs(stXx[i]-xx[i])<eps){
        scoreA[5]=scoreA[5]+qmax/2;
      }
      if (Math.abs(stXy[i]-xy[i])<eps){
        scoreA[6]=scoreA[6]+qmax/2;
      } 
      if (Math.abs(stYx[i]-xy[i])<eps){
        scoreA[7]=scoreA[7]+qmax/2;
      }
      if (Math.abs(stYy[i]-yy[i])<eps){
        scoreA[8]=scoreA[8]+qmax/2;
      }
      if (Math.abs(stDet[i]-det[i])<eps){
        scoreA[9]=scoreA[9]+qmax/2;
      }
      if (stSol[i]===ans[i]){
        scoreA[10]=scoreA[10]+qmax/2;
      }  
    }
    }  //the end of the case n=2
    else if (n===spNum-1){
      stX=x;       stY=y;         stZx=dzx;    stZy=dzy;
      stXx=dxx;    stXy=dxy;      stYx=dyx;    stYy=dyy;
      stDet=stD;       stSol=stAns;
      if ((stX[0]===0) && (stY[0]===0)) { //the case student's n=1, stat point=(0,0)
        index=0; //index=1; by default
        scoreA[1]=scoreA[1]+qmax;
      }
      else if ((Math.abs(stX[0]-spx[1])<eps) && (Math.abs(stY[0]-spy[1])<eps)){ //the case student's n=1, stat point=nonzero (spx,spy)
        scoreA[1]=scoreA[1]+qmax;
      }
      if (Math.abs(stXx[0]-xx[index])<eps){
        scoreA[5]=scoreA[5]+qmax/2;
      }
      if (Math.abs(stXy[0]-xy[index])<eps){
        scoreA[6]=scoreA[6]+qmax/2;
      } 
      if (Math.abs(stYx[0]-xy[index])<eps){
        scoreA[7]=scoreA[7]+qmax/2;
      }
      if (Math.abs(stYy[0]-yy[index])<eps){
        scoreA[8]=scoreA[8]+qmax/2;
      }
      if (Math.abs(stDet[0]-det[index])<eps){
        scoreA[9]=scoreA[9]+qmax/2;
      }
      if (stSol[0]===ans[index]){
        scoreA[10]=scoreA[10]+qmax/2;
      }
    }
for (let i = 0; i < n; i++){
      if (stZx[i]===0){
        scoreA[3]=scoreA[3]+qmax/(2*n);
      } 
      if (stZy[i]===0){
        scoreA[4]=scoreA[4]+qmax/(2*n);
      }
    }
    for (let i = 0; i < 11; i++){
      totalScoreA=totalScoreA+scoreA[i];
      //stScore[0]=stScore[0]+scoreA[i];
    }
    console.log("data, correct ans, Stans");
    console.log("a=", a, "b=", b, "c=", c, "p=", p);
    console.log("stN=",n);
    console.log("nonzero=", nonzero); //   spx[0]=0;  spy[0]=0; => compare nonzero with 1st
    console.log("spx=", spx);
    console.log("spY=", spy);
    console.log("stX=",stX, "stY=",stY);
    console.log("stZx=",stZx, "stZy=",stZy);
    console.log("xx=", xx, "xy=",xy);
    console.log("yy=", yy);
    console.log("stXx=",stXx, "stXy=",stXy); 
    console.log("stYy=", stYy);
    console.log("stDet=", stDet,"det=", det);
    console.log("stSol=",stSol, "ans=", ans);  
    setScoreA(scoreA)
    
    //stScore[0]=totalScoreA;  stScore[2]=totalScoreB;
    //stScore[0]=stScore[0]+scoreA[i];
    //stScore[1]=0;
    //stScore[2]=stScore[0]*(max/2)/100;

    setTotalScoreA(totalScoreA);
    
    //stScore=totalScoreA*(max/2)/100;
    stScore=totalScoreA;
    //stScore=totalScoreA*tmax/100;

    setStScore(stScore)
    mssg="1done"
    setMessage(mssg)
    console.log("mssg=",mssg);  
    taskStatus="1done"
    setStatus(taskStatus)
    console.log("taskStatus=",taskStatus);
     
  }
return (
    <div>
        <Container>
        {/* <h3> 1-есеп </h3>  */}
      <h3> Задача-1 </h3> 
      </Container>

      <Container0>  
      <myh ref={containerRef}   />
       {/*
        <h3> функциясының экстремумын тауып, төмендегі сұрақтарға жауаптарыңызды енгізіңіз: </h3>
        */}
    </Container0> 

       <Container> 
      <h4> 1. Введите количество стационарных точек </h4>
      {/*   <h4> 1. Стационар нүктелерінің санын енгізіңіз </h4>  */}
      <Row gutter={1}>
      <label>     </label>
          <Col span={3}>
            {" "}
            <Input type="Number" onChange={onInputNpoints}   disabled = {disabled} min={1} max={20}   required/> {" "}
          </Col>

        </Row> 
        
        </Container>

   
  <form onSubmit={handleSubmitExtrCubic_0}>
  
  <Container>  
        <h4> {"2. Введите координаты стационарной(ых) точки(ек):"} </h4>
        {/*   <h4> {"2. Стационар нүкте(лері)нің координаттарын енгізіңіз:"} </h4>  */}
             
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
                  required
                  disabled = {disabled}
                  //oninput={onInputX}
                />
                 <label>  y_{indexRow+1}  </label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  required
                  disabled = {disabled}
                  //oninput={onInputY}
                />
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>
          </Container>  
          
         <Container>
          <h4> {"3. Введите значения частных производных в стационарной(ых) точке(ах):"} </h4>
             {/*  <h4> {"3. Стационар нүкте(лер)дегі 1-ші туындылардың мәндерін енгізіңіз:"} </h4>  */}
             <MatrixColumn>
            {dzx.map((row, indexRow = 1) => {
              return (
                <MatrixRow  key={indexRow}>
                   <myh> z'(x_{indexRow+1}, y_{indexRow+1}):  </myh> 
                  <label>  z'ₓ </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required 
                    disabled = {disabled}/>
                   <label> z'_y  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled} />
                </MatrixRow>
              );
            })}
            </MatrixColumn>
          {/*        <h4> {"4. Стационар нүкте(лер)дегі 2-ші туындылардың мәндерін енгізіңіз:"} </h4>  */}       
          <h4> {"4. Введите значения производных 2-порядка в стационарной(ых) точке(ах):"} </h4>
             
             <MatrixColumn>
            {dxx.map((row, indexRow = 1) => {
              return (
                 
                <MatrixRow  key={indexRow}>
                  <myh> z''(x_{indexRow+1},y_{indexRow+1}):  </myh> 
                  <label>   z''_xx</label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled}
                  />
                   <label>  z''_xy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled}
                  />

<label>  z''_yx  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled}
                  />

                    <label>  z''_yy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled}
                  />
                </MatrixRow>
             
              );
            })}
            </MatrixColumn>
         
    

        {/*  <h4> 5. Экстремумның жеткілікті шартындағы D мәнін енгізіңіз </h4>  */}
        <h4> {"5. Введите значение(я) Delta из достаточного условия экстремума:"} </h4>

        <MatrixColumn>
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
               <myh> Delta(x_{indexRow+1}, y_{indexRow+1}):     </myh> 
               
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  required
                  disabled = {disabled}
                />
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>
         {/*      <h4> 6. Берілген функция үшін табылған стационар нүкте(лер) </h4>   */}
        <h4> 6. Для данной функция найденная(ые) стационарная(ые) точка(и) являе(ю)тся </h4> 

        <MatrixColumn> 
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
               <myh> (x_{indexRow+1}, y_{indexRow+1}):     </myh> 
               
      <select required  disabled = {disabled}> 
        {/*   <option value="" disabled selected>таңдаңыз </option>
        <option value="maximum"> maximum</option>
        <option value="minimum"> minimum</option>
        <option value="extremum емес"> extremum емес</option>
        <option value="белгісіз"> белгісіз </option>   */}
      <option value="" disabled selected >выберите </option>
        <option value="maximum"> maximum</option>
        <option value="minimum"> minimum</option>
        <option value="не extremum"> не является экстремумом</option>
        <option value="неизвестно"> неизвестно </option>
        
      </select>
              </MatrixRow>
           
            );
          })}
          </MatrixColumn>

        </Container>
       {/*  <StyledButton  type='submit' disabled={disabled} > сақтау </StyledButton> */}
        <StyledButton  type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
  </form>
  </div>
)
}

export default ExtrCubic_27