import React, {useState,useRef, useEffect} from "react";
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
  margin-top: -40px;
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
function Ncssr_1({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  q=4, eps = 0.001;
    var scoreA=Array(q).fill(0);
    var  xTerm, a, ans, subst;
    const submax=2;
    

   
    const [stAns, setstAns] = useState([]);
    const [stSubst, setstSubst] = useState([]);
    //const [letsave, setLetsave] = useState([]);

    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    const [p, setP] = useState([]);
    const [d, setD] = useState([]);
    const [x, setX] = useState([]);
    //const [saveit, setSave] = useState(0);
    const [stLima, setStLima] = useState(["undef"]);
    const [stXterm, setXterm] = useState(["undef"]);

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\sum\\limits_{k=1}^{\\infty}\\dfrac{b+p k^2}{{c}k^2+{d}k}   ')
    const [texExpression0,setTextExpression0] = useState('a_x')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{n\\to\\infty}a_{n}=a')

    useEffect(() => {
      katex.render(`\\sum\\limits_{k=1}^{\\infty}\\dfrac{${b}+${p} k^2}{${c}k^2+${d}k},    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,b,p,c,d]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
      katex.render(texExpression1, container1Ref.current) 
    }, [texExpression1]);

    useEffect(() => {
      katex.render(`a_{${x}}    `, container0Ref.current); 
    }, [texExpression0,x]); 
   
    const saveData = async (b,  p, c, d, x, xTerm, stLima, a, stAns, ans, subst, stSubst, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'ncssr1mydata'), {
        const docRef = await addDoc(collection(db, 'ncssr1test'), {
        //const docRef = await addDoc(collection(db, '01_ncssr_1'), { //thepeng
        //const docRef = await addDoc(collection(db, '00_ncssr_1'), { //thepeng
        z: 'sum (b+pk^2)/[ck^2+dk],    k>=1',
        zz: 'variants N=1+4*i, ncssr_1',
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
      if ((stSubst!=0)&(stAns!=0)){
        saveData(b,  p, c, d, x, xTerm, stLima, a, stAns, ans, subst, stSubst, taskNumber)
        //saveCalc(stXterm, xTerm, stLima, a,  stSubst, ans, subst, stAns, taskNumber)
      }
}, [stSubst,stAns])
//}, [b,c,p,d,x, stXterm,stLima, stSubst, stAns])

{/*
    const saveCalc = async (stXterm, xTerm, stLima, a, stAns, ans, subst, stSubst, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'ncssr1mycalc'), {
        //const docRef = await addDoc(collection(db, 'ncssr1calc38'), {
        const docRef = await addDoc(collection(db, '11ncssr1calc'), { 
        z: 'sum (b+pk^2)/[ck^2+dk],    k>=1',
        zz: 'variants N=1+4*i',
          TaskNumber: taskNumber,
          a_k: xTerm,
          st_a_k: stXterm,
          stLima: stLima, 
          a: a, 
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
      /*setA(3);      setC(6);    setP(16);  */
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
      //if (!lima) {
        //alert('Please fill out all required fields');
      //}
    }

    const onInputXterm = (event) => {
      setXterm(event.target.value);
    }
    
    const [disabled, setDisabled] = useState(false);

    xTerm=(b+p*x*x)/(c*x*x+d*x);
    a=p/c;
    ans="расходится";
    //ans="жинақсыз";
    //subst="жинақтылықтың қажетті шарты";
    subst="необходимое условие сходимости";

    const handleSubmitSeriesNcssr_1 = (event) => {
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
    
    
    setScoreA(scoreA)
    setTotalScoreA(totalScoreA);
    
    //substatus="solved1";
    //setSubstatus(substatus);

    console.log("here is newRun");
   // console.log("substatus=",substatus);
    console.log("mssg=",mssg);
    console.log("b=",b, "p=",p);
    console.log("c=",c, "d=",d);
    console.log("x=",x);

    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("a=",a, "stLima=",stLima);
    console.log("ans=",ans, "stAns=", stAns);
    console.log("subst=",subst, "stSubst=", stSubst);

    stScore=totalScoreA;
    setStScore(stScore);
    mssg="1done";
    setMessage(mssg);
  }
return (
    <div>
      <Container>
        {/* <h3> 1-есеп </h3>  */}
      <h3> Задача-1 </h3> 
      </Container>
        
  <form onSubmit={handleSubmitSeriesNcssr_1}>

  <Container0>  
      <myh ref={containerRef}   />
    </Container0> 

    {/* <Container1> <h4> қатары берілген </h4></Container1> */}

    
       <Container> 

       {/* <h4>  1.  Қатардың  <myh ref={container0Ref}/>  мүшесін (a.bcde форматында) енгізіңіз: </h4>*/}
       <h4> 1.1 Введите значение <myh ref={container0Ref}/> (в формате a.bcde ) для данного ряда: </h4>
      <Row gutter={20}>
      <label>     </label>
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
            <select onChange={onInputSubst} disabled={disabled} required > 
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

export default Ncssr_1
