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
function Extrln({scoreA, setScoreA, totalScoreA,setTotalScoreA, stScore, setStScore, mssg, setMessage, taskNumber, setTaskNumber}) {
    const  eps = 0.001, qnum=5;
    var scoreA=Array(qnum).fill(0);
    var criP=Array(3).fill(0);
    var  g, g1, g2, g3, indef, c,m,a;
    var max=5;
   
    const [stIndef1, setstIndef1] = useState(["notchosen"]);
    const [stIndef2, setstIndef2] = useState(["notchosen"]);
    const [stIndef3, setstIndef3] = useState([]);
    const [stDer1, setstDer1] = useState("empty");
    const [stDer2, setstDer2] = useState([]); //stud's second derivative at discontinuity points
    
  
    const [z, setZ] = useState([]);
    const [s, setS] = useState([]);
    const [k, setK] = useState([]);
    const [stSpN, setstSpN] = useState("m");
    const [stup, setStup] = useState([]);
    const [stDipN, setDiPN] = useState(['n']);
    
    const [stCripN, setCriPN] = useState([]);

    const [stCrip, setCriP] = useState([]);
    const [discpoint, setDiscpoint] = useState([]);
    const [spoint, setSpoint] = useState([]);  

    const [der2di, setDer2di] = useState([]); // second derivative at discontinuity points
    const [stDer2di, setStDer2di] = useState([]); //not stud's second derivative at discontinuity points
    const [der2st, setDer2st] = useState([]); // second derivative at stationary points


    //const [ind, setInd] = useState([1]);
    const [stG, setG] = useState(["noinput"]);
    const [stG2, setStG2] = useState(["noinput"]);
    const [stG3, setStG3] = useState(["noinput"]);
    const [stAns, setstAns] = useState("notyet");

    //katex here
    const containerRef = useRef(null);
    const container0Ref = useRef(null);
    const containerDiRef = useRef(null);
    const containerStRef = useRef(null);
    //const containerLDRef = useRef(null);

    const [texExpression,setTextExpression] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{a}x^{{n}}+{b}x^{{b}}+ {d}x}{{p}x^{{m}}+{q}x^{{t}}+{s}x+{c}} ')
    const [texExpression0,setTextExpression0] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    const [texExpression1,setTextExpression1] = useState('\\lim\\limits_{x \\to \\infty}\\dfrac{{d}}{x^{{m}}}')
    const [texExpression2,setTextExpression2] = useState('y^{(2))}(s)')
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
      if (stDipN===1)
        katex.render(`y''(d_1)  `, containerDiRef.current);
      else
      katex.render(`y''(d_i),   i=\\overline{1,${stDipN}}   `, containerDiRef.current);
    }, [texExpression1, stDipN]);


    useEffect(() => {
      if (stSpN===1)
        katex.render(`y''(s_1)  `, containerStRef.current);
      else
      katex.render(`y''(s_i),   i=\\overline{1,${stSpN}}   `, containerStRef.current);
      //katex.render(`y''(s)   `, containerStRef.current);
    }, [texExpression2,stSpN]); 

     

    /*useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${q}x^{${t}}}{x^{${m}}}    `, container2Ref.current);
    }, [texExpression2,b,m]); 
    

    useEffect(() => {
      katex.render(`\\lim\\limits_{x \\to \\infty}\\dfrac{${a}x^{${n}}}{${p}x^{${m}}}    `, container3Ref.current);
    }, [texExpression3,a,n,p,m]); */
   
/*
    const saveData = async (n, a,p, stIndef, stG, stG1, stG2, stG3, taskNumber, stAns) => {
      try {
        const docRef = await addDoc(collection(db, '1_polynom1'), { //thepeng
        z: '\lim_{x\to\infty}\frac{ax^n+bx^{n-k}+dx}{{px^m+qx^{m-i}+sx+c}}',
        zz: 'case n=m, g=a/p 0 0 a/p',
          TaskNumber: taskNumber,   
          n: n, 
          a_p: [a, p], 
          stIndef: stIndef, 
          stG: stG,
          stG1: stG1,
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
        saveData(n, a, p,stIndef, stG, stG1, stG2,  stG3, taskNumber, stAns)
      }
}, [stAns])
*/

    const onInputderiv1 = (event) => {
      setstDer1(event.target.value)
    }
    console.log('stDer1=', stDer1)
/*
    const onInputder2st = (event) => {
      setDer2st(event.target.value)
    }
*/
    const myrandom = (min,maxi) => {
       return (Math.trunc(Math.random()*(maxi-min+1))+min);
    }

    const maxk=8;
    useEffect(() => {
        setK(myrandom(1,maxk));
    }, [])

    useEffect(() => {
      setZ(myrandom(1,maxk));
  }, [])

   
    const onInputIndef1 = (event) => {
      setstIndef1(event.target.value)
  }
  console.log('stIndef1=', stIndef1)
  
