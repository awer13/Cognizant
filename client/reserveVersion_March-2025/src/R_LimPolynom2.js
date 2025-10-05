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

//function ExtrCubic_0({scoreA, setScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
function LimPolynom2({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    //const eps = 0.001;
    const  eps = 0.001, qnum=5;
    var scoreA=Array(qnum).fill(0);
    var  g, g1, g2, g3, indef, z, t;
    var max=5,m;
   
    //const [stAns, setstAns] = useState([]);
    const [stIndef, setstIndef] = useState([]);
    const [stIndef2, setstIndef2] = useState(["noinput"]);
    const [stIndef3, setstIndef3] = useState(["noinput"]);
    const [stIndef4, setstIndef4] = useState(["noinput"]);
    const [stIndef5, setstIndef5] = useState(["noinput"]);
    //const [letsave, setLetsave] = useState([]);

    const [a, setA] = useState([]);
    const [b, setB] = useState([]);
    const [c, setC] = useState([]);
    const [d, setD] = useState([]);
    const [p, setP] = useState([]);
    const [q, setQ] = useState([]);
    const [s, setS] = useState([]);
    const [i, setI] = useState([]);
    const [h, setH] = useState([]);
   // const [m, setM] = useState([]);

    const [n, setN] = useState([]);
    const [k, setK] = useState([]);

    //const [saveit, setSave] = useState(0);
    const [stG1, setStG1] = useState(["undef"]);
    const [stG, setStG] = useState(["undef"]);
    const [stG2, setStG2] = useState(["undef"]);
    const [stG3, setStG3] = useState(["undef"]);

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const container3Ref = useRef(null);
    const container4Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}+{b}x^{{z}}+ {d}x}{{p}x^{{m}}+{q}x^{{t}}+{s}x+{c}} ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
   const [texExpression1,setTextExpression1] = useState('a. ~ (\\dfrac{\\infty}{\\infty})~~~~~~~ b.~     (\\dfrac{0}{0})~~~~~~~ c.~     (0\\cdot \\infty)~~~~~~~ d.~     (\\infty - \\infty)')
   const [texExpression2,setTextExpression2] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{b}x^{{z}}}{x^{{m}}} ')
   const [texExpression3,setTextExpression3] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}}{px^{{m}}} ')
   const [texExpression4,setTextExpression4] = useState('a. ~ ({\\infty})~~~~~~~ b.~     (+{\\infty})~~~~~~~ c.~     (-{\\infty})')
   
   useEffect(() => {
       katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${a}x^{${n}}+${b}x^{${z}}+ ${d}x+${c}}{${p}x^{${m}}+ ${q}x^{${t}}+${s}x}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,a,n,b,k,p,d,m,q,t,z,c,s]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya
    //}, [texExpression,a,n,b,k,d, p,m,q,i,s,c]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
      katex.render(texExpression1, container1Ref.current) 
    }, [texExpression1]);

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${d}}{x^{${m}}}   `, container0Ref.current);
    }, [texExpression0,d,m]); 

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${q}x^{${t}}}{x^{${m}}}    `, container2Ref.current);
    }, [texExpression2,q,t,m]); 

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${a}x^{${n}}}{${p}x^{${m}}}    `, container3Ref.current);
    }, [texExpression3,a,n,p,m]); 

    useEffect(() => {
      katex.render(texExpression4, container4Ref.current) 
    }, [texExpression4]);
   
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
      console.log("indef=",indef, "stIndef=", stIndef);
    }

    const onInputIndef5 = (event) => {
      setstIndef5(event.target.value)
    }

    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }

    const maxc=100;
    const maxp=15;
    const maxn=100;
    const maxk=5;
    useEffect(() => {
        setN(myrandom(4,maxn));
        //setM(myrandom(3,99));
        setB(myrandom(2,maxc));
        setD(myrandom(2,maxc));
        setQ(myrandom(2,maxc));
        setS(myrandom(2,maxc));

        setP(myrandom(16,maxc));
        setC(myrandom(1,maxc));
        setK(myrandom(1,98));
        
        setA(myrandom(2,maxp));

        setI(myrandom(1,96));
        setH(myrandom(5,15));
    }, [])

    m=n-1;
    if (n>=20)
      m=n-h;


    z=n-k;
    t=m-i;

    console.log("n=",n,  "k=", k, "n-k=", z);
    console.log("m=",m,  "i=", i, "m-i=", t);

  
    while (z<2){
     z++
    }
    
    while (t<2){
      t++
    }
   
    //m=n;
   
    console.log("n=",n,  "k=", k);
    console.log("z=",z);

    const onInputG = (event) => {
      var stg = (event.target.value);
      //if (stg!=="a") stg = Number(event.target.value)
      setStG(stg);
      console.log("stG=",stG);
    }

    const onInputG1 = (event) => {
      //var  stg1 = Number(event.target.value)
      var stg1 = (event.target.value);
      setStG1(stg1);
      console.log("stG1=",stG1);
    }

    const onInputG2 = (event) => {
      //var  stg2 = Number(event.target.value)
      var stg2 = (event.target.value);
      setStG2(stg2);
      console.log("stG2=",stG2);
    }

    const onInputG3 = (event) => {
      var stg3 = (event.target.value);
      //if (stg3!=="a") stg3 = Number(event.target.value)
      setStG3(stg3);
      console.log("stG3=",stG3);
    }

    const [disabled, setDisabled] = useState(false);

    if (n===m)
      g=a/p;
    else if (n>m)
      g="a"; // here a is infty
    else g=0;

    indef="infty/infty";
   
    g1=0;
    g2=0;
    g3="a";

    const handleSubmitSeriesNcssr_1 = (event) => {
    setDisabled(!disabled);
    event.preventDefault();
    
    if (stIndef===indef){
      scoreA[0]=max/qnum;
    }

    if (stG===g){
      scoreA[1]=max/qnum;
    }

    if (Math.abs(g1-stG1)<eps) { 
      scoreA[2]=scoreA[2]+max/qnum;
    }

    if (Math.abs(g2-stG2)<eps) { 
      scoreA[3]=scoreA[3]+max/qnum;
    }
    
    if (stG3===g3){
      scoreA[4]=max/qnum;
    }
    
    
    for (let i = 0; i < qnum; i++){
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

    console.log("indef=",indef, "stIndef=", stIndef);
    console.log("g=",g, "stG=",stG);
    console.log("g=",g1, "stG=",stG1);
    console.log("g=",g2, "stG=",stG2);
    console.log("g=",g3, "stG=",stG3);

    stScore=totalScoreA;
    setStScore(stScore);
    mssg="1done";
    setMessage(mssg);
  }
return (
    <div>
      <Container>
      <h3> Задача-1 </h3> 
      </Container>

  <form onSubmit={handleSubmitSeriesNcssr_1}>

  <Container0>  
      <myh ref={containerRef}  />
    </Container0> 
    <Container>
         <h4> 1.1 Укажите вид неопределенности: </h4>

         <Container> 
           <label>   </label>  <myh   ref={container1Ref}  />
           </Container>

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputIndef} disabled={disabled} required > 
            <option value="" disabled selected >выберите </option>
        <option value="infty/infty"> a </option>
        <option value="zero/zero"> b </option>
        <option value="zeroinfty  "> c </option>
        <option value="infty-infty "> d </option>
      </select>
          </Col>
        </Row> 
        </Container>

        <Container0> 
        <h4> Далее  в ответах на вопросы 1.2-1.5 при необходимости ввода символов бесконечностей 
          введите буквы (без точки и каких-либо других знаков), соответствующие следующим обозначениям   </h4> 
        <label>   </label>  <myh   ref={container4Ref}  />
        </Container0> 
  
        <Container> 
        <h4>  1.2  Введите значение предела для задачи 1: </h4>
  <Row gutter={20}>
  <label>   </label>
        <Col span={4}>
     <Input   onChange={onInputG}  /> {" "}
   </Col>
      </Row> 
       

      <h4> 1.3  Введите  значение предела  <myh ref={container0Ref} /> : </h4>
      <Row gutter={20}>
      <label>   </label>
        <Col span={4}>
     <Input  onChange={onInputG1}  /> {" "}
   </Col>
      </Row> 

        <h4> 1.4 Введите  значение предела  <myh ref={container2Ref} /> : </h4>
        <Row gutter={20}>
        <label>   </label>
        <Col span={4}>
     <Input   onChange={onInputG2}  /> {" "}
   </Col>
      </Row> 

        <h4> 1.5  Введите   значение предела <myh ref={container3Ref} /> : </h4>
        <Row gutter={20}>

        <label>   </label>
        <Col span={4}>
     <Input  onChange={onInputG3}  /> {" "}
   </Col>

      </Row> 

        </Container>

        <StyledButton  type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
  </form>
  </div>
)
}

export default LimPolynom2
