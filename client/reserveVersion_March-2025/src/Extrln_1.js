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
const MatrixRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 180px;
  align-items: flex-start;
  padding: 5px;
  font-size: 15px;
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
function Extrln_1({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber, taskStatus, setStatus}) {
    const  eps = 0.001, qnum=10;
    var scoreA=Array(qnum).fill(0);
    var criP, diPn_ref, dpN, sPn_ref, spN, ind="none";
    
    //const discpoint=0;
    var  der1, c;
    var maxScore=15;
   
    const [stAns, setstAns] = useState("empty");
    //const [confirm, setConfirm] = useState([]);
    const [stIndef1, setstIndef1] = useState(["notchosen"]);
    const [stIndef2, setstIndef2] = useState(["notchosen"]);
    const [stDer1, setstDer1] = useState("empty");
    const [stSpN, setstSpN] = useState("m");
    const [stDipN, setDiPN] = useState('n');
  
    const [z, setZ] = useState([]);
    const [k, setK] = useState([]);
    
    const [stCripN, setCriPN] = useState([]);

    const [stDisP, setDiscpoint] = useState(["empty"]);
    const [stStPoint, setStStp] = useState(["empty"]);  
    const [stConclu1, setstConclu1] = useState(["empty"]);  
    const [stConclu2, setstConclu2] = useState(["empty"]);  

    const [stDer2di, setstDer2di] = useState([]); // stud's second derivative at discontinuity points
    const [stDer2st, setStDer2Stp] = useState([]); // stud's second derivative at stationary points
    

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const containerDiRef = useRef(null);
    const containerStRef = useRef(null);
    //const containerLDRef = useRef(null);

    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}+{b}x^{{b}}+ {d}x}{{p}x^{{m}}+{q}x^{{t}}+{s}x+{c}} ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    const [texExpressionSt,setTextExpressionSt] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    //const [texExpression2,setTextExpression2] = useState('y^{(2))}(s)')
    //const [texLabeld,setLabeld] = useState('d_1')
   
    console.log("Here is new run");
    c=2*Math.pow(k,2);
    console.log("k=",k, "k^2=",Math.pow(k,2), "c=",c);

    useEffect(() => {
      console.log('c=', c)
       katex.render(`y=x^2-${c}ln x    `, containerRef.current); //tut skobki drugie i ${tut variable}
    }, [texExpression,c]); // tut dobavil b, chtoby kogda b menyaetsya zapuskalas eta funkciya


    useEffect(() => {
      katex.render(`y'(${z})   `, container0Ref.current);
    }, [texExpression0,z]); 

    useEffect(() => {
      //if (stDipN===1)
        katex.render(`y''(0)  `, containerDiRef.current);
      //else
      //katex.render(`y''(d_i),   i=\\overline{1,${stDipN}}   `, containerDiRef.current);
    }, [texExpression1]);