/*
  const onInputDer2di = (event) => {
    let count = 1;
    let stuDer2di = Array(stDipN).fill(0);
    for (let i = 0; i < stDipN; i++) {
      //stDer2di[i] = Number(event.target[count].value)

      stDer2di[i] = Number(event.target.value)
      console.log("i=",i, "stDer2di=",stDer2di[i]);
      
      stuDer2di[i] = stDer2di[i];
      count += 1;
  }
  setStDer2di(stuDer2di)
}
*/  

  const onInputIndef2 = (event) => {
    let count = 0;
    var studIndef2 = Array(stDipN);
    for (let i = 0; i < stDipN; i++) {
      stIndef2[i] = (event.target[count].value)
      studIndef2[i] = stIndef2[i];
      count += 1;
    }
    setstIndef2(studIndef2)
}
console.log('stIndef2=', stIndef2)

const onInputIndef3 = (event) => {
  setstIndef3(event.target.value)
}

  const onInputCriPN = (event) => { //number of critical points
    setCriPN(Number(event.target.value));
}
console.log('stCripN=', stCripN)

const onInputDisPN = (event) => { //number of discontinuity points
  setDiPN(Number(event.target.value));
  var ndip = Number(event.target.value);
  let dip = Array(ndip).fill(0);
  let der2disc = Array(ndip).fill(0);
  setDer2di(der2disc);
  setStDer2di(der2disc);
  setDiscpoint(dip);  
} 
console.log('stDipN=', stDipN)

const onInputstSpN = (event) => { //number of stationary points
  setstSpN(Number(event.target.value));
  var nstp = Number(event.target.value);
  let sp = Array(nstp).fill(0);
  let der2st = Array(nstp).fill(0);
  setDer2st(der2st);
  setSpoint(sp);
}
console.log('stSpN=', stSpN)


