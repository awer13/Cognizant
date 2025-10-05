import React from 'react'
import { useState,useRef,useEffect} from 'react'
import {Input, Row, Col } from 'antd'
// import { Button, Input, Row, Col } from 'antd'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import ExtrRoot_1 from './ExtrRoot_1' // max  1+4*i
import ExtrRoot_2 from './ExtrRoot_2' // min    2+4*i
import ExtrRoot_3 from './ExtrRoot_3'  // not extr  3+4*i
import ExtrQuad_1 from './ExtrQuad_1' //max   2+4*i
import ExtrQuad_2 from './ExtrQuad_2' // min   3+4*i
import ExtrQuad_3 from './ExtrQuad_3' // not extr   4+4*i
//import ExtrCubic_0 from './ExtrCubic_0' // min & not extr   1+4*i
import ExtrCubic_00 from './ExtrCubic_00' // min & not extr   1+4*i
import ReadNote from './ReadNote'
import katex from "katex";
import "katex/dist/katex.min.css";
//import NBextremum from './NBextremum'

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
  display: block;
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
const Container1 = styled.div`
  display: block;
  flex-direction: column;
  padding: 5px;
  padding-left: 20px;
  padding-right: 10px;
  font-weight: bold;
  font-size: 15px;
  background: aliceblue;
  margin: 2%; 
  font-family: Roboto; 
  text-align: left;
  
`

