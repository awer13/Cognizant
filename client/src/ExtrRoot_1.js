import React, {useState, useRef, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import katex from "katex";
import "katex/dist/katex.min.css";

const Container0 = styled.div`
  display: inline-block;
  flex-direction: column;
  padding: 20 px;
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
const Container5 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  padding-right: 50px;
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
  width: 200px;
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

//function ExtrRoot_1({score, setScore, totalScore,setTotalScore,mssg, setMessage, }) {
function ExtrRoot_1({score, setScore, totalScore,setTotalScore, stScore, setStScore, mssg, setMessage, taskStatus, setStatus,taskNumber, setTaskNumber}) {
   
    const tmax=10, qmax =tmax/10, q=10; // tmax is max for task,   qmax is max for question
    const eps = 0.01;
    const a=1;
    const spNum=1;
    var spx,spy,xx,xy,yy, det;
    var score=Array(q+1).fill(0);
    var ans, maxc, dep;
   

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
    const [sol, setSol] = useState([]);
  
    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    const [p, setP] = useState([]);

    const containerRef = useRef(null);
    const [texExpression,setTextExpression] = useState('z={a}x^3+{b}y^3-{c}xy+{p}   ')
    useEffect(() => {
      katex.render(`z=-${b}y^2-${c}x+${p}y+y\\sqrt{x}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,b,c,p]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya
    