var stdip = Array(stDipN);
    for (let i = 0; i < stDipN; i++) {
      stdip[i] = 0;
    }

 var stDerdip = Array(stDipN);
 for (let i = 0; i < stDipN; i++) {
  stDerdip[i] = 0;
  
 }

  var ststp = Array(stSpN);
    for (let i = 0; i < stSpN; i++) {
      ststp[i] = 0;
    }
    
  var stDerst = Array(stSpN);
    for (let i = 0; i < stSpN; i++) {
      stDerst[i] = 0;
  }





    const onInputAns = (event) => {
      setstAns(event.target.value)
    }
    
    const [disabled, setDisabled] = useState(false);

    g=a;

    indef="infty/infty";
    g1=0;
    g2=0;
    g3=g;

    const handleSubmitSeriesNcssr_1 = (event) => {
      let count = 1;
    setDisabled(!disabled);
    event.preventDefault();

    for (let i = 0; i < stDipN; i++) { 
        discpoint[i] = !isNaN((event.target[count].value))
          ? Number(event.target[count].value)
          : 0;
          stdip[i] = discpoint[i];
          console.log("i=",i,"discpoint=",discpoint[i]);
        count += 1;
      }
      setDiscpoint(stdip);   /// to here-2
      console.log("discpoint=",discpoint);
  
      
    for (let i = 0; i < stSpN; i++) { ////////// from here
      spoint[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        ststp[i] = spoint[i];
      count += 1;
    }
    setSpoint(ststp);   /// to here
    console.log("ststp=",ststp);

    for (let i = 0; i < stDipN; i++) { 
      console.log("stDerdipcount=",count);
      stDer2[i] = !isNaN((event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        stDerdip[i] = stDer2[i];
        console.log("i=",i,"stDerdip=",stDerdip[i]);
      count += 1;
    }
    setstDer2(stDerdip);   /// to here-2
    console.log("stDer2=",stDer2);

    for (let i = 0; i < stSpN; i++) { 
      console.log("stDerstcount=",count);
      der2st[i] = !isNaN((event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
        stDerst[i] = der2st[i];
        console.log("i=",i,"der2st=",der2st[i]);
      count += 1;
    }
    setDer2st(stDerst);   
    console.log("der2st=",der2st);


    if (stIndef1===indef){
      scoreA[0]=max/qnum;
    }

    if (Math.abs(g-stG)<eps) { 
      scoreA[1]=scoreA[1]+max/qnum;
    }

    if (Math.abs(g1-4)<eps) { 
      scoreA[2]=scoreA[2]+max/qnum;
    }

    if (Math.abs(g2-stG2)<eps) { 
      scoreA[3]=scoreA[3]+max/qnum;
    }
    
    if (Math.abs(g3-stG3)<eps) { 
      scoreA[4]=scoreA[4]+max/qnum;
    }
    
    
    for (let i = 0; i < qnum; i++){
      totalScoreA=totalScoreA+scoreA[i];
    }
    
    
    setScoreA(scoreA)
    setTotalScoreA(totalScoreA);
    
   
   /*}
     console.log("here is newRun");
   console.log("mssg=",mssg);
    console.log("b=",b, "p=",p);
    

    console.log("indef=",indef, "stIndef=", stIndef);
    console.log("g=",g, "stG=",stG);
    console.log("g=",g1, "stG=",stG1);
    console.log("g=",g2, "stG=",stG2);
    console.log("g=",g3, "stG=",stG3); */

    stScore=totalScoreA;
    setStScore(stScore);
    mssg="1done";
    setMessage(mssg);
  }
return (
    <div>
      <Container>   <h3> Задача-1 </h3>  </Container>
      <Container0>  <myh ref={containerRef}  />  </Container0> 
      
  <Container>  
         <h4> 1. Выберите либо введите значение  <myh ref={container0Ref} />: </h4>
         <Row gutter={20}>
        <Col span={5}>
        <label>   </label>
          <select onChange={onInputIndef1} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
           <option value="неопределен"> неопределён </option>  </select>
        </Col>   
        <Col span={4}>  <label> либо введите </label>   </Col>  

        <Col span={3}> <Input  type="Number" onChange={onInputderiv1}  /> {" "} </Col>
      </Row> 
     
      
        <h4> 2. Введите количество критических точек 1-рода: </h4>
      
         <Row gutter={20}>
         <label>      </label>
      <label>    </label>
          <Col span={3}>
            {" "}
            <Input  type="Number" onChange={onInputCriPN} /> {" "}
          </Col>
        </Row> 
        
      <h4> 3. Введите количество точек, где первая производная не существует  </h4>

      <Row gutter={20}>
      <label>      </label>
      <label>     n </label>
          <Col span={3}>
            {" "}
            <Input type="Number" onChange={onInputDisPN} min={1} max={100} />{" "}
          </Col>
        </Row> 

        <h4> 4. Введите количество стационарных точек  </h4>

<Row gutter={20}>
<label>      </label>
<label>     m </label>
    <Col span={3}>
      {" "}
      <Input type="Number" onChange={onInputstSpN} min={1} max={100} />{" "}
    </Col>
  </Row> 
  </Container>


  <form onSubmit={handleSubmitSeriesNcssr_1}>
  <Container> 
        <h4> 5. Введите  точку(и), где первая производная не существует  </h4>
        <MatrixRow > 
           {discpoint.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow} >
                {" "} 
                <label >  d_{indexRow + 1} </label> &nbsp;
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  //onChange={onInputDisP}
                /> 
              </MatrixRow>
            );
          })}
          </MatrixRow>

  <h4> 6. Введите стационарные точки </h4>
  <MatrixRow > 
     {spoint.map((row, indexRow = 1) => {
      return (
        <MatrixRow key={indexRow} >
          {" "}
          <label > s_{indexRow + 1} </label> &nbsp;
          <input
            key={indexRow}
            type="text"
            name={indexRow}
            // onChange={onInputApolynom}
          /> 
        </MatrixRow>
      );
    })}
    </MatrixRow>

    <h4> 7. Выберите  либо введите значение(я)  <myh ref={containerDiRef}/>: </h4>
          <MatrixRow > 
           {der2di.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow} >
                <Row gutter={20}>
                <Col span={4}>
                <label > </label> 
                <label > y''(d_{indexRow + 1}) </label> &nbsp;
                </Col >  
                <Col span={25}>
        <label>   </label>
          <select onChange={onInputIndef2} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
           <option value="неопределен"> неопределён </option>
    </select>
    <label>   </label>
    </Col>
    <Col span={2}> <label>   </label>  </Col>
    <Col>
    <label > </label> 
   
    <Col span={25}> 
        <label>  либо введите </label> &nbsp;
        </Col >  

        <Col span={2}>  <label > </label>  </Col >  
        <Col span={2}>
                <input
                  key={indexRow}
                  type="Number"
                  name={indexRow}
                  //onChange={onInputDer2di}
                /> 
                 <label>   </label>
                 </Col>
               
                </Col>
                <label > </label> 
                </Row> 
              </MatrixRow>
            );
          })}
         
          </MatrixRow>

          <h4> 8. Выберите  либо введите значение(я)  <myh ref={containerStRef}/>: </h4>
          <MatrixRow > 
           {der2st.map((row, indexRow = 1) => {
            return (
              <MatrixRow key={indexRow} >
              
                <Row gutter={20}>
               
                <Col span={4}>
                <label > </label> 
                <label > y''(s_{indexRow + 1}) </label> &nbsp;
                </Col >  
                <Col span={25}>
        <label>   </label>
        <select onChange={onInputIndef3} disabled={disabled} > 
          <option value="" disabled selected >выберите </option>
           <option value="неопределен"> неопределён </option>
    </select>
    <label>   </label>
    </Col>
    <Col span={2}> <label>   </label>  </Col>
    <Col>
    <label > </label> 
   
    <Col span={20}>
        <label>  либо введите </label> &nbsp;
        </Col >   
        <Col span={2}>  <label > </label>  </Col > 

        <Col span={2}>
                <input
                  key={indexRow}
                  type="text"
                  name={indexRow}
                  //onChange={onInputder2st}
                /> 
                 <label>   </label>
                 </Col>
               
                </Col>
                <label > </label> 
                </Row> 
              </MatrixRow>
            );
          })}
         
          </MatrixRow>

     </Container>

        <Container> 
      
        <Container1><h4> Подтвердите отправку введенных ответов: </h4> </Container1>
        
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

        <StyledButton  type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
  </form>
  </div>
)
}

export default Extrln
