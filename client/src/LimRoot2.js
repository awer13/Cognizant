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
  //margin-top: -40px;
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

function LimRoot2({scoreB, setScoreB, totalScoreB,setTotalScoreB, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  eps = 0.001, qnum=5;
    var scoreB=Array(qnum).fill(0);
    //var  xTerm, sum, ans, subst;
    var max2=4, a, indef;
    var max=5, g, g1, g2, g3;
    
    const [stIndef, setstIndef] = useState(["noinput"]);
    const [stIndef2, setstIndef2] = useState(["noinput"]);
    const [stIndef3, setstIndef3] = useState(["noinput"]);
    const [stIndef4, setstIndef4] = useState(["noinput"]);
    const [stIndef5, setstIndef5] = useState(["noinput"]);

    const [stG, setG] = useState(["noinput"]);
    const [stG1, setStG1] = useState(["noinput"]);
    const [stG2, setStG2] = useState(["noinput"]);
    const [stG3, setStG3] = useState(["noinput"]);

    //const [b, setB] = useState([]);
    const [h, setH] = useState([]);
    const [q, setQ] = useState(["undef"]);
    //const [stXterm, setXterm] = useState(["undef"]);

    var d,k,b,s;
   // const [a, setA] = useState([]);
   const [stAns, setstAns] = useState("notyet");
    const [n, setN] = useState([]);
    const [c, setC] = useState([]);
    //const [d, setD] = useState([]);
    const [p, setP] = useState([]);
    const [i, setI] = useState([]);
    
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);
    const container2Ref = useRef(null);
    const container5Ref = useRef(null);
    const container6Ref = useRef(null);
    
    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\sqrt{{a}x^{{n}}+{b}x+ {c}}-\\sqrt{{d}x^{{n}}+ {k}x+{p}},   ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}}{\\sqrt{{a}x^{{n}}+{p}}}')
    const [texExpression1,setTextExpression1] = useState('a. ~ (\\dfrac{\\infty}{\\infty})~~~~~~~ b.~     (\\dfrac{0}{0})~~~~~~~ c.~     (0\\cdot \\infty)~~~~~~~ d.~     (\\infty - \\infty)')
    const [texExpression2,setTextExpression2] = useState('a. ~ ({\\infty})~~~~~~~ b.~     (+{\\infty})~~~~~~~ c.~     (-{\\infty})')
    const [texExpression5,setTextExpression5] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x+{c}}{\\sqrt{{a}x^{2}+{p}x}}')
    const [texExpression6,setTextExpression6] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x+{c}}{\\sqrt{{a}x^{s}+{p}x}}')
    

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

