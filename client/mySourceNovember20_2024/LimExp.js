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
  width: 200px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`

function LimExp({scoreC, setScoreC, totalScoreC,setTotalScoreC, stScore, setStScore, mssg, setMessage,  taskStatus, setStatus, taskNumber, setTaskNumber}) {
    //const eps = 0.001;
    const  eps = 0.001, qnum=5;
    var scoreC=Array(qnum).fill(0);
    var  g, g1, g2, g3, indef, k, t,m,a;
    var max=5;
   
    //const [stAns, setstAns] = useState([]);
    const [stIndef, setstIndef] = useState([]);
    //const [letsave, setLetsave] = useState([]);

    //const [a, setA] = useState([]);
    const [b, setB] = useState([]);
    //const [c, setC] = useState([]);
    //const [d, setD] = useState([]);
    const [p, setP] = useState([]);
    //const [q, setQ] = useState([]);
    const [s, setS] = useState([]);
    //const [i, setI] = useState([]);
    //const [h, setH] = useState([]);

    const [n, setN] = useState([]);
    //const [k, setK] = useState([]);

    //const [saveit, setSave] = useState(0);
    const [stG1, setStG1] = useState(["undef"]);
    const [stG, setG] = useState(["undef"]);
    const [stG2, setStG2] = useState(["undef"]);
    const [stG3, setStG3] = useState(["undef"]);

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const container3Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{x+{a}}{x+p}x^{{b}x+{k}} ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
   const [texExpression3,setTextExpression3] = useState('A. ~ (\\dfrac{\\infty}{\\infty})~~~~~~~ B.~     (\\dfrac{0}{0})~~~~~~~ C.~     (1^{\\infty})~~~~~~~ D.~     ({\\infty}^0)')
   const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{b}x^{{z}}}{x^{{m}}} ')
   const [texExpression2,setTextExpression2] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}}{px^{{m}}} ')

    useEffect(() => {
       katex.render(`\\lim\\limits_{x \\to \\infty}\\left(\\dfrac{x+${a}}{x+${p}}\\right)^{${b}x+${k}}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,a,p,b,k]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya
    //}, [texExpression,a,n,b,k,d, p,m,q,i,s,c]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya


    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{-${k}}{x+${p}}\\right)^{\\dfrac{x+${p}}{-${k}}}   `, container0Ref.current);
    }, [texExpression0,k,p]); 

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{1}{x+${p}}\\right)^{{${s}}({x+${p}})}    `, container1Ref.current);
    }, [texExpression1,p,s]); 

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{${s}}{x+${p}}\\right)^{({x+${p}})}    `, container2Ref.current);
    }, [texExpression2,p,s]); 

    useEffect(() => {
      katex.render(texExpression3, container3Ref.current) 
  }, [texExpression3]);

   
    const saveData = async (b,  p, c, d, s, taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'ncssr1mydata'), {
        //const docRef = await addDoc(collection(db, 'ncssr1data38'), {
        const docRef = await addDoc(collection(db, '11ncssr1data'), { //thepeng
        z: 'sum (b+pk^2)/[ck^2+dk],    k>=1',
        zz: 'variants N=1+4*i',
          TaskNumber: taskNumber,   
          b: b, 
          p: p,
          c: c,
          d: d,  
          k: s
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

/*
    React.useEffect(() => {
      if ((stSubst!==0)&(stAns!==0)){
        saveData(b,  p, c, d, s, taskNumber)
        saveCalc(stXterm, xTerm, stLima, a,  stSubst, ans, subst, stAns, taskNumber)
      }
}, [stSubst,stAns])*/
//}, [b,c,p,d,x, stXterm,stLima, stSubst, stAns])


    const saveCalc = async (stXterm, xTerm, stLima, a, stIndef,  ans, subst, stAns, taskNumber) => {
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
          stIndef: stIndef, 
          subst: subst
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    const onInputIndef = (event) => {
      setstIndef(event.target.value)
    }

    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }

    const maxc=8;
    //const maxp=15;
    const maxn=10;
    //const maxk=20;
    useEffect(() => {
        setN(myrandom(0,maxn));
        setB(myrandom(2,maxc));
        //setD(myrandom(2,maxc));
        //setQ(myrandom(2,maxc));
        setS(myrandom(2,3));
        setP(myrandom(1,maxc+1));
        //setC(myrandom(1,maxc));
        //setK(myrandom(1,maxk));
        //setA(myrandom(1,maxc));
        //setI(myrandom(1,maxk));
        //setH(myrandom(2,6));
    }, [])


    a=p+3;
    k=2*n+1;

    while(b===k)
      k=k+2;


    const onInputG1 = (event) => {
      var stg1 = (event.target.value);
      if (stg1!=="e") stg1 = Number(event.target.value)
      setStG1(stg1);
    }

    const onInputG2 = (event) => {
      var stg2 = (event.target.value);
      if (stg2!=="infty") stg2 = Number(event.target.value)
      setStG2(stg2);
    }

    const onInputG3 = (event) => {
      var stg3 = (event.target.value);
      if (stg3!=="infty") stg3 = Number(event.target.value)
      setStG3(stg3);
    }

    const onInputG = (event) => {
      setG(event.target.value);
    }
    
    const [disabled, setDisabled] = useState(false);

  
    g=Math.exp(b*(a-p));

    indef="1^infty";
    g1=2.71828;
    g2=Math.exp(s);
    g3=g2;

    const handleSubmitSeriesNcssr_1 = (event) => {
    setDisabled(!disabled);
    event.preventDefault();
    
    if (stIndef===indef){
      scoreC[0]=max/qnum;
    }

    if (Math.abs(g-stG)<eps) { 
      scoreC[1]=scoreC[1]+max/qnum;
    }

    if (stG1==="e")
      scoreC[2]=scoreC[2]+max/qnum;
    else if (Math.abs(g1-stG1)<eps) 
      scoreC[2]=scoreC[2]+max/qnum;

    

    if (Math.abs(g2-stG2)<eps) { 
      scoreC[3]=scoreC[3]+max/qnum;
    }
    
    if (Math.abs(g3-stG3)<eps) { 
      scoreC[4]=scoreC[4]+max/qnum;
    }
    
    for (let i = 0; i < qnum; i++){
      totalScoreC=totalScoreC+scoreC[i];
    }
    
    setScoreC(scoreC)
    setTotalScoreC(totalScoreC);
    
    //substatus="solved1";
    //setSubstatus(substatus);

    console.log("here is newRun");
   // console.log("substatus=",substatus);
    console.log("mssg=",mssg);
    console.log("b=",b, "p=",p);
   // console.log("c=",c, "d=",d);

    console.log("indef=",indef, "stIndef=", stIndef);
    console.log("g=",g, "stG=",stG);
    console.log("g=",g1, "stG=",stG1);
    console.log("g=",g2, "stG=",stG2);
    console.log("g=",g3, "stG=",stG3);

    //stScore=totalScoreC;
    
    //setScoreC(scoreC)
    setTotalScoreC(totalScoreC);
    
    stScore=stScore+totalScoreC;
    setStScore(stScore);

    mssg="3done"
    setMessage(mssg)
    taskStatus="done"
    setStatus(taskStatus)

  }
return (
    <div>
      <Container>
      <h3> Задача-3 </h3> 
      </Container>
      
  <form onSubmit={handleSubmitSeriesNcssr_1}>

  <Container1> <h4> Вычислите предел </h4></Container1>

  <Container0>  
      <myh ref={containerRef}  />
    </Container0> 

         <Container>
         <h4> 1. Укажите вид неопределенности: </h4>
         <h4>   <myh ref={container3Ref} />         </h4>

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputIndef} disabled={disabled} required > 
            <option value="" disabled selected >выберите </option>
        <option value="infty/infty"> A </option>
        <option value="zero/zero"> B </option>
        <option value="1^infty"> C </option>
        <option value="infty^0"> D </option>
      </select>
          </Col>
        </Row> 
        </Container>

        <Container> 

       <h4>  2.  Введите значение данного выше предела: </h4>
        
      <Row gutter={20}>
      <label>  g: </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputG} /> {" "}
          </Col>
        </Row> 
        


      <h4> 3.  Введите значение  <myh ref={container0Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g1: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG1} /> {" "}
          </Col>
        </Row> 

        <h4> 4.  Введите значение  <myh ref={container1Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g2: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG2} /> {" "}
          </Col>
        </Row> 

        <h4> 5.  Введите значение  <myh ref={container2Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g3: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG3} /> {" "}
          </Col>
        </Row> 

        </Container>

        <StyledButton  type='submit' disabled={disabled} > сохранить </StyledButton>

  </form>
  </div>
)
}

export default LimExp
