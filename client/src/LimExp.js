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

function LimExp({scoreC, setScoreC, totalScoreC,setTotalScoreC, stScore, setStScore, mssg, setMessage,  taskStatus, setStatus, taskNumber, setTaskNumber}) {
    const  eps = 0.01, qnum=5;
    var scoreC=Array(qnum).fill(0);
    var  g, g1, g2, g3, indef, k, a;
    var max=5,b;
   
    //const [stAns, setstAns] = useState([]);
    const [stIndef, setstIndef] = useState([]);
    //const [letsave, setLetsave] = useState([]);

    //const [a, setA] = useState([]);
    //const [b, setB] = useState([]);
    //const [c, setC] = useState([]);
    const [d, setD] = useState([]);
    const [p, setP] = useState([]);
    const [q, setQ] = useState([]);
    const [s, setS] = useState([]);
    //const [i, setI] = useState([]);
    const [h, setH] = useState([]);

    const [n, setN] = useState([]);
    //const [k, setK] = useState([]);

    const [stAns, setstAns] = useState("notyet");
    const [stG1, setStG1] = useState(["noinput"]);
    const [stG, setG] = useState(["noinput"]);
    const [stG2, setStG2] = useState(["noinput"]);
    const [stG3, setStG3] = useState(["noinput"]);

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const container1Ref = useRef(null);
    //const container2Ref = useRef(null);
    const container3Ref = useRef(null);
    const container4Ref = useRef(null);

    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{x+{a}}{x+p}x^{{b}x+{k}} ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
   const [texExpression3,setTextExpression3] = useState('A. ~ (\\dfrac{\\infty}{\\infty})~~~~~~~ B.~     (\\dfrac{0}{0})~~~~~~~ C.~     (1^{\\infty})~~~~~~~ D.~     ({\\infty}^0)')
   const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{b}x^{{z}}}{x^{{m}}} ')
   //const [texExpression2,setTextExpression2] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}}{px^{{m}}} ')
   const [texExpression4,setTextExpression4] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{x+{a}}{x+p} ')

    useEffect(() => {
       katex.render(`\\lim\\limits_{x \\to \\infty}\\left(\\dfrac{x+${a}}{x+${p}}\\right)^{${b}x+${k}}    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,a,p,b,k]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya
    //}, [texExpression,a,n,b,k,d, p,m,q,i,s,c]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya


    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{-${k}}{x+${q}}\\right)^{\\dfrac{x+${q}}{-${k}}}   `, container0Ref.current);
    }, [texExpression0,k,q]); 

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{1}{x-${h}}\\right)^{{${s}}({x-${h}})}    `, container1Ref.current);
    }, [texExpression1,h,s]); 

    {/*}
    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\left(1+\\dfrac{${d}}{x+${p}}\\right)^{({x+${p}})}    `, container2Ref.current);
    }, [texExpression2,p,d]); 
    */}

    useEffect(() => {
      katex.render(texExpression3, container3Ref.current) 
  }, [texExpression3]);

  useEffect(() => {
    katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{x+${a}}{x+${p}}   `, container4Ref.current); 
 }, [texExpression4,a,p,b,k]); 

   
 const saveData = async (a, p, b, s, stG1, stIndef, stG,  stG2, stG3, taskNumber, stAns) => {
  try {
    const docRef = await addDoc(collection(db, '1_exp1'), { //thepeng
    z: '\lim{x\to\infty}\Bigl[\frac{x+a}{x+p}\Bigr]^{bx+k}',
    zz: 'g1=1, g=e^{b(a-p)}, g2=e, g3=e^s',
      TaskNumber: taskNumber,   
      a_p_b: [a, p, b], 
      s: s,
      stG1: stG1, 
      stIndef: stIndef, 
      stG: stG, 
      stG2: stG2,
      stG3: stG3, 
      stAns: stAns,
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}


React.useEffect(() => {
  if ((stAns!=="notyet")){    
    saveData(a, p, b, s, stG1, stIndef, stG,  stG2, stG3, taskNumber, stAns)
  }
}, [stAns])


    const onInputIndef = (event) => {
      setstIndef(event.target.value)
    }

    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }

    const maxc=8;
    //const maxp=15;
    const maxn=10;
    const maxq=99;
    useEffect(() => {
        setN(myrandom(0,maxn));
        setD(myrandom(4,5));
        setQ(myrandom(2,maxq));
        setS(myrandom(2,5));
        setP(myrandom(1,4));
        setH(myrandom(2,maxq));
    }, [])

    b=2*p;
    a=p+(4/b);
    if (p===3){
      a=4;
    }
    k=2*n+1;

    console.log("p=",p, "b=",b, "a=",a);

    const onInputG1 = (event) => {
      var stg1 = (event.target.value);
      if (stg1!=="e") stg1 = Number(event.target.value)
      setStG1(stg1);
    }

    const onInputG2 = (event) => {
      var stg2 = (event.target.value);
      if (stg2!=="e") stg2 = Number(event.target.value)
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
    
    const onInputAns = (event) => {
      setstAns(event.target.value)
    }

    const [disabled, setDisabled] = useState(false);

  
    g=Math.exp(b*(a-p));

    g1=1;
    indef="1^infty";
    g2=2.71828;
    g3=Math.exp(s);

    const handleSubmitSeriesNcssr_1 = (event) => {
    setDisabled(!disabled);
    event.preventDefault();
    
    if (Math.abs(g1-stG1)<eps) { 
      scoreC[0]=scoreC[0]+max/qnum;
    }

    if (stIndef===indef){
      scoreC[1]=max/qnum;
    }

   
    if (Math.abs(g-stG)<eps) { 
      scoreC[2]=scoreC[2]+max/qnum;
    }

    if (stG2==="e")
      scoreC[3]=scoreC[3]+max/qnum;
    else if (Math.abs(g2-stG2)<eps) 
      scoreC[3]=scoreC[3]+max/qnum;

    
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
  
   // console.log("c=",c, "d=",d);

   console.log("qu1:   g1=",g1, "stG1=",stG1);

   console.log("qu2:   indef=",indef, "stIndef=", stIndef);
    console.log("qu3:   g=",g, "stG=",stG);
    
    console.log("qu4:   g2=",g2, "stG2=",stG2);
    console.log("qu5:    g3=",g3, "stG3=",stG3);

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
      <h3> Задача-3. </h3> 
      </Container>
      
  <form onSubmit={handleSubmitSeriesNcssr_1}>

  {/* <Container1> <h4> Вычислите предел </h4></Container1> */}

  <Container0>  
      <myh ref={containerRef}  />
    </Container0> 

         <Container>

         <h4> 3.1.  Введите значение предела <myh ref={container4Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g1: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG1} /> {" "}
          </Col>
        </Row> 

         <h4> 3.2. Укажите вид неопределенности в задаче 3: </h4>
         <h4>   <myh ref={container3Ref} />         </h4>

        <Row gutter={20}>
        <label>   </label>
          <Col span={2}>
            {" "}
            <select onChange={onInputIndef} disabled={disabled}  > 
              {/* <select onChange={onInputIndef} disabled={disabled} required > */}
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

       <h4>  3.3.  Введите значение предела для задачи 3: </h4>
        
      <Row gutter={20}>
      <label>  g: </label>
          <Col span={4}>
            {" "}
            <Input  type="Number" onChange={onInputG} /> {" "}
          </Col>
        </Row> 
        
       

      <h4> 3.4.  Введите значение предела <myh ref={container0Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g2: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG2} /> {" "}
          </Col>
        </Row> 

        <h4> 3.5.  Введите значение предела <myh ref={container1Ref} /> : </h4>
      <Row gutter={20}>
      <label>  g3: </label>
          <Col span={4}>
            {" "}
            <Input  type="text" onChange={onInputG3} /> {" "}
          </Col>
        </Row> 

        <Container1><h4> Подтвердите отправку введенных ответов по задаче 3: </h4> </Container1>
        
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

        <StyledButton  type='submit' disabled={disabled} > сохранить и завершить  </StyledButton>

  </form>
  </div>
)
}

export default LimExp
