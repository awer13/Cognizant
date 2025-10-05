import React, {useState, useRef, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import katex from "katex";
import "katex/dist/katex.min.css";

// 1/({b})ᵏ,   k>=0

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
  margin-top: -30px;
  padding-left: 60px;
  font-size: 15px;
`

const StyledButton = styled.button`
  width: 130px;
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

function Sum_2({scoreB, setScoreB, totalScoreB,setTotalScoreB, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  q=4, eps = 0.001;
    var scoreB=Array(q).fill(0);
    var  xTerm, sum, ans, subst;
    const submax=2;
    
    const [stAns, setstAns] = useState(["undef"]);
    const [stSubst, setstSubst] = useState(["undef"]);

    const [b, setB] = useState([]);
    const [x, setX] = useState([]);
    const [stS, setStS] = useState(["undef"]);
    const [stXterm, setXterm] = useState(["undef"]);

    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    
    const [texExpression,setTextExpression] = useState(' ')
    const [texExpression0,setTextExpression0] = useState(' ')
    
    useEffect(() => {
      katex.render(`\\sum\\limits_{k=0}^{\\infty}\\dfrac{1}{(${b})^k}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,b]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
      katex.render(`a_{${x}}    `, container0Ref.current); 
    }, [texExpression0,x]); 


    /*
    const saveData = async (b, x, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'sum2mydata'), {
        //const docRef = await addDoc(collection(db, 'cubic0data'), {nuclear eng
        const docRef = await addDoc(collection(db, 'sum2stdata'), { //thepeng
          z: "ax³ + by³ - cxy+p      for variants N=1+4*i",
          taskNumber: taskNumber,
          b: b, 
          term index: x
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  */

    const saveCalc = async (b, x, stXterm, xTerm, stS, sum,  stAns, ans, stSubst, subst,  taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'sum2mycalc'), {
        //const docRef = await addDoc(collection(db, 'sum238'), { 
        const docRef = await addDoc(collection(db, '01_sum_2'), { //thepeng
        //const docRef = await addDoc(collection(db, '00_sum_2'), { //thepeng
        z: 'sum 1/b^k,    k>=0',
        zz: 'variants N=2+4*i, sum_2',
        TASKNUMBER: taskNumber,
          B_k: [b, x],
          a_k_ST: stXterm,
          a_k: xTerm,
          s_ST: stS, 
          s: sum, 
          summary_ST: stAns, 
          summary: ans, 
          why_ST: stSubst, 
          why: subst,
          y: '____________________________'
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    React.useEffect(() => {
      if ((stSubst!='undef')&(stAns!='undef')){
        //saveData(b, c, p, d, x, taskNumber)
        saveCalc(b,x,stXterm, xTerm, stS, sum, stAns,  ans, stSubst, subst,  taskNumber)
      }
    }, [stSubst,stAns])
//}, [b,x, stXterm,stS, stSubst, stAns])


    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const onInputSubst = (event) => {
      setstSubst(event.target.value)
    }

    const myrandom = (min,maxi) => {
       var v=(Math.trunc(Math.random()*(maxi-min+1))+min);
       while (v===0) {
        v=v+(Math.trunc(Math.random()*(maxi-min+1))+min);;
       }
       return v;
    }
    
   
    const maxc=-2;
    useEffect(() => {
        setB(myrandom(-25,maxc));
        setX(myrandom(3,10));
    }, [])

    const onInputS = (event) => {
      var s = (event.target.value);
      if (s!=="infty") s = Number(event.target.value)
      setStS(s);
    }

    const onInputXterm = (event) => {
      setXterm(event.target.value);
    }
    
    const [disabled, setDisabled] = useState(false);

    xTerm=(1)/(b**(x)); // 
    sum=b/(b-1);
    ans="сходится";
    subst="определение";

const handleSubmitSerieSum_1 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
   
    if (Math.abs(xTerm-stXterm)<eps) { 
    scoreB[0]=submax/2;
    }

    if ((Math.abs(stS-sum)<eps)){
      scoreB[1]=scoreB[1]+submax;
    }
    if (stAns===ans){
        scoreB[2]=scoreB[2]+submax;
    }
    
    if (stSubst===subst){
      scoreB[3]=scoreB[3]+submax;
    }
    
    
    for (let i = 0; i < 4; i++){
      totalScoreB=totalScoreB+scoreB[i];
    }
    
    
    setScoreB(scoreB)

    setTotalScoreB(totalScoreB);
    
    
    stScore=stScore+totalScoreB;

    setStScore(stScore)
    mssg="2done"
    setMessage(mssg)

    console.log("here is newRun");
    console.log("b=",b);
    console.log("x=",x);

    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("sum=",sum, "stS=",stS);
    console.log("ans=",stAns, "stAns=", stAns);
    console.log("subst=",subst, "stSubst=", stSubst);

  }
return (
  
    <div>
         
  <form onSubmit={handleSubmitSerieSum_1}>
  <Container>
      {/* <h3> 2-есеп </h3>  */}
      <h3> Задача-2 </h3> 
      </Container>
     
      <Container0>  
      <myh ref={containerRef} />
    </Container0> 

    
       <Container> 

       {/* <h4>  2.  Қатардың  <myh ref={container0Ref}/>  мүшесін (a.bcde форматында) енгізіңіз: </h4>*/}
       <h4> 2.1 Введите значение <myh ref={container0Ref}/> (в формате a.bcde ) для данного ряда: </h4>
        
      <Row gutter={20}>
      
      <label>   </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputXterm} /> {" "}
          </Col>
        </Row> 
        


       {/* <h4> 2.    Қосындысын есептеп, мәнін енгізіңіз: </h4> */}
       <h4> 2.2 Введите значение суммы данного ряда: </h4>
      <Row gutter={20}>
      <label>  S: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputS} /> {" "}
          </Col>
        </Row> 
        </Container>

  <Container>  
    {/* <h4> {"3. Берілген қатардың жинақтылығы туралы не айта аласыз?"} </h4> */}
    <h4> 2.3 Что можете сказать о сходимости данного ряда?: </h4>

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputAns} required > 
       {/* <option value="" disabled selected>таңдаңыз </option> */}
     <option value="" disabled selected> выберите </option>
      {/* <option value="жинақты"> жинақты</option>  */}
        <option value="сходится"> сходится</option>
        {/*  <option value="жинақсыз"> жинақсыз</option> */}
        <option value="расходится"> расходится</option>
        {/*  <option value="белгісіз"> белгісіз </option> */}
        <option value="неизвестно"> неизвестно</option>

        
      </select>
          </Col>
        </Row>
             
          </Container>  
          
         <Container>
         <h4> 2.4 Обоснуйте свой ответ: </h4>
         {/* <h4> 4. Жауабыңызды негіздеңіз: </h4> */}

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputSubst} required > 
            <option value="" disabled selected >выберите </option>
            {/* <option value="" disabled selected >таңдаңыз </option> */}
            <option value="определение"> по определению</option>
        {/* <option value="анықтама"> анықтама бойынша</option> */}
        <option value="по признаку сравнения"> по признаку сравнения  </option>
        {/* <option value="салыстыру белгісі"> салыстыру белгісі бойынша </option> */}
        <option value="необходимое условие сходимости"> по необходимому условию сходимости </option>
        {/* <option value="жинақтылықтың қажетті шарты"> жинақтылықтың қажетті шарты  бойынша </option> */}
        <option value="по признаку Даламбера"> по признаку Даламбера </option>
        {/* <option value="Даламбер белгісі"> Даламбер белгісі бойынша </option> */}
        <option value="по признаку Коши"> по признаку Коши   </option>
        {/* <option value="Коши белгісі"> Коши белгісі бойынша </option> */}
        {/*  <option value="жинақтылық критерийі"> по критерию  сходимости </option>
         <option value="жинақтылық критерийі"> жинақтылық критерийі  бойынша </option> */}
        <option value="по признаку Лейбница"> по признаку Лейбница </option>
        {/* <option value="Лейбниц белгісі"> Лейбниц белгісі бойынша </option> */}
      </select>
          </Col>
        </Row> 

        </Container>

 
        {/* <StyledButton  type='submit' disabled={disabled} > келесі есепке өту </StyledButton> */}
        <StyledButton  type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
  </form>
  </div>
)
}

export default Sum_2