/*
    const saveData = async (a, b, c, p, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'root1mydata'), {
        const docRef = await addDoc(collection(db, '0_root1stdata'), { //thepeng
          z: "ax³ + by³ - cxy+p      variants N=1+4*i",
          taskNumber: taskNumber,
          a: a,     
          b: b, 
          c: c,
          p: p
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
    React.useEffect(() => {
      saveData(a, b, c,p,taskNumber)
    }, [taskStatus])
*/

    const saveCalc = async (a, b, c, p, spNum,  n, x,y,spx, spy, dzx, dzy, xx, dxx, xy, dxy, dyx, yy, dyy, stD, det, stAns, sol, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'root1mycalc'), {
        const docRef = await addDoc(collection(db, '00_ExtrRoot1'), { //thepeng
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

          j_Conclusion: sol,
          j_stu_Conclusion: stAns,
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    
    React.useEffect(() => {
      console.log("taskStatus=", taskStatus); 
      if (taskStatus==="2done"){
        console.log("taskStatus=", taskStatus); 
        saveCalc(a, b, c, p, spNum,  n, x,y,spx, spy, dzx, dzy, xx, dxx, xy, dxy, dyx, yy, dyy, stD, det, stAns, sol, taskNumber)
      }
   // }, [mssg])
    }, [taskStatus])

    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const myrandom = (min,maxi) => {
      return Math.trunc(Math.random()*(maxi-min+1))+min;
    }

    maxc=8;

    useEffect(() => {
      setB(myrandom(2,maxc));
      setC(myrandom(2,maxc));
      setP(myrandom(2,maxc));
  }, [])

  dep=4*b*c-a**2;
    spx=(a*p/dep)**2;
    spy=2*c*p/dep;

    xx=-c*dep**2/(2*(a**2)*(p**2));
    xy=dep/(2*p);
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
    

  //  const onInputD = (event) => {
    //  setstD(Number(event.target.value)); }


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
        ypoi[i] = y[i];
      count += 1;
    }
    setXpoint(xpoi);
    setYpoint(ypoi);
  
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

    for (let i = 0; i < n; i++) {
      stD[i] = !isNaN(Number(event.target[count].value))
      ? Number(event.target[count].value)
        : "NaN";
      count += 1;
    }
    setstD(stD);
   
    
   if (n===spNum) {
    score[0]=qmax;
    } 
    //totalScore=totalScore+score[0];
    //if (x[n-1]===spx) {
    if ((Math.abs(x[n-1]-spx)<eps)){
      score[1]=qmax;
    } 
    if ((Math.abs(y[n-1]-spy)<eps)){
    //if (y[n-1]===spy) {
      score[2]=qmax;
    } 
    if (dzx[n-1]===0) {
      score[3]=qmax/2;
    } 
    if (dzy[n-1]===0) {
      score[4]=qmax/2;
    } 
    if ((Math.abs(dxx[n-1]-xx)<eps)){
    //if (dxx[n-1]===xx) {
      score[5]=qmax;
    } 
    if ((Math.abs(dxy[n-1]-xy)<eps)){
    //if (dxy[n-1]===xy) {
      score[6]=qmax;
    } 
    if ((Math.abs(dyx[n-1]-xy)<eps)){
    //if (dyx[n-1]===xy) {
      score[7]=qmax;
    } 
    if ((Math.abs(dyy[n-1]-yy)<eps)){
    //if (dyy[n-1]===yy) {
      score[8]=qmax;
    } 
    if ((Math.abs(det-stD)<eps)){
    //if (det===stD) {
      score[9]=qmax;
    } 
    
    if ((det>0)&&(xx>0)) ans="minimum"
    else if ((det>0)&&(xx<0)) ans="maximum"
    else if (det<0)  ans="не extremum"
    else ans="неизвестно"

    setSol(ans);

    console.log("xx=", xx,"det=", det, "ans=", ans);

  var miniscore=0;
  for (let i = 0; i < 10; i++){
    miniscore=miniscore+score[i]*score[i];
  }
  console.log("miniscore=", miniscore); 

    if ((stAns===ans) && (miniscore>0)){
    score[10]=qmax;
  }

    for (let i = 0; i < 11; i++){
      totalScore=totalScore+score[i];
      //stScore[1]=stScore[1]+score[i];
    }

    setScore(score)
    setTotalScore(totalScore)

   // stScore[2]=stScore[2]+stScore[1]*(max/2)/100;

   //stScore=stScore+totalScore*(max/2)/100;
   //stScore=stScore+totalScore*tmax/100;
   stScore=stScore+totalScore;
   
    //setMessage(mssg)
    setStScore(stScore)
    //taskStatus="2ndSolved"
    taskStatus="2done"
    setStatus(taskStatus)
    //setSent("allDone")
    console.log("taskStatus=",taskStatus);

    //mssg="2done" // mar 15, 2025
    //setMessage(mssg)

    console.log("data, correct ans, stAns");
    console.log("Root1:  a=", a, "b=", b, "c=", c, "p=", p);
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

    <div >
       <Container>
        {/* <h3> 1-есеп </h3>  */}
      <h3> Задача-2 </h3> 
      </Container>

      <Container0>   
      <myh ref={containerRef}   />
     {/* <mymath>  z = -{b}y² - {c}x + {p}y + y√x  </mymath> 
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
            <Input type="Number" onChange={onInputNpoints} disabled = {disabled} min={1} max={100}  />{" "}
          </Col>

        </Row> 
        
        </Container>
   
  <form onSubmit={handleSubmitExtrRoot}>

  <Container>  
  <h4> {"2. Введите координаты стационарной(ых) точки(ек):"} </h4>
  {/*   <h4> {"2. Стационар нүкте(лері)нің координаттарын енгізіңіз:"} </h4>  */}
             
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
                  disabled = {disabled}
                  required
                />
                 <label>  y_{indexRow+1}  </label>&nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  disabled = {disabled}
                  required
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
                  <myh> z'(x_{indexRow+1},y_{indexRow+1}):  </myh> 
                  <label>  z'_x</label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    disabled = {disabled}
                    required
                  />
                   <label>  z'_y  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    disabled = {disabled}
                    required
                  />
                </MatrixRow>
             
              );
            })}
            </MatrixColumn>
            
            <h4> {"4. Введите значения производных 2-порядка в стационарной(ых) точке(ах):"} </h4>
             
             <MatrixColumn>
            {dxx.map((row, indexRow = 1) => {
              return (
                 
                <MatrixRow  key={indexRow}>
                   <myh> z''(x_{indexRow+1},y_{indexRow+1}):  </myh> 
                  <label>  z''_xx</label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    required
                    disabled = {disabled}
                    // onChange={onInputBpolynom}
                  />
                   <label>  z''_xy  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    disabled = {disabled}
                    required
                  />

<label>  z''_yx  </label>&nbsp;
                  <input
                    key={indexRow}
                    type="text"
                    name={indexRow}
                    disabled = {disabled}
                    required
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
         
            </Container>
            <Container5>
        {/*  <h4> 5. Экстремумның жеткілікті шартындағы D мәнін енгізіңіз </h4>  */}
        <h4> {"5. Введите значение(я) Delta из достаточного условия экстремума:"} </h4>
        
        <MatrixColumn>
          {x.map((row, indexRow = 1) => {
            return (
              <MatrixRow>
             <myh5> Delta(x_{indexRow+1},y_{indexRow+1}):     </myh5> 
             {/* <myh5> D(x_{indexRow+1}, y_{indexRow+1}):     </myh5>  */}
             { /* <label>  <myh5> D(x_{indexRow+1}, y_{indexRow+1}): </myh5>    </label>*/}
                
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
          </Container5>
          <Container>
        <h4> 6. Для данной функция найденная(ые) стационарная(ые) точка(и) являе(ю)тся </h4> 
        <MatrixColumn> 
      {" "}
      <MatrixRow>
          <Row gutter={0}> 
      <select onChange={onInputAns} required  disabled = {disabled}> 

      <option value="" disabled selected>выберите </option>
        <option value="maximum"> maximum</option>
        <option value="minimum"> minimum</option>
        <option value="не extremum"> не является экстремумом</option>
        <option value="неизвестно"> неизвестно </option>
      </select>
      </Row>
      </MatrixRow>
 
  </MatrixColumn>  
        </Container>

        <StyledButton  type='submit' disabled={disabled} > сохранить </StyledButton>
  </form>

  </div>
)
}

export default ExtrRoot_1