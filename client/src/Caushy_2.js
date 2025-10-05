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

function Caushy_2({scoreC, setScoreC, totalScoreC,setTotalScoreC, stScore, setStScore, mssg, setMessage,  taskStatus, setStatus, taskNumber, setTaskNumber}) {
    const  q=4, eps = 0.001;
    var scoreC=Array(q).fill(0);
    var  xTerm, l, ans, subst;
    const submax=2;
    
    const [stAns, setstAns] = useState(["undef"]);
    const [stSubst, setstSubst] = useState(["undef"]);

    const [s, setS] = useState([]);
    const [c, setC] = useState([]);
    const [x, setX] = useState([]);
    const [stL, setStL] = useState(["undef"]);
    const [stXterm, setXterm] = useState(["undef"]);

    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\sum\\limits_{k=1}^{\\infty}\\left[\\dfrac{ck-b}{dk+p}\\right]^{sk},   ')
    const [texExpression0,setTextExpression0] = useState('a_x')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{n\\to\\infty}\\sqrt[n]{a_n}=l')

    useEffect(() => {
      katex.render(`\\sum\\limits_{k=1}^{\\infty}\\left[\\dfrac{${c}k-${c-2}}{${c+1}k+${c-1}}\\right]^{${s}k}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,c,s]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
      katex.render(`a_{${x}}    `, container0Ref.current); 
    }, [texExpression0,x]); 

    useEffect(() => {
      katex.render(texExpression1, container1Ref.current) 
    }, [texExpression1]);

    const saveCalc = async (c,s, x, stXterm, xTerm, stL, l,  stAns, ans, subst, stSubst, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'caushy2mycalc'), {
        //const docRef = await addDoc(collection(db, 'caushy2calc38'), { 
        //const docRef = await addDoc(collection(db, '00_caushy_2'), { //thepeng
       // const docRef = await addDoc(collection(db, '01_caushy_2'), { 
        const docRef = await addDoc(collection(db, 'caushy2test'), { 
    
          z: 'sum [(ck-(c-2))/((c+1)k+(c-1))]^[sk],    k>=1',
          zz: 'variants N=4+4*i, caushy_2',
          TASKNUMBER: taskNumber,
         C_k_s: [c, x, s],

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
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  
    React.useEffect(() => {
      if ((stSubst!='undef')&(stAns!='undef')){
        saveCalc(c, s, x, stXterm, xTerm, stL, l, stAns, ans, stSubst, subst, taskNumber)
      }
    }, [stSubst,stAns])
//}, [c,x, stXterm, stL, stAns, stSubst])

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
        setS(myrandom(2,3));
        setC(myrandom(3,maxc));
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

   // xTerm=((c*x-(c-1))/((c+1)*x-c))**(2*x+3); // 
   
    xTerm=((c*x-(c-2))/((c+1)*x+(c-1)))**(s*x); // 
    l=(c/(c+1))**s;
    ans="сходится";
    subst="Коши";

const handleSubmitSerieCaushy_2 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
   
    if (Math.abs(xTerm-stXterm)<eps) { 
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
    console.log("c=",c);
    console.log("x=",x);

    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("l=",l, "stL=",stL);
    console.log("ans=",stAns, "stAns=", stAns);
    console.log("subst=",subst, "stSubst=", stSubst);

  }
return (
  
    <div>
         
  <form onSubmit={handleSubmitSerieCaushy_2}>
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
      
      <label>  </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputXterm} /> {" "}
          </Col>
        </Row> 

        <h4> 3.2 Введите значение предела  <myh ref={container1Ref} />: </h4>
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
        <option value="Коши"> по признаку Коши   </option>
        {/* <option value="Коши белгісі"> Коши белгісі бойынша </option> */}
        {/*  <option value="жинақтылық критерийі"> по критерию  сходимости </option>
         <option value="жинақтылық критерийі"> жинақтылық критерийі  бойынша </option> */}
        <option value="по признаку Лейбница"> по признаку Лейбница </option>
        {/* <option value="Лейбниц белгісі"> Лейбниц белгісі бойынша </option> */}
      </select>
          </Col>
        </Row> 

        </Container>

 
        <StyledButton  type='submit' disabled={disabled} > сохранить </StyledButton>
  </form>
  </div>
)
}

export default Caushy_2