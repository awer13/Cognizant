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

function Dlmbr_2({scoreC, setScoreC, totalScoreC,setTotalScoreC, stScore, setStScore, mssg, setMessage,  taskStatus, setStatus, taskNumber, setTaskNumber}) {
    const  q=4, eps = 0.001;
    var scoreC=Array(q).fill(0);
    var  xTerm, l, ans, subst;
    const submax=2;
    
    const [stAns, setstAns] = useState(["undef"]);
    const [stSubst, setstSubst] = useState(["undef"]);

    const [b, setB] = useState([]);
    const [x, setX] = useState([]);
    const [stL, setStL] = useState(["undef"]);
    const [stXterm, setXterm] = useState("undef");

    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\sum\\limits_{k=1}^{\\infty}\\dfrac{b+p k^2}{{c}k^2+{d}k}   ')
    const [texExpression0,setTextExpression0] = useState('a_x')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{n\\to\\infty}a_{n}=a')

    useEffect(() => {
      katex.render(`\\sum\\limits_{k=1}^{\\infty}\\dfrac{${b}^k}{${b+1}k^2+${b-1}}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,b]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
      katex.render(`\\lim\\limits_{n\\to\\infty}\\dfrac{a_{n+1}}{a_{n}}=l    `, container1Ref.current); 
    }, [texExpression1]);

    useEffect(() => {
      katex.render(`a_{${x}}    `, container0Ref.current); 
    }, [texExpression0,x]); 

    const saveCalc = async (b, x, stXterm, xTerm, stL, l,  stAns, ans, stSubst, subst, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'dlmbr2mycalc'), {
        //const docRef = await addDoc(collection(db, 'dlmbr238'), { 
        const docRef = await addDoc(collection(db, '01_dlmbr_2'), { //thepeng
        //const docRef = await addDoc(collection(db, '00_dlmbr_2'), { //thepeng
        z: 'sum b^k/[(b+1)k^2+(b-1)],    k>=1',
        zz: 'variants N=2+4*i, dlmbr_2, l=b',
        TASKNUMBER: taskNumber,
        B_k: [b, x],
        a_k_ST: stXterm,
        a_k: xTerm,
         l_ST: stL, 
         l: l, 
         summary_ST: stAns, 
         summary: ans, 
         why_ST: stSubst, 
         why: subst,
         y: '____________________________'
        })
        console.log("stSubst",stSubst);
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    React.useEffect(() => {
      if ((stSubst!='undef')&(stAns!='undef')){
        saveCalc(b, x, stXterm, xTerm, stL, l, stAns, ans, stSubst, subst, taskNumber)
      }
    }, [stSubst,stAns])
//}, [b,x, stXterm, stL, stAns, stSubst])


   
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
    
    const maxc=8;
    useEffect(() => {
        setB(myrandom(2,maxc));
        setX(myrandom(3,10));
    }, [])

    const onInputL = (event) => {
      var s = (event.target.value);
      if (s!=="infty") s = Number(event.target.value)
      setStL(s);
    }

    const onInputXterm = (event) => {
      setXterm(event.target.value);
    }
    
    const [disabled, setDisabled] = useState(false);

    xTerm=(b**x)/((b+1)*(x**2)+(b-1)); // 
    l=b;
    ans="расходится";
    subst="Даламбер";

const handleSubmitSerieDlmbr_2 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
   
    if (Math.abs(xTerm-stXterm)<eps) { 
    //scoreC[0]=max2/4;
    scoreC[0]=submax/2;
    }

    if ((Math.abs(stL-l)<eps)){
      scoreC[1]=scoreC[1]+submax;
    }
    if (stAns===ans){
        scoreC[2]=scoreC[2]+submax;
    }
    
    if (stSubst===subst){
      scoreC[3]=scoreC[3]+submax;
    }
    
    
    for (let i = 0; i < 4; i++){
      totalScoreC=totalScoreC+scoreC[i];
    }
    
    
    setScoreC(scoreC)

    setTotalScoreC(totalScoreC);
    
    
    stScore=stScore+totalScoreC;

    setStScore(stScore)
    mssg="3done"
    setMessage(mssg)
    taskStatus="done"
    setStatus(taskStatus)

    console.log("here is newRun");
    console.log("b=",b);
    console.log("x=",x);

    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("l=",l, "stL=",stL);
    console.log("ans=",ans, "stAns=", stAns);
    console.log("subst=",subst, "stSubst=", stSubst);

  }
return (
  
    <div>
         
  <form onSubmit={handleSubmitSerieDlmbr_2}>
  <Container>
      {/* <h3> 3-есеп </h3>  */}
      <h3> Задача-3 </h3> 
      </Container>

    <Container0>  
      <myh ref={containerRef} />
    </Container0> 
  
       <Container> 

       {/* <h4>  1.  Қатардың  <myh ref={container0Ref}/>  мүшесін (a.bcde форматында) енгізіңіз: </h4>*/}
 <h4> 3.1 Введите значение <myh ref={container0Ref}/> (в формате a.bcde ) для данного ряда: </h4>

        
      <Row gutter={20}>
      
      <label>   </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputXterm} /> {" "}
          </Col>
        </Row> 
        
       {/* <h4> 2.     <myh ref={container1Ref}/>     шегін есептеп, мәнін енгізіңіз: </h4> */}
       <h4> 3.2 Введите значение предела  <myh ref={container1Ref}/> для  данного ряда: </h4>
      <Row gutter={20}>
      <label>  l: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputL} /> {" "}
          </Col>
        </Row> 
        </Container>

  <Container>  
     {/* <h4> {"3. Берілген қатардың жинақтылығы туралы не айта аласыз?"} </h4> */}
     <h4> 3.3 Что можете сказать о сходимости данного ряда?: </h4>

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
         <h4> 3.4 Обоснуйте свой ответ: </h4>
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
        <option value="Даламбер"> по признаку Даламбера </option>
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

 
      {/* <StyledButton  type='submit' disabled={disabled} > сақтау   </StyledButton> */}
      <StyledButton  type='submit' disabled={disabled} >  сохранить </StyledButton>
  </form>
  </div>
)
}

export default Dlmbr_2