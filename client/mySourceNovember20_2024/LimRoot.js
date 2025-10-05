import React, {useState, useRef, useEffect} from "react";
import styled from 'styled-components'
import {Input, Row, Col} from 'antd';
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import katex from "katex";
import "katex/dist/katex.min.css";

//  ({b}/5)ᵏ,    k>=0,    setB(myrandom(-4,4));   b - nonzero

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
/*
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
*/

function LimRoot({scoreB, setScoreB, totalScoreB,setTotalScoreB, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  eps = 0.001, qnum=5;
    var scoreB=Array(qnum).fill(0);

    //var scoreB=Array(q).fill(0);
    var  xTerm, sum, ans, subst;
    var max2=4, a, indef,s;
    var max=5, g, g1, g2, g3;
    
    const [stIndef, setstIndef] = useState(["noinput"]);
    const [stIndef2, setstIndef2] = useState(["noinput"]);
    const [stIndef3, setstIndef3] = useState(["noinput"]);
    const [stIndef4, setstIndef4] = useState(["noinput"]);
    const [stIndef5, setstIndef5] = useState(["noinput"]);

    const [stG, setG] = useState(["undef"]);
    const [stG1, setStG1] = useState(["undef"]);
    const [stG2, setStG2] = useState(["undef"]);
    const [stG3, setStG3] = useState(["undef"]);

    const [b, setB] = useState([]);
    const [x, setX] = useState([]);
    //const [stS, setStS] = useState(["undef"]);
    const [stXterm, setXterm] = useState(["undef"]);

   // const [a, setA] = useState([]);
    const [n, setN] = useState([]);
    const [c, setC] = useState([]);
    const [d, setD] = useState([]);
    const [p, setP] = useState([]);
    const [k, setK] = useState([]);
    
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const container3Ref = useRef(null);
    const container4Ref = useRef(null);
    const container5Ref = useRef(null);
    const container6Ref = useRef(null);
    const container7Ref = useRef(null);
    
    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\sqrt{{a}x^{{n}}+{b}x+ {c}}-\\sqrt{{d}x^{{n}}+ {k}x+{p}},   ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}}{\\sqrt{{a}x^{{n}}+{p}}}')
    const [texExpression1,setTextExpression1] = useState('A. ~ (\\dfrac{\\infty}{\\infty})~~~~~~~ B.~     (\\dfrac{0}{0})~~~~~~~ C.~     (0\\cdot \\infty)~~~~~~~ D.~     (\\infty - \\infty)')
    const [texExpression2,setTextExpression2] = useState('A. ~ ({\\infty})~~~~~~~ B.~     (+{\\infty})~~~~~~~ C.~     (-{\\infty})')
    const [texExpression3,setTextExpression3] = useState('A. ~ ({\\infty})~~~~~~~ B.~     (+{\\infty})~~~~~~~ C.~     (-{\\infty})')
    const [texExpression4,setTextExpression4] = useState('A. ~ ({\\infty})~~~~~~~ B.~     (+{\\infty})~~~~~~~ C.~     (-{\\infty})')
    const [texExpression5,setTextExpression5] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x+{c}}{\\sqrt{{a}x^{2}+{p}x}}')
    const [texExpression6,setTextExpression6] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x+{c}}{\\sqrt{{a}x^{s}+{p}x}}')
    const [texExpression7,setTextExpression7] = useState('A. ~ ({\\infty})~~~~~~~ B.~     (+{\\infty})~~~~~~~ C.~     (-{\\infty})')

    useEffect(() => {
        katex.render(`\\lim\\limits_{x \\to \\infty}\\sqrt{${a}x^{${n}}+${b}x+ ${c}}-\\sqrt{${d}x^{${n}}+ ${k}x+${p}}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,a,n,b,c,d,k,p]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya

    useEffect(() => {
        katex.render(` \\lim\\limits_{x \\to \\infty}\\dfrac{${a}x^{${n}}}{\\sqrt{${a}x^{${n}}+${p}}}   `, container0Ref.current);
    }, [texExpression0,a,n,p]); 

    useEffect(() => {
        katex.render(` \\lim\\limits_{x \\to \\infty}\\dfrac{${a}x+${c}}{\\sqrt{${a}x^{2}+${p}x}}   `, container5Ref.current);
    }, [texExpression5,a,c,n,p]); 

    useEffect(() => {
        katex.render(` \\lim\\limits_{x \\to \\infty}\\dfrac{${a}x+${c}}{\\sqrt{${a}x^${s}+${p}x}}   `, container6Ref.current);
    }, [texExpression6,a,c,s,p]); 

    useEffect(() => {
        katex.render(texExpression1, container1Ref.current) 
      }, [texExpression1]);

      useEffect(() => {
        katex.render(texExpression2, container2Ref.current) 
      }, [texExpression2]);

    useEffect(() => {
        katex.render(texExpression3, container3Ref.current) 
    }, [texExpression3]);

    useEffect(() => {
        katex.render(texExpression4, container4Ref.current) 
    }, [texExpression4]);

    useEffect(() => {
        katex.render(texExpression7, container7Ref.current) 
    }, [texExpression7]);

/*
    const saveData = async (b, x, taskNumber) => {
      try {
        const docRef = await addDoc(collection(db, 'sum1mydata'), {
        //const docRef = await addDoc(collection(db, 'cubic0data'), {nuclear eng
        //const docRef = await addDoc(collection(db, 'sum1stdata'), { //thepeng
          z: "ax³ + by³ - cxy+p      for variants N=1+4*i",
          taskNumber: taskNumber,
          b: b, 
          termIndex: x
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  */
/* this works, enable it
    const saveCalc = async (b, x, stXterm, xTerm, stS, sum,  stAns, ans, stSubst, subst,  taskNumber) => {
      try {
        //const docRef = await addDoc(collection(db, 'sum1mycalc'), {
        //const docRef = await addDoc(collection(db, 'sum138'), { 
        const docRef = await addDoc(collection(db, '11sum1'), { //thepeng
        z: 'sum (b/5)^k,    k>=0',
        zz: 'variants N=1+4*i',
          TaskNumber: taskNumber,
          B: b,
          K: x,   
          _: '____________________________',
          stXterm: stXterm,
          xTerm: xTerm,
          stS: stS, 
          sum: sum, 
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
    this works, enable it */


   /* React.useEffect(() => {
      saveCalc(b, x, stXterm, xTerm, stS, sum,  stAns, ans, subst, stSubst, taskNumber)
    }, [mssg])*/
  
/* this works, enable it
    React.useEffect(() => {
      if ((stSubst!=='undef')&(stAns!=='undef')){
        saveCalc(b,x,stXterm, xTerm, stS, sum, stAns,  ans, stSubst, subst,  taskNumber)
      }
    }, [stSubst,stAns])

    this works, enable it */

//}, [b,x, stXterm,stS, stSubst, stAns])

    const onInputIndef = (event) => {
        setstIndef(event.target.value)
      }

    const onInputIndef2 = (event) => {
        setstIndef2(event.target.value)
    }

    const onInputIndef3 = (event) => {
        setstIndef3(event.target.value)
    }

    const onInputIndef4 = (event) => {
        setstIndef4(event.target.value)
    }

    const onInputIndef5 = (event) => {
        setstIndef5(event.target.value)
    }

    const myrandom = (min,maxi) => {
       var v=(Math.trunc(Math.random()*(maxi-min+1))+min);
       while (v===0) {
        v=v+(Math.trunc(Math.random()*(maxi-min+1))+min);;
       }
       return v;
    }
 
     const maxc=25;
     const maxp=15;
     const maxn=8;
     const maxk=5;
     useEffect(() => {
        setD(myrandom(2,maxc));
        setN(myrandom(2,maxn));
         setB(myrandom(2,maxc));
         setP(myrandom(1,maxp));
         setC(myrandom(1,maxc));
         setK(myrandom(2,maxk));
     }, [])

     a=Math.pow(Math.trunc(Math.sqrt(d))+1,2);
     s=2*(k-1);
     console.log("d=",d, "a=",a, "s=",s);

    //const maxc=4;
    useEffect(() => {
        setB(myrandom(-4,maxc));
        setX(myrandom(3,10));
    }, [])

    
    const onInputG = (event) => {
        setG(event.target.value);
    }

    const onInputG1 = (event) => {
        //var stg1 = (event.target.value);
        //stg1 = Number(event.target.value)
        //setStG1(stg1);
        setStG1(event.target.value);
    }

    const onInputG2 = (event) => {
        //var stg2 = (event.target.value);
        //stg2 = Number(event.target.value)
        setStG2(event.target.value);
    }

    const onInputG3 = (event) => {
        //var stg3 = (event.target.value);
        //stg3 = Number(event.target.value)
        //setStG2(stg3);
        setStG3(event.target.value);
    }

    const [disabled, setDisabled] = useState(false);

    indef="infty-infty";
    g="+infty";
    g1="+infty";
    g2=Math.sqrt(a);
    g3=0;

const handleSubmitSerieSum_1 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
    if (stIndef===indef){
        scoreB[0]=max/qnum;
      }

    if (stIndef2===g) { 
      scoreB[1]=scoreB[1]+max/qnum;
    }

    if (stIndef3===g1) { 
      scoreB[2]=scoreB[2]+max/qnum;
    }

    if (Math.abs(g2-stG2)<eps) { 
        scoreB[3]=scoreB[3]+max/qnum;
    }
    
    if (Math.abs(g3-stG3)<eps) { 
        scoreB[4]=scoreB[4]+max/qnum;
    }
    
    for (let i = 0; i < qnum; i++){
      totalScoreB=totalScoreB+scoreB[i];
    }
    
    
    setScoreB(scoreB)

    setTotalScoreB(totalScoreB);
    
    
    stScore=stScore+totalScoreB;
    

    setStScore(stScore)
    console.log("totalScoreB=",totalScoreB);
    console.log("stScore=",stScore);

    mssg="2done"
    setMessage(mssg)

    console.log("here is newRun");
    console.log("b=",b);
    console.log("x=",x);

    console.log("xTerm=",xTerm, "stXterm=",stXterm);
    console.log("g=",g, "stIndef2=",stIndef2, "stG=",stG);
    console.log("g1=",g1, "stIndef3=",stIndef3, "stG1=",stG1);
    console.log("g2=",g2, "stIndef4=",stIndef4, "stG2=",stG2);
    console.log("g3=",g3, "stIndef5=",stIndef5, "stG3=",stG3);

  }
return (
  
    <div>
         
  <form onSubmit={handleSubmitSerieSum_1}>
  <Container>
  <h3> Задача-2 </h3> 
      </Container>

    {/*}
      <Container0>  
      <myh ref={containerRef} />
    </Container0> 
    */}

    <Container1> <h4> Вычислите предел и ответьте на вопросы ниже</h4></Container1>

<Container0>  
    <myh ref={containerRef}  />
  </Container0> 

       <Container>
       <h4> 1. Укажите вид неопределенности: </h4>
        
       <h4>   <myh ref={container1Ref} />         </h4>
      
      <Row gutter={20}>
      <label>   </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputIndef} disabled={disabled} required > 
          <option value="" disabled selected >выберите </option>
      <option value="infty/infty"> A </option>
      <option value="zero/zero"> B </option>
      <option value="zeroinfty  "> C </option>
      <option value="infty-infty"> D </option>
    </select>
        </Col>
      </Row> 
     
      </Container>

      <Container> 

<h4>  2.  Выберите либо введите значение данного выше предела: </h4>
<h4>   <myh ref={container2Ref} />         </h4>

<Row gutter={20}>
      <label> g:  </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputIndef2} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
      <option value="infty"> A </option>
      <option value="+infty"> B </option>
      <option value="-infty"> C </option>
    </select>
        </Col>   
      </Row> 
       
      <label> либо введите </label>
<Row gutter={20}>
<label>  g: </label>
   <Col span={4}>
     {" "}
     <Input  type="Number" onChange={onInputG}  /> {" "}
   </Col>
 </Row> 
 


<h4> 3.   Выберите либо введите значение  <myh ref={container0Ref} /> : </h4>

<h4>   <myh ref={container3Ref} />         </h4>

<Row gutter={20}>
      <label> g1:  </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputIndef3} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
      <option value="infty"> A </option>
      <option value="+infty"> B </option>
      <option value="-infty"> C </option>
    </select>
        </Col>   
      </Row> 
       
      <label> либо введите </label>
<Row gutter={20}>
<label>  g1: </label>
   <Col span={4}>
     {" "}
     <Input  type="Number" onChange={onInputG1}  /> {" "}
   </Col>
 </Row> 
 <h4> 4.   Выберите либо введите значение  <myh ref={container5Ref} /> : </h4>

<h4>   <myh ref={container4Ref} />         </h4>

<Row gutter={20}>
      <label> g2:  </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputIndef4} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
      <option value="infty"> A </option>
      <option value="+infty"> B </option>
      <option value="-infty"> C </option>
    </select>
        </Col>   
      </Row> 
       
      <label> либо введите </label>
<Row gutter={20}>
<label>  g2: </label>
   <Col span={4}>
     {" "}
     <Input  type="Number" onChange={onInputG2}  /> {" "}
   </Col>
 </Row> 

 <h4> 5.   Выберите либо введите значение  <myh ref={container6Ref} /> : </h4>

<h4>   <myh ref={container7Ref} />         </h4>

<Row gutter={20}>
      <label> g3:  </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputIndef5} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
      <option value="infty"> A </option>
      <option value="+infty"> B </option>
      <option value="-infty"> C </option>
    </select>
        </Col>   
      </Row> 
       
      <label> либо введите </label>
<Row gutter={20}>
<label>  g3: </label>
   <Col span={4}>
     {" "}
     <Input  type="Number" onChange={onInputG3}  /> {" "}
   </Col>
 </Row> 

        </Container>

 
        <StyledButton  type='submit' disabled={disabled} > келесі есепке өту </StyledButton>
  </form>
  </div>
)
}

export default LimRoot