const saveData = async (a, d, b, k, p, s, stIndef, stG, stIndef2, stG1, stIndef3, stG2, stIndef4, stG3, stIndef5, taskNumber, stAns) => {
      try {
        const docRef = await addDoc(collection(db, '1_root2'), { 
        z: '\lim_{n\to\infty}[\sqrt{an^2+bn+c}-\sqrt{dn^2+kn+p}],  a=d',
        zz: ' g=(b-k)/[2sqrt{a}]   infty   sqrt(a)   0',
          TaskNumber: taskNumber,
          a_d_b_k: [a, d, b, k], 
          p_s: [p, s],   
          stIndef: stIndef, 
          stG: stG, 
          stIndefG: stIndef2,
          stG1: stG1, 
          stIndefG1: stIndef3,
          stG2: stG2,
          stG3: stG3,  
          stIndefG2: stIndef4, 
          stIndefG3: stIndef5,
          stAns: stAns,
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

  
    React.useEffect(() => {
      //if ((stG3!=="noinput")||(stIndef5!=="noinput") ){  
      if ((stAns!=="notyet")){    
      saveData(a, d, b, k, p, s, stIndef, stG, stIndef2, stG1, stIndef3, stG2, stIndef4, stG3, stIndef5, taskNumber, stAns)
      }
    }, [stAns])


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
     const maxk=4;
     useEffect(() => {
        //setS(myrandom(2,maxc));
        setQ(myrandom(2,maxc));
         //setB(myrandom(14,42));
         setP(myrandom(1,maxp));
         setC(myrandom(1,maxc));
         setN(myrandom(2,maxn));
         setH(myrandom(2,maxk));
         setI(myrandom(10,20));
     }, [])

     d=Math.pow(Math.trunc(Math.sqrt(q))+1,2);
     
     s=2*h;

     a=d;
     k=2*p;
     b=k+i;
    

     console.log("d=",d, "a=",a, "s=",s);
     console.log("p=",p, "k=",k, "b=",b);
     console.log("s=",s);

    
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

    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const [disabled, setDisabled] = useState(false);

    indef="infty-infty";
    g=(b-k)/(2*Math.sqrt(a));

    console.log("b=",b, "k=",k, "g=",g);

   g1="infty";
    //g1="b";
    g2=Math.sqrt(a);
    g3=0;

const handleSubmitSerieSum_1 = (event) => {
    let count = 0;
    setDisabled(!disabled);
    event.preventDefault();
    
    console.log("stIndef=",stIndef, "indef=",indef);
    
    if (stIndef===indef){
        scoreB[0]=max/qnum;
        console.log("scoreB0=",scoreB[0]);
      }

      console.log("scoreB0=",scoreB[0]);


    if (Math.abs(g-stG)<eps) { 
        scoreB[1]=scoreB[1]+max/qnum;
    }

    if (stIndef3===g1) { 
      scoreB[2]=scoreB[2]+max/qnum; // g1="infty";
    }

    if (Math.abs(g2-stG2)<eps) { 
        scoreB[3]=scoreB[3]+max/qnum; //  g2=Math.sqrt(a);
    }
    
    if (Math.abs(g3-stG3)<eps) { 
        scoreB[4]=scoreB[4]+max/qnum;
    }
    
    setScoreB(scoreB)

    for (let i = 0; i < qnum; i++){
      totalScoreB=totalScoreB+scoreB[i];
    }
      
    setTotalScoreB(totalScoreB);
  
    stScore=stScore+totalScoreB;
    setStScore(stScore)

    console.log("totalScoreB=",totalScoreB);
    console.log("stScore=",stScore);

    mssg="2done"
    setMessage(mssg)

    console.log("here is newRun");
    console.log("b=",b);
    
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

<Container0>  
    <myh ref={containerRef}  />
  </Container0> 

       <Container>
       <h4> 2.1 Укажите вид неопределенности для задачи 2: </h4>

         <Container> 
           <label>   </label>  <myh   ref={container1Ref}  />
           </Container>

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputIndef} disabled={disabled}  > 
              
          {/*  <select onChange={onInputIndef} disabled={disabled} required >  */}

            <option value="" disabled selected >выберите </option>
        <option value="infty/infty"> a </option>
        <option value="zero/zero"> b </option>
        <option value="zeroinfty"> c </option>
        <option value="infty-infty"> d </option>
      </select>
          </Col>
        </Row> 
      </Container>

      <Container0> 
        <h4> Далее  в ответах на вопросы 2.2-2.5 при необходимости ввода символов бесконечностей выберите из раскрывающегося списка  буквы, соответствующие следующим обозначениям   </h4> 
        <label>   </label>  <myh   ref={container2Ref}  />
        </Container0> 

      <Container> 

      <h4>  2.2  Выберите либо введите значение предела для задачи 2: </h4>


<Row gutter={20}>
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef2} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
      <option value="infty"> a </option>
      <option value="+infty"> b </option>
      <option value="-infty"> c </option>
    </select>
        </Col>   
        <Col span={3}>
        <label> либо введите </label> 
        </Col>  

        <Col span={4}>
     <Input  type="Number" onChange={onInputG}  /> {" "}
   </Col>
      </Row> 


<h4> 2.3   Выберите либо введите значение предела <myh ref={container0Ref} /> : </h4>

<Row gutter={20}>
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef3} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
          <option value="infty"> a </option>
      <option value="+infty"> b </option>
      <option value="-infty"> c </option>
    </select>
        </Col>   
        <Col span={3}>
        <label> либо введите </label> 
        </Col>  

        <Col span={4}>
     <Input  type="Number" onChange={onInputG1}  /> {" "}
   </Col>
      </Row> 
 <h4> 2.4   Выберите либо введите значение предела <myh ref={container5Ref} /> : </h4>

 <Row gutter={20}>
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef4} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
          <option value="infty"> a </option>
      <option value="+infty"> b </option>
      <option value="-infty"> c </option>
    </select>
        </Col>   
        <Col span={3}>
        <label> либо введите </label> 
        </Col>  

        <Col span={4}>
     <Input  type="Number" onChange={onInputG2}  /> {" "}
   </Col>
      </Row> 

 <h4> 2.5   Выберите либо введите значение предела <myh ref={container6Ref} /> : </h4>

 <Row gutter={20}>
     
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef5} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
          <option value="infty"> a </option>
      <option value="+infty"> b </option>
      <option value="-infty"> c </option>
    </select>
        </Col>   
        <Col span={3}>
        <label> либо введите </label> 
        </Col>  

        <Col span={4}>
     <Input  type="Number" onChange={onInputG3}  /> {" "}
   </Col>

      </Row> 

      <Container1><h4> Подтвердите отправку введенных ответов по задаче 2: </h4> </Container1>
        
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

 
        <StyledButton  type='submit' disabled={disabled} > перейти к следующей задаче  </StyledButton>
  </form>
  </div>
)
}

export default LimRoot2