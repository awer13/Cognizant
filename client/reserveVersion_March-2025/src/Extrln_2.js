import React, {useState,useRef, useEffect} from "react";
//import React, {useState,useRef, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import katex from "katex";
import "katex/dist/katex.min.css";


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
  text-align: left;
  margin-left: 60px;
  
`
const MatrixRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 180px;
  align-items: flex-start;
  padding: 5px;
  font-size: 15px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  font-size: 15px;
`

const Container1 = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  font-size: 15px;
  color: red;
`
const StyledButton = styled.button`
  width: 200px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`


function Extrln_2({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, stSpN, setstSpN, stDipN, setDiPN, taskNumber, setTaskNumber}) {
    const  eps = 0.001, qnum=5;
  
    var max=5, der2di;
   
    const [stIndef2, setstIndef2] = useState(["notchosen"]);
   
    const [stDer2di, setstDer2di] = useState([]); //stud's second derivative at discontinuity points
    const stDer2 = Array(stDipN).fill(0);
    //const [stStp, setSstpoint] = useState([]); 
     
    //const [der2st, setDer2st] = useState([]); // second derivative at stationary points

    const [stAns, setstAns] = useState("notyet");

    //katex here
   // const containerDiRef = useRef(null);
    const containerStRef = useRef(null);
    //const containerLDRef = useRef(null);

    //const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}+{b}x^{{b}}+ {d}x}{{p}x^{{m}}+{q}x^{{t}}+{s}x+{c}} ')
    //const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    const [texExpressionSt,setTextExpressionSt] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
   
    console.log("Here is new run");

/*
    useEffect(() => {
      //if (stDipN===1)
        katex.render(`y''(0)  `, containerDiRef.current);
      //else
      //katex.render(`y''(d_i),   i=\\overline{1,${stDipN}}   `, containerDiRef.current);
    }, [texExpression1]);
    */

    useEffect(() => {
      if (stSpN===1)
        katex.render(`y''(s_1)  `, containerStRef.current);
      else
      katex.render(`y''(s_i),   i=\\overline{1,${stSpN}}   `, containerStRef.current);
    }, [texExpressionSt]);

    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }

    const maxk=8;
   
    const onInputIndef2 = (event) => {
      setstIndef2(event.target.value)
  }


  const onInputder2dip = (event) => {
     setstDer2di(event.target.value);
    console.log("stder2dip=",stDer2di);
  }
  
console.log('stDipN=', stDipN)
console.log('stIndef2=', stIndef2)

//let d2dis = Array(stDipN).fill(0);
//setDer2di(der2disc);
//setstDer2(d2dis);


    const onInputAns = (event) => {
      setstAns(event.target.value)
    }
    
    const [disabled, setDisabled] = useState(false);

    

    let stStp = Array(stSpN).fill(0);
    
    let der2st = Array(stSpN).fill(0);
/*
    const saveData = async (stIndef2, stDer2di, stAns) => {
      try {
        const docRef = await addDoc(collection(db, 'extrLn_1'), { //thepeng
        //z: 'y=x^2-cln x;    der_z',
        //zz: 'case n=m, g=a/p 0 0 a/p',
          //TaskNumber: taskNumber,   
          //c_z: [c, z], 
          stderDiInf: stIndef2, 
          stder_di: stDer2di,
          stAns: stAns,
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  
    React.useEffect(() => {  
      if ((stAns!=="notyet")){  
        saveData(stIndef2, stDer2di, stAns)
      }
  }, [stAns])
  */
    const handleSubmit_2 = (event) => {
      let count = 0;
    setDisabled(!disabled);
    event.preventDefault();


       for (let i = 0; i < stSpN; i++) { 
        if ((event.target[count].value)==="")
          stStp[i]="empty"
       else stStp[i]=Number(event.target[count].value)
           count += 1;
       }
       console.log("stStp=",stStp);
     
      // count += 1;
       for (let i = 0; i < stSpN; i++) { 
        if ((event.target[count].value)==="")
          der2st[i]="empty"
       else der2st[i]=Number(event.target[count].value)
           count += 1;
       }
  
      console.log("der2st=",der2st);
     // count += 1;
    /*
      for (let i = 0; i < stDipN; i++) { 
      console.log("stDerdipcount=",count);
      stDer2[i] = !isNaN((event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        stDerdip[i] = stDer2[i];
        console.log("i=",i,"stDerdip=",stDerdip[i]);
      count += 1;
    }
    setstDer2(stDerdip);   /// to here-2
    console.log("stDer2=",stDer2);
    */

    
/*
    for (let i = 0; i < stSpN; i++) { 
      console.log("stDerstcount=",count);
      der2st[i] = !isNaN((event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        stDerst[i] = der2st[i];
        console.log("i=",i,"der2st=",der2st[i]);
      count += 1;
    }
    setDer2st(stDerst);   
    console.log("der2st=",der2st);
*/

let j = 0;
console.log("stDipN=",stDipN);
//console.log("ind=",ind);

if ((stIndef2!="empty")&&(stIndef2 ==="не существует")) { 
    scoreA[5]=scoreA[5]+max/qnum;
  }

    for (let i = 0; i < qnum; i++){
      totalScoreA=totalScoreA+scoreA[i];
    }
    
    setScoreA(scoreA)
    setTotalScoreA(totalScoreA);
    
    stScore=totalScoreA;
    setStScore(stScore);
    mssg="1done";
    setMessage(mssg);

   console.log("mssg=",mssg);
  }
return (
    <div>

    <form onSubmit={handleSubmit_2}>
    <Container> 
      
   
      <h4> 1.6 Введите стационарную(ые) точку(и) </h4>
  <MatrixRow > 
    { /*{stStp.map((row, indexRow = 1) => {*/}
      {stStp.map((row, indexRow = 1) => {
      
      return (
        <MatrixRow key={indexRow} >
          {" "}
          <label > s_{indexRow + 1} </label> &nbsp;
          <input
            key={indexRow}
            type="text"
            name={indexRow}
          /> 
        </MatrixRow>
      );
    })}
    </MatrixRow>

    <h4> 1.7 Введите значение(я)  <myh ref={containerStRef}/>:  </h4>
  <MatrixRow > 
     {der2st.map((row, indexRow = 1) => {
      return (
        <MatrixRow key={indexRow} >
          {" "}
          <Row gutter={20}>
          <Col span={20}>
                <label > </label> 
                <label > y''(s_{indexRow + 1}) </label> &nbsp;
                </Col > 

        <Col span={2}>  <label > </label>  </Col > 
        <Col span={2}>
        <label > </label> 
          <input
            key={indexRow}
            type="text"
            name={indexRow}
            disabled={disabled}
            // onChange={onInputApolynom}
          /> 
          <label>   </label>
          </Col > 
          <label > </label> 
          </Row> 
        </MatrixRow>
      );
    })}
    </MatrixRow>


     </Container>

        <Container> 
      
        <Container1><h4> Подтвердите отправку введенных ответов: </h4> </Container1>
        
        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputAns} disabled={disabled} required > 
            <option value="" disabled selected >подтвердите </option>
            <option  value="подтверждено">  отправить </option>
            {/*<option value="нет">  нет </option>*/}
      </select>
          </Col>
        </Row> 

        </Container>

        <StyledButton type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
  </form>
  </div>
)
}

export default Extrln_2
