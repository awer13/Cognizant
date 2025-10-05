import React, {useState, useRef, useEffect} from "react";
//import katex from "katex";
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

//function ExtrCubic_0({scoreA, setScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
function Ncssr_2({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  q=4, eps = 0.001;
    var scoreA=Array(q).fill(0);
    var  xTerm, a, ans, subst;
    const max=7, submax=2;
    
    const [stAns, setstAns] = useState(['undef']);
    const [stSubst, setstSubst] = useState(["undef"]);

    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    const [p, setP] = useState([]);
    const [d, setD] = useState([]);
    const [x, setX] = useState([]);
    const [stLima, setStLima] = useState(["undef"]);
    const [stXterm, setXterm] = useState(["undef"]);

   const containerRef = useRef(null);
  const container0Ref = useRef(null);
  const container1Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\sum\\limits_{k=0}^{\\infty}\\dfrac{b+pk}{{c}k-{d}},   ')
    const [texExpression0,setTextExpression0] = useState('a_x')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{n\\to\\infty}a_{n}=a')

    useEffect(() => {
      katex.render(`\\sum\\limits_{k=0}^{\\infty}\\dfrac{${b}+${p} k}{${c}k-${d}}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,b,p,c,d]); 

    useEffect(() => {
      katex.render(`a_{${x}}    `, container0Ref.current); 
    }, [texExpression0,x]); 

    useEffect(() => {
      katex.render(texExpression1, container1Ref.current) 
    }, [texExpression1]);


    const saveData = async (b, p,  c, d, x,  xTerm, stLima, a, stAns, ans, subst, stSubst, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'ncssr2mydata'), {
        //const docRef = await addDoc(collection(db, 'ncssr2data38'), {
        //const docRef = await addDoc(collection(db, '00_ncssr_2'), { //thepeng
        const docRef = await addDoc(collection(db, '01_ncssr_2'), { //thepeng
        z: 'sum (b+pk)/[ck-d],    k>=0',
        zz: 'variants N=2+4*i, ncssr_2',
        TASKNUMBER: taskNumber,   
        B_p_c_d_k: [b, p, c, d,x], 
        a_k: xTerm,
        a_k_ST: stXterm,
        lim_a: a, 
        lim_a_ST: stLima, 
        summary: ans,
        summary_ST: stAns, 
        why: subst,
        why_ST: stSubst,
        y: '____________________________'
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
    
     React.useEffect(() => {
      if ((stSubst!='undef')&(stAns!='undef')){
        saveData(b, p, c,  d, x, xTerm, stLima, a, stAns, ans, subst, stSubst, taskNumber)
        //saveCalc(stXterm, xTerm, stLima, a, stAns, ans, stSubst, subst, taskNumber)
      }
    }, [stSubst,stAns])
//}, [b,c,p,d,x, stXterm,stLima, stSubst, stAns])

{/*
    const saveCalc = async (stXterm, xTerm, stLima, a,  stAns, ans, stSubst, subst, taskNumber) => {
      //console.log("save stScore", stScore)
      try {
        //const docRef = await addDoc(collection(db, 'ncssr2mycalc'), {
        //const docRef = await addDoc(collection(db, 'ncssr2calc38'), {
        const docRef = await addDoc(collection(db, '11ncssr2calc'), { //thepeng
        z: 'sum (b+pk)/[ck-d],    k>=0',
        zz: 'variants N=2+4*i',
          TaskNumber: taskNumber,
          st_a_k: stXterm,
          a_k: xTerm,
          a: a, 
          stLima: stLima, 
          stConclusion: stAns, 
          correctConclusion: ans, 
          stSubst: stSubst, 
          subst: subst
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
 */}
   
    //stScore=totalScoreA;
  

    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const onInputSubst = (event) => {
      setstSubst(event.target.value)
    }

    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }
    
    const maxc=9;
    useEffect(() => {
        setB(myrandom(2,maxc));
        setP(myrandom(2,maxc));
        setC(myrandom(2,maxc));
        setD(myrandom(2,maxc));
        setX(myrandom(3,10));
        while (c===d){
          setD(myrandom(2,maxc));
        }
    }, [])

    const onInputLima = (event) => {
      var lima = (event.target.value);
      if (lima!=="infty") lima = Number(event.target.value)
      setStLima(lima);
    }

    const onInputXterm = (event) => {
      setXterm(event.target.value);
    }
    
    const [disabled, setDisabled] = useState(false);

    xTerm=(b+p*x)/(c*x-d);
    a=p/c;
    ans="расходится";
    //ans="жинақсыз";
    //subst="жинақтылықтың қажетті шарты";
    subst="необходимое условие сходимости";

const handleSubmitSeriesNcssr_1 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
   
    if (Math.abs(xTerm-stXterm)<eps) { 
    scoreA[0]=submax/2;
    }

    if ((Math.abs(stLima-a)<eps)){
      scoreA[1]=scoreA[1]+submax;
    }
    if (stAns===ans){
        scoreA[2]=scoreA[2]+submax;
    }
    
    if (stSubst===subst){
      scoreA[3]=scoreA[3]+submax;
    }
    
    
    for (let i = 0; i < 4; i++){
      totalScoreA=totalScoreA+scoreA[i];
    }
    
    setScoreA(scoreA);
    setTotalScoreA(totalScoreA);
    stScore=totalScoreA;
    setStScore(stScore);
    mssg="1done";
    setMessage(mssg);

    console.log("here is newRun");
    console.log("mssg=",mssg);
    console.log("b=",b, "p=",p);
    console.log("c=",c, "d=",d);
    console.log("x=",x);
    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("diffAk=",xTerm-stXterm);
    console.log("a=",a, "stLima=",stLima);
    console.log("ans=",ans, "stAns=", stAns);
    console.log("subst=",subst, "stSubst=", stSubst);
    
  }
return (
  
    <div>
         
  <form onSubmit={handleSubmitSeriesNcssr_1}>
  <Container>
       {/* <h3> 1-есеп </h3>  */}
       <h3> Задача-1 </h3> 
      </Container>
     
      <Container0>  
      <myh ref={containerRef} />
    </Container0> 
  
     {/* <Container1> <h4> қатары берілген </h4></Container1> */}
       <Container> 

        {/* <h4>  1.  Қатардың  <myh ref={container0Ref}/>  мүшесін (a.bcde форматында) енгізіңіз: </h4>*/}
        <h4> 1.1 Введите значение <myh ref={container0Ref}/> (в формате a.bcde ) для данного ряда: </h4>
        
      <Row gutter={20}>
      
      <label>    </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputXterm} /> {" "}
          </Col>
        </Row> 
        

{/* <h4> 2.    Жалпы мүшесінің  <myh ref={container1Ref} />  шегін есептеп, мәнін енгізіңіз: </h4> */}
<h4> 1.2 Введите значение предела <myh ref={container1Ref} /> для данного ряда: </h4>
      <Row gutter={20}>
      <label>  a: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputLima} /> {" "}
          </Col>
        </Row> 
        </Container>

  <Container>  
      {/* <h4> {"3. Берілген қатардың жинақтылығы туралы не айта аласыз?"} </h4> */}
      <h4> 1.3 Что можете сказать о сходимости данного ряда?: </h4>

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
         <h4> 1.4 Обоснуйте свой ответ: </h4>
        {/* <h4> 4. Жауабыңызды негіздеңіз: </h4> */}

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputSubst} required > 

            <option value="" disabled selected >выберите </option>
            {/* <option value="" disabled selected >таңдаңыз </option> */}
            <option value="по определению"> по определению</option>
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

export default Ncssr_2