useEffect(() => {
  if (stSpN===1)
    katex.render(`y''(s_1)  `, containerStRef.current);
  else
  katex.render(`y''(s_i),   i=\\overline{1,${stSpN}}   `, containerStRef.current);
}, [texExpressionSt, stSpN]);

   
    const saveData = async (c, z, stIndef1, stDer1, stCripN, stDipN, stSpN, stDisP, stIndef2, stDer2di, stStPoint, stDer2st, stConclu1, stConclu2, taskNumber, stAns) => {
      try {
        const docRef = await addDoc(collection(db, '00_extrLn'), { 
        z: 'y=x^2-cln x',
          TaskNumber: taskNumber,   
          c_z: [c, z], 
          q0_stDerZInf: stIndef1, 
          q0_stDer_z: stDer1,
          q1_stCriPointsNum: stCripN,
          q2_stDiscPointsNum: stDipN, 
          q3_stStPointsNum: stSpN, 
          q4_stDiscontinPoints: stDisP, 
          q5_stDer2DiscPoint: stIndef2,
          q5_stDer2DiscPointValue: stDer2di,
          q6_stStationaryPoints: stStPoint,
          q7_stDer2stPoints: stDer2st,
          q8_stConclu1: stConclu1,
          q9_stConclu2: stConclu2,
          stAns: stAns,
        })
        console.log('Document written with ID: ', docRef.id)
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    React.useEffect(() => {  
     if ((stAns!=="notyet")){  
      saveData(c, z, stIndef1, stDer1, stCripN, stDipN, stSpN, stDisP, stIndef2, stDer2di, stStPoint, stDer2st, stConclu1, stConclu2, taskNumber, stAns)
      }
}, [stStPoint])

const saveCalc = async (k, c,z, der1, stp_ref, taskNumber, stConclu2,stAns) => {
  try {
    const docRef = await addDoc(collection(db, '0_extrCalc'), { //thepeng
    z: 'y=x^2-cln x',
    za: "criPnum=3, diPnum=1, staPnum=2",
    zb: " DiscontinPoint=0, stIndef2=notexist, der2st=[4 4]",
    zc: " conclu1=stationary,   conclu2=min",
    TaskNumber: taskNumber,
    der1atz: der1,    
    stationaryPoints: stp_ref,
    c_k: [c, k], 
    point_z: z,
    zz: stAns,
    stConclu2: stConclu2,
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

React.useEffect(() => {
  saveCalc(k, c,z, der1, stp_ref, taskNumber,stConclu2, stAns)
}, [stConclu2])


const onInputIndef1 = (event) => {
  setstIndef1(event.target.value)
}
console.log('stIndef1=', stIndef1)

const onInputIndef2 = (event) => {
  setstIndef2(event.target.value)
}
console.log('stIndef2=', stIndef2)

const onInputder2dip = (event) => {
  setstDer2di(event.target.value);
}

const onInputConclusion_1 = (event) => {
  setstConclu1(event.target.value);
}

const onInputConclusion_2 = (event) => {
  setstConclu2(event.target.value);
}

console.log("stConclu2=",stConclu2);

const onInputderiv1 = (event) => {
      setstDer1(event.target.value)
    }
console.log('stDer1=', stDer1)

const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
}

    const maxk=8;
    useEffect(() => {
        setK(myrandom(1,maxk));
    }, [])

    useEffect(() => {
      setZ(myrandom(1,maxk)); // for f'(z)
  }, [])


  const onInputCriPN = (event) => { //number of critical points
    setCriPN(Number(event.target.value));
}
console.log('stCripN=', stCripN)

const onInputDisPN = (event) => { //number of discontinuity points
  setDiPN(Number(event.target.value));
  var ndip = Number(event.target.value);
  if (ndip>5) ndip=5;
  let dip = Array(ndip).fill(0);
  setDiscpoint(dip);  
} 
console.log('stDipN=', stDipN)

diPn_ref=1;
// diPn - correct value, dpN=stDipN if stDipN\neq empty
if (stDipN==='empty') {dpN=diPn_ref;}
else {dpN=stDipN;}

sPn_ref=2;
if (stSpN==='empty') {spN=sPn_ref;}
else {spN=stSpN;}

let stStp = Array(stSpN).fill(0);
let stp_ref = Array(sPn_ref);
let der2st = Array(stSpN).fill(0);
let der2st_ref = Array(stSpN).fill(0);

stp_ref[0]=Math.sqrt(c/2);
stp_ref[1]=-Math.sqrt(c/2);

const onInputAns = (event) => {
  setstAns(event.target.value)
}

const onInputstSpN = (event) => { //number of stationary points
  setstSpN(Number(event.target.value));
}
console.log('stSpN=', stSpN)

const [disabled, setDisabled] = useState(false);
der1=2*z-c/z;
   

const handleSubmit_1 = (event) => {
      let count = 0;
    setDisabled(!disabled);
    event.preventDefault();

    for (let i = 0; i < stDipN; i++) { 
     if ((event.target[count].value)==="")
      stDisP[i]="empty"
    else stDisP[i]=Number(event.target[count].value)
        count += 1;
    }
    console.log("stDisP=",stDisP);
    setDiscpoint(stDisP);

    count += 2;
    for (let i = 0; i < stSpN; i++) { 
      if ((event.target[count].value)==="")
        stStp[i]="empty"
     else stStp[i]=Number(event.target[count].value)
         count += 1;
         der2st_ref[i]=2+c/(Math.pow(stStp[i],2));
     }
     console.log("stStp=",stStp);
     setStStp(stStp)

     for (let i = 0; i < stSpN; i++) { 
      if ((event.target[count].value)==="")
        der2st[i]="empty"
     else der2st[i]=Number(event.target[count].value)
         count += 1;
     }
    setStDer2Stp(der2st)
    console.log("der2st=",der2st);
    
    //der1=2*z-c/z;
    if (Math.abs(der1-stDer1)<eps) { 
      scoreA[0]=scoreA[0]+maxScore/qnum;
    }  
    console.log("der1=",der1, "stDer1=", stDer1);

    criP=3;
    if (Math.abs(criP-stCripN)<eps) { 
      scoreA[1]=scoreA[1]+maxScore/qnum;
    }  
    
    //diPn=1;
    if (Math.abs(diPn_ref-stDipN)<eps) { 
      scoreA[2]=scoreA[2]+maxScore/qnum;
    }  
    
    //sPn=2;
    if (Math.abs(sPn_ref-stSpN)<eps) { 
      scoreA[3]=scoreA[3]+maxScore/qnum;
    } 

    let j = 0;
    console.log("stDipN=",stDipN);
    //DiscontinuityPoint=0;
    while(j<stDipN){
    console.log("j=",j);
    if ((stDisP[j]!="empty")&&(stDisP[j]===0)) { 
        scoreA[4]=scoreA[4]+maxScore/qnum;
        j=stDipN;
        ind=j;
      } else j++
    } 
  
    console.log("scoreA[4]=",scoreA[4]);
    //console.log("ind=",ind);

    if ((stIndef2!="empty")&&(stIndef2 ==="не существует")) { 
      scoreA[5]=scoreA[5]+maxScore/qnum;
    }
  
    console.log("stStp=", stStp);
      console.log("stp_ref=", stp_ref);

    if (stStp[0]===stStp[1]) {
      console.log("stud stationary points are equal");
      if (Math.abs(stStp[0]-stp_ref[0])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } else if (Math.abs(stStp[0]-stp_ref[1])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } 
      console.log("scoreA[6]=",scoreA[6]);
    } 
    else {
      if (Math.abs(stStp[0]-stp_ref[0])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } else if (Math.abs(stStp[0]-stp_ref[1])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } 
      if (Math.abs(stStp[1]-stp_ref[0])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } else if (Math.abs(stStp[1]-stp_ref[1])<eps) {
        scoreA[6]=scoreA[6]+maxScore/qnum;
      } 
      console.log("scoreA[6]=",scoreA[6]);
    } 

    console.log("der2st=", der2st);
    console.log("der2st_ref=", der2st_ref);

    if (Math.abs(der2st[0]-der2st_ref[0])<eps) {
      scoreA[7]=scoreA[7]+0.5*maxScore/qnum;
    }
    if (Math.abs(der2st[1]-der2st_ref[1])<eps) {
      scoreA[7]=scoreA[7]+0.5*maxScore/qnum;
    } 
    
    if ((stConclu1 ==="стационарной")) { 
      scoreA[8]=scoreA[8]+maxScore/qnum;
    }

    if ((stConclu2 ==="минимум")) { 
      scoreA[9]=scoreA[9]+maxScore/qnum;
    }

    for (let i = 0; i < qnum; i++){
      totalScoreA=totalScoreA+scoreA[i];
    }
    setScoreA(scoreA)
    setTotalScoreA(totalScoreA);
    stScore=totalScoreA;
    setStScore(stScore);
    //sms="1adone";
    //setSms(sms);
    console.log("mssg=", mssg); 
    taskStatus="done"
    setStatus(taskStatus)
    setstAns("saveit")

    mssg="1done";
    setMessage(mssg);
    console.log("mssg=", mssg); 
    console.log("stAns=", stAns); 
    console.log("stAns=", setstAns("saveit")); 
  }
return (
    <div>
      <Container>   <h3> Задача-1 </h3>  </Container>
      <Container0>  <myh ref={containerRef}  />  </Container0> 
      
  <Container>  
         <h4> 1.0 Выберите либо введите значение  <myh ref={container0Ref} />: </h4>
         <Row gutter={20}>
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef1} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
           <option value="не существует"> не существует </option>  </select>
        </Col>   
        <Col span={4}>  <label> либо введите </label>   </Col>  

        <Col span={3}> <Input  type="Number" onChange={onInputderiv1} disabled={disabled} /> {" "} </Col>
      </Row> 
     
      
        <h4> 1.1 Введите количество критических точек 1-рода: </h4>
      
         <Row gutter={20}>
         <label>      </label>
      <label>    </label>
          <Col span={3}>
            {" "}
            <Input  type="Number" onChange={onInputCriPN} disabled={disabled}/> {" "}
          </Col>
        </Row> 
        
      <h4> 1.2 Введите количество точек, где первая производная не существует  </h4>

      <Row gutter={20}>
      <label>      </label>
      <label>     n </label>
          <Col span={3}>
            {" "}
            <Input type="Number" onChange={onInputDisPN} min={1} max={100}disabled={disabled} />{" "}
          </Col>
        </Row> 

        <h4> 1.3 Введите количество стационарных точек  </h4>

<Row gutter={20}>
<label>      </label>
<label>     m </label>
    <Col span={3}>
      {" "}
      <Input type="Number" onChange={onInputstSpN} min={1} max={100}
      disabled={disabled} />{" "}
    </Col>
  </Row> 
  </Container>

  <form onSubmit={handleSubmit_1}>
  <Container> 
        <h4> 1.4 Введите  точку(и), где первая производная не существует  </h4>
        <MatrixRow > 
           {stDisP.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow} >
                {" "} 
                <label >  d_{indexRow + 1} </label> &nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  disabled={disabled}
                  //onChange={onInputDisP}
                /> 
              </MatrixRow>
            );
          })}
          </MatrixRow>
          <h4> 1.5 Выберите  либо введите значение(я)  <myh ref={containerDiRef}/>: </h4>
<Row gutter={20}>
    <Col span={5}>
    <label>   </label>
      <select onChange={onInputIndef2} disabled={disabled} > 
      <option value="" disabled selected >выберите </option>
      <option value="не существует"> не существует </option>
      </select>
    </Col>   
    <Col span={3}>
    <label> либо введите </label> 
    </Col>  

    <Col span={4}>
    { /*  <Input  type="Number"  disabled={disabled} /> {" "}  */}
<Input  type="Number" onChange={onInputder2dip} disabled={disabled} /> {" "} 
</Col>
  </Row> 

  <h4> 1.6 Введите стационарную(ые) точку(и) </h4>
  <MatrixRow > 
    { /*{stStp.map((row, indexRow = 1) => {*/}
      {stStp.map((row, indexRow = 1) => {
      
      return (
        <MatrixRow key={indexRow} >
          {" "}
          <label > s_{indexRow + 1} </label> &nbsp;
          <input
            key={indexRow}
            type="text"
            name={indexRow}
            disabled={disabled}
          /> 
        </MatrixRow>
      );
    })}
    </MatrixRow>

    <h4> 1.7 Введите значение(я)  <myh ref={containerStRef}/>:  </h4>
  <MatrixRow > 
     {der2st.map((row, indexRow = 1) => {
      return (
        <MatrixRow key={indexRow} >
          {" "}
          <Row gutter={20}>
          <Col span={20}>
                <label > </label> 
                <label > y''(s_{indexRow + 1}) </label> &nbsp;
                </Col > 

        <Col span={2}>  <label > </label>  </Col > 
        <Col span={2}>
        <label > </label> 
          <input
            key={indexRow}
            type="text"
            name={indexRow}
            disabled={disabled}
          /> 
          <label>   </label>
          </Col > 
          <label > </label> 
          </Row> 
        </MatrixRow>
      );
    })}
    </MatrixRow>

    <h4> <label>   </label> Ваше заключение: </h4>
    <h4> 1.8 В какой точке достигается зкстремум данной функции? </h4>
<Row gutter={20}>
    <Col span={5}>
    <label>   </label>
      <select onChange={onInputConclusion_1} disabled={disabled} > 
      <option value="" disabled selected >выберите </option>
      <option value="разрыва">  в точке разрыва 1-ой производной </option>
      <option value="стационарной"> в стационарной точке </option>
      <option value="нивкакой"> ни в какой </option>
      <option value="разрываИстационарной">  в точке разрыва и стационарной </option>
      </select>
    </Col>   
  </Row> 

  <h4> 1.9 Укажите характер зкстремума данной функции: </h4>
<Row gutter={20}>
    <Col span={5}>
    <label>   </label>
      <select onChange={onInputConclusion_2} disabled={disabled} > 
      <option value="" disabled selected >выберите </option>
      <option value="максимум">  максимум </option>
      <option value="минимум"> минимум   </option>
      <option value="минимакс"> минимум и максимум </option>
      <option value="зкстремуманет"> зкстремума нет </option>
      </select>
    </Col>   
  </Row> 

</Container>

<Container> 
      <Container1><h4> Подтвердите сохранение введенных ответов: </h4> </Container1>
      
      <Row gutter={20}>
      <label>   </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputAns} disabled={disabled} required > 
          <option value="" disabled selected >подтвердите </option>
          <option  value="подтверждено">  сохранить </option>
    </select>
        </Col>
      </Row> 
      </Container>

      <StyledButton  type='submit' disabled={disabled} > отправить </StyledButton>

</form>
  </div>
)
}

export default Extrln_1
