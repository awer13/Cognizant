import React from 'react'
import { useState } from 'react'
//import React, {useState,useRef, useEffect} from "react";
import {Input, Row, Col } from 'antd'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import Ncssr_1 from './Ncssr_1' //   1+4*i
import Ncssr_2 from './Ncssr_2' // 
import Sum_1 from './Sum_1' //   1+4*i
import Sum_2 from './Sum_2' //   1+4*i
import Dlmbr_1 from './Dlmbr_1' //   1+4*i
import Dlmbr_2 from './Dlmbr_2' //   1+4*i
import Caushy_1 from './Caushy_1' //   1+4*i
import Caushy_2 from './Caushy_2' //   1+4*i
import ReadNote from './ReadNote'

import katex from "katex";
import "katex/dist/katex.min.css";



const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  font-size: 15px;
  
`
const Container0 = styled.div`
  display: inline-block;
  flex-direction: column;
  padding: 5px;
  padding-left: 20px;
  padding-right: 10px;
  font-weight: bold;
  font-size: 15px;
  background: aliceblue;
  margin: 2%; 
  font-family: Roboto; 
  text-align: center;
  
`

function MainSeries() {
  const max = 21, taskmax=max/3, submax=2;

  const [scoreA, setScoreA] = React.useState(0)
  const [scoreB, setScoreB] = React.useState(0)
  const [scoreC, setScoreC] = React.useState(0)

  const [totalScoreA, setTotalScoreA] = React.useState(0)
  const [totalScoreB, setTotalScoreB] = React.useState(0)
  const [totalScoreC, setTotalScoreC] = React.useState(0)
  const [stScore, setStScore] = React.useState(0)

  const [sent, setSent] = React.useState(0)
  const [firstTask, setFirstTask] = React.useState("nothing");
  const [secondTask, setSecondTask] = React.useState("nothing");
  const [thirdTask, setThirdTask] = React.useState("nothing");
  const [taskNumber, setTaskNumber] = useState([]);
  const [lastName, setLName] = useState([]);
  const [firstName, setFName] = useState([]);
  const [mssg, setMessage] = React.useState('notyet');
  const [turn, setTurn] = React.useState('off')

 // const [nbstatus, setNBstatus] = React.useState('notyet');

  const [taskStatus, setStatus] = React.useState('not solved');
  const [addNotaBene, setAddNotaBene] = useState(false);

  const onInputTnum = (event) => {
    setTaskNumber(Number(event.target.value));
  }

  const onInputLName = (event) => {
    setLName(event.target.value);
  }

  const onInputFName = (event) => {
    setFName(event.target.value);
  }

  const saveResults = async (scoreA, scoreB, scoreC, stScore, firstName, lastName, taskNumber, taskStatus) => {
    try {
       const docRef = await addDoc(collection(db, "mytest"), {
    //const docRef = await addDoc(collection(db, '01_series'), {
  // const docRef = await addDoc(collection(db, '00_series'), {
         Student: firstName + " " + lastName,
         TaskNumber: taskNumber,
        TotalScore: stScore,
        TotalPercents: Math.round(stScore*100/max)+"%",
        scoreA: scoreA,
         scoreB: scoreB,
         scoreC: scoreC,
         taskStatus: taskStatus
       })

       
       console.log('Document written with ID: ', docRef.id)
       taskStatus="saved"
       setStatus(taskStatus)
     } catch (e) {
       console.error('Error adding document: ', e)
     }
  }
  React.useEffect(() => {
    if (taskStatus==="done"){
      saveResults(scoreA, scoreB, scoreC, stScore, firstName, lastName, taskNumber, taskStatus)
    }
    // saveResults(score,totalScore, firstName, lastName, taskNumber,mssg, taskStatus)
  }, [taskStatus])


  const [disabled, setDisabled] = useState(false);

  const handleSubmitID = (event) => {
    setTaskNumber(taskNumber)
    setDisabled(!disabled);
    setAddNotaBene(true);
    setSent("task")
    setMessage("IDdone")
    event.preventDefault()
    console.log('taskNumber: ', taskNumber)
       
      for (let i = 0; i < 10; i++) {
        if (taskNumber===1+4*i) { // vars 1, 5, 9, 13, 17, 21, 25, 29, 33, 37 
          setFirstTask("ncssr_1"); //  p/c   div
          setSecondTask("sum_1") //    5/(5-b) [ser: (b/5)^k]  conv
          setThirdTask("dlmbr_1") //  l=0<1    conv
        }
        else if (taskNumber===2+4*i) {  // vars 2, 6, 10, 14, 18, 22, 26, 30, 34, 38
          setFirstTask("ncssr_2"); //  p/c   div
          setSecondTask("sum_2") //    b/(b-1) [ser: (1/b)^k]   conv
          setThirdTask("dlmbr_2") //   l=c >1   div
        }
        else if (taskNumber===3+4*i) { // vars 3, 7, 11, 15, 19, 23, 27, 31, 35, 39
          setFirstTask("ncssr_1"); //   p/c    div
          setSecondTask("sum_2") //    5/(5-b) [ser: (b/5)^k]  conv
          setThirdTask("caushy_1") //  l=[c/(c+1)]^b<1   conv
        }
        else if (taskNumber===4+4*i) { // checked:  vars 4, 8, 12, 16, 20, 24, 28, 32, 36, 40 
          setFirstTask("ncssr_2"); //    p/c   div
          setSecondTask("sum_1") //    b/(b-1) [ser: (1/b)^k]   conv
          setThirdTask("caushy_2") //   l=[c/(c+1)]^b<1    conv
        }
      }    
  }

  return (
    <div className="App">
      <header className="App-header"> </header>
      <form onSubmit={handleSubmitID}>
        <Container>
       {/* <h1> {'Сан қатарлары'} </h1>  */ } 
        <h1> {'Числовые ряды'} </h1> 

          {/*<h3> {'Келесі мәліметтерді енгізіңіз:'} </h3> */}
          <h3> {'Введите ваши данные:'} </h3>  
          
          <Container> </Container>
          <Row gutter={20}>
            <label> Фамилия </label>
            <Col span={10}>
              {' '}
              <Input type="text" name="lastName" onChange={onInputLName} required/>{' '}
            </Col>
          </Row>{' '}
          <Container> </Container>
          <Row gutter={20}>
            <label> Имя </label>
          {/* <label> Атыңыз </label>*/}
            <Col span={11}>
              {' '}
              <Input type="text" name="firstName" onChange={onInputFName} required/>{' '}
            </Col>
          </Row>{' '}
          <Container> </Container>
          <Row gutter={20}>
            {/*<label> Вариант номері </label>*/}
            <label> Номер варианта </label>
            <Col span={3}>
              <Input type="Number" name="taskNumber" onChange={onInputTnum} min={1} max={60} disabled = {disabled}/>{' '}
            </Col>
          </Row>
        </Container>
        {/*<StyledButton type="submit" disabled={disabled} > сақтау </StyledButton>*/} 
        <StyledButton type="submit" disabled={disabled} > сохранить </StyledButton>    
      </form>

      { /*{addNotaBene && <ReadNote  mssg={mssg} setMessage={setMessage}/>}*/}
       {addNotaBene && <ReadNote  mssg={mssg} setMessage={setMessage} setAddNotaBene={setAddNotaBene}/>}
      {/*{addNotaBene && <NotaBene  mssg={mssg} setMessage={setMessage} setAddNotaBene={setAddNotaBene}/>}*/}
      
      
      {mssg==="nbread" && firstTask==="ncssr_1"&&  <Ncssr_1 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Ncssr_1>}
      {mssg==="1done" && secondTask==="sum_1"&&  <Sum_1 scoreB={scoreB} setScoreB={setScoreB} totalScoreB={totalScoreB} setTotalScoreB={setTotalScoreB} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Sum_1>}
      {mssg==="2done" && thirdTask==="dlmbr_1"&&  <Dlmbr_1 scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </Dlmbr_1>}
      {mssg==="2done" && thirdTask==="caushy_1"&&  <Caushy_1 scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </Caushy_1>}
      {mssg==="2done" && thirdTask==="caushy_2"&&  <Caushy_2 scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </Caushy_2>}

      {mssg==="nbread" && firstTask==="ncssr_2"&&  <Ncssr_2 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Ncssr_2>}
      {mssg==="1done" && secondTask==="sum_2"&&  <Sum_2 scoreB={scoreB} setScoreB={setScoreB} totalScoreB={totalScoreB} setTotalScoreB={setTotalScoreB} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Sum_2>}
      {mssg==="2done" && thirdTask==="dlmbr_2"&&  <Dlmbr_2 scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </Dlmbr_2>}
      
         

          <Container0>       

          {/*</Container0>{(mssg==="1done" || mssg==="2done" || mssg==="3done") && (<table> */}
          {(mssg==="3done") && (<table> 
            <thead>
    <tr>
      
      <th scope="col"> макс, балл  </th>  
      <th scope="col"> задача 1   </th>
      <th scope="col"> баллы  </th>
      <th scope="col"> задача 2   </th>
      <th scope="col"> баллы </th>
      <th scope="col"> задача 3   </th>
      <th scope="col"> баллы </th>
       </tr>
    
      </thead>
  <tbody>
    <tr>  <td> {submax/2}</td>
    <th scope="row"> a_k  </th>
      <td>{scoreA[0]} </td>
      <th scope="row"> a_k   </th>
      <td>{scoreB[0]} </td>
      <th scope="row"> a_k   </th>
      <td>{scoreC[0]} </td>
    </tr>
     <tr>  
     <td>{submax}</td>
    <th scope="row"> <myit> a </myit>  </th>
      <td>{scoreA[1]} </td>
      <th scope="row"> <myit> S </myit> </th>
      <td>{scoreB[1]} </td>
      <th scope="row"> <myit> l </myit> </th>
      <td>{scoreC[1]} </td>
    </tr>
    <tr>  
    <td>{submax}</td>
    <th scope="row"> сходимость  </th>
      <td>{scoreA[2]}  </td>
      <th scope="row"> сходимость  </th>
      <td>{scoreB[2]}  </td>
      <th scope="row"> сходимость  </th>
      <td>{scoreC[2]}  </td>
    </tr>
    <tr>  
    <td>{submax}</td>
    <th scope="row">обоснование  </th>
      <td>{scoreA[3]}  </td>
      <th scope="row">обоснование  </th>
      <td>{scoreB[3]}  </td>
      <th scope="row">обоснование  </th>
      <td>{scoreC[3]}  </td>
    </tr>
   
    <tr>  
    <td> {taskmax}  </td>
    <th scope="row"> %  </th>
      <td>{Math.round(totalScoreA*100/taskmax)} %  </td>
      <th scope="row">    </th>
      <td>{Math.round(totalScoreB*100/taskmax)}%  </td>
      <th scope="row">    </th>
      <td>{Math.round(totalScoreC*100/taskmax)}%  </td>
    </tr>

    <tr>  
    <th>  </th>
    <th scope="row">    </th>
      <td> <myh>{totalScoreA} </myh> </td>
      <td scope="row">   </td>
      <td> <myh> {totalScoreB} </myh>  </td>
      <td scope="row">   </td>
      <td> <myh> {totalScoreC} </myh>  </td>
    </tr>

      </tbody>
          </table> )}

    
      
      {(mssg==="3done")  && ( <Container0>  <myh> Ваша итоговая оценка  {Math.round(stScore*100/max)}% = {stScore} балл(ов) из {max} </myh>    </Container0> )}  

      
      </Container0>
      
    </div>
  )
}

export default MainSeries