function Mainextremum() {
  const max = 20, dscore=1, max1=max/2;
  const [score, setScore] = React.useState(0)
  const [scoreA, setScoreA] = React.useState(0)

  const [totalScore, setTotalScore] = React.useState(0)
  const [totalScoreA, setTotalScoreA] = React.useState(0)
  const [stScore, setStScore] = React.useState(0)

  const [sent, setSent] = React.useState(0)
  const [firstTask, setFirstTask] = React.useState("nothing");
  const [secondTask, setSecondTask] = React.useState("nothing");
  const [taskNumber, setTaskNumber] = useState([]);
  const [lastName, setLName] = useState([]);
  const [firstName, setFName] = useState([]);
  const [mssg, setMessage] = React.useState('notyet')
  const [taskStatus, setStatus] = React.useState(' ')
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

  const saveResults = async (scoreA, score, stScore, firstName, lastName, taskNumber,taskStatus) => {
    try {
      //const docRef = await addDoc(collection(db, '0_extremum'), {
       const docRef = await addDoc(collection(db, 'fornow'), {
       // const docRef = await addDoc(collection(db, 'extremum'), { nuclear engineering
        Name: firstName,
        Surname: lastName,
        taskStatus: taskStatus,
        scoreA: scoreA,
        scoreB: score,
        TotalScore: stScore,
        taskNumber: taskNumber
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }
  React.useEffect(() => {
    // if(status === ''){
    //   //save result
    // }
    saveResults(scoreA, score, stScore, firstName, lastName, taskNumber,taskStatus)
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
       
      for (let i = 0; i < 7; i++) {
        if (taskNumber===1+4*i) { // vars 1, 5, 9 
          setFirstTask("cubic0"); // min & not extr
          setSecondTask("root1") //max
        }
        else if (taskNumber===2+4*i) {  // vars 2, 6, 10
          setFirstTask("quad1"); // max
          setSecondTask("root2") // min
        }
        else if (taskNumber===3+4*i) { // vars 3, 7, 11
          setFirstTask("quad2"); // min
          setSecondTask("root3") // not extr
        }
        else if (taskNumber===4+4*i) { // vars 4, 8, 12 
          setFirstTask("quad3");  // not extr 
          setSecondTask("root1") // max
        }
      }    
  }

  return (
    <div className="App">
      <header className="App-header"> </header>
      <form onSubmit={handleSubmitID}>
        <Container>
        <h1> {'Экстремум функции'} </h1> 

       {/* <h1> {'Функцияның экстремумы'} </h1>  */} 

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

      {addNotaBene && <ReadNote mssg={mssg} setMessage={setMessage} setAddNotaBene={setAddNotaBene}/>}
      
     {/* {sent==="task" && firstTask==="cubic0"&&  <ExtrCubic_0 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrCubic_0>}
           {mssg==="nbread" && firstTask==="cubic0"&&  <ExtrCubic_0 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrCubic_0>}
          */}
      
      {sent==="task" && firstTask==="quad1"&&  <ExtrQuad_1 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrQuad_1>}
      {sent==="task" && firstTask==="quad2"&&  <ExtrQuad_2 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrQuad_2>}
      {sent==="task" && firstTask==="quad3"&&  <ExtrQuad_3 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA}stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrQuad_3>}
      {mssg==="nbread" && firstTask==="cubic0"&&  <ExtrCubic_00 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </ExtrCubic_00>}
     
      {mssg==="1done" &&  secondTask==="root1" && <ExtrRoot_1 score={score} setScore={setScore}  totalScore={totalScore} setTotalScore={setTotalScore} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskStatus={taskStatus} setStatus={setStatus} taskNumber={taskNumber} setTaskNumber={setTaskNumber}>   </ExtrRoot_1>}
      {mssg==="1done" && secondTask==="root2" && <ExtrRoot_2 score={score} setScore={setScore} totalScore={totalScore} setTotalScore={setTotalScore}  stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage} taskStatus={taskStatus} setStatus={setStatus} taskNumber={taskNumber} setTaskNumber={setTaskNumber}>   </ExtrRoot_2>}
      {mssg==="1done" && secondTask==="root3" && <ExtrRoot_3 score={score} setScore={setScore} totalScore={totalScore} setTotalScore={setTotalScore} stScore={stScore} setStScore={setStScore} mssg={mssg} setMessage={setMessage}  taskStatus={taskStatus} setStatus={setStatus} taskNumber={taskNumber} setTaskNumber={setTaskNumber}>   </ExtrRoot_3>}
         

          <Container0>       

          {mssg==="2done" && (<table> 
            <thead>
    <tr>
            {/*
             <th scope="col"> макс балл, % </th>  
      <th scope="col"> 1-есеп сұрағы   </th>
      <th scope="col"> 1-есеп баллы, %  </th>
      <th scope="col"> 2-есеп сұрағы   </th>
      <th scope="col"> 2-есеп баллы, % </th>
            */}

<th scope="col"> макс, балл  </th>  
      <th scope="col"> задача 1   </th>
      <th scope="col"> баллы  </th>
      <th scope="col"> задача 2   </th>
      <th scope="col"> баллы </th>
       </tr>
    
      </thead>
  <tbody>
    <tr>  <td> {dscore}</td>
    {/*
    <th scope="row"> стационар (.) саны </th>
*/}
    <th scope="row"> количество стационарных точек </th>
      <td>{scoreA[0]} </td>
      <th scope="row"> количество стационарных точек </th>
      <td>{score[0]} </td>
    </tr>
     <tr>  
     <td>{dscore}</td>
    <th scope="row"> (x₁, y₁)  </th>
      <td>{scoreA[1]} </td>
      <th scope="row"> x₁ </th>
      <td>{score[1]} </td>
    </tr>
    <tr>  
    <td>{dscore}</td>
    <th scope="row"> (x₂, y₂)  </th>
      <td>{scoreA[2]}  </td>
      <th scope="row"> y₁  </th>
      <td>{score[2]}  </td>
    </tr>
    <tr>  
    <td>{dscore}</td>
    <th scope="row">z'ₓ  </th>
      <td>{scoreA[3]}  </td>
      <th scope="row">z'ₓ  </th>
      <td>{score[3]}  </td>
    </tr>
    <tr>  
    <td>{dscore}</td>
    <th scope="row">z'_y   </th>
      
      <td>{scoreA[4]}  </td>
      <th scope="row">z'_y   </th>
      <td>{score[4]}  </td>
    </tr>

    <tr>  
    <td>{dscore}</td>
    <th scope="row"> z'_xx </th>   
      <td>{scoreA[5]}  </td>
      <th scope="row">z'_xx   </th>
      <td>{score[5]}  </td>
    </tr>

    <tr>  
    <td>{dscore}</td>
    <th scope="row">z'_xy   </th>
      
      <td>{scoreA[6]}  </td>
      <th scope="row">z'_xy   </th>
      <td>{score[6]}  </td>
    </tr>

    <tr>  
    <td>{dscore}</td>
    <th scope="row">z'_yx   </th>
      
      <td>{scoreA[7]}  </td>
      <th scope="row">z'_yx   </th>
      <td>{score[7]}  </td>
    </tr>

    <tr>  
    <td>{dscore}</td>
    <th scope="row">z'_yy   </th>
      
      <td>{scoreA[8]}  </td>
      <th scope="row">z'_yy   </th>
      <td>{score[8]}  </td>
    </tr>

    <tr>  
    <td>{dscore}</td>
    <th scope="row">D   </th>
      
      <td>{scoreA[9]}  </td>
      <th scope="row">D   </th>
      <td>{score[9]}  </td>
    </tr>
    <tr>  
    <td>{dscore}</td>
    <th scope="row"> extr   </th>
      
      
      <td>{scoreA[10]}  </td>
      <th scope="row"> extr   </th>
      <td>{score[10]}  </td>
    </tr>
 {/*
    <tr>  
    <td>100</td>
    <th scope="row">  %   </th>
      <td>{totalScoreA}%  </td>
      <th scope="row">  %   </th>
      <td>{totalScore}%  </td>
    </tr>
    */}
    <tr>  
    <th>total </th>
    <th scope="row"> {max/2} баллов  </th>
      <td>{totalScoreA*5/100}  </td>
      <td scope="row">  {max/2} баллов  </td>
      <td>{totalScore*5/100}  </td>
    </tr>

      </tbody>
          </table> )}

      {/* mssg==="3done"
       {sent==="task" && ( <Container0>  Қорытынды бағаңыз <mymath> {stScore}  </mymath> балл {max}-нан   </Container0> )}  
        {sent==="task" && ( <Container0>  Ваша итоговая оценка    <mymath>  {stScore}  </mymath> балл(ов) из  {max}   </Container0> )}  
*/}
      
      {(mssg==="2done")  && ( <Container0>  <myh> Ваша итоговая оценка  {Math.round(stScore*100/max)}% = {stScore} балл(ов) из {max} </myh>    </Container0> )}  
      
      </Container0>
      
    </div>
  )
}

export default Mainextremum


/*{sent==="task" && <ExtrRoot score={score} setScore={setScore} totalScore={totalScore} setTotalScore={setTotalScore} mssg={mssg} setMessage={setMessage}> </ExtrRoot>}*/