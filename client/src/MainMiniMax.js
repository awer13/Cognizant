import React from 'react'
import { useState } from 'react'
import {Input, Row, Col } from 'antd'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import Extrln_1 from './Extrln_1' //   1+4*i
//import Extrln_2 from './Extrln_2' 
//import Extrpoly from './Extrpoly' //   1+4*i
import NotaBene from './NotaBene'

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
  padding-right: 20px;
  font-weight: bold;
  font-size: 15px;
  background: aliceblue;
  margin: 5%; 
  font-family: Roboto; 
  text-align: center;
  
`

function MainMiniMax() {
  const max = 15, submax=max, numq=10;
  const [scoreA, setScoreA] = React.useState(0)
  
  const [totalScoreA, setTotalScoreA] = React.useState(0)
  const [stScore, setStScore] = React.useState(0)

 // const [sent, setSent] = React.useState(0)
  const [firstTask, setFirstTask] = React.useState("nothing");
  
  const [taskNumber, setTaskNumber] = useState([]);
  const [lastName, setLName] = useState([]);
  const [firstName, setFName] = useState([]);
  const [mssg, setMessage] = React.useState('notyet');
 // const [sms, setSms] = React.useState('notyet');
 
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


  const saveResults = async (scoreA, stScore, firstName, lastName, taskNumber, taskStatus) => {
    try {
    const docRef = await addDoc(collection(db, '00_minimax'), {
        Student: firstName + " " + lastName,
        TaskNumber: taskNumber,
        TotalScore: [stScore, Math.round(totalScoreA*100/submax)],
        scoreA: scoreA,
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
      saveResults(scoreA, stScore, firstName, lastName, taskNumber, taskStatus)
    }
  }, [taskStatus])


  const [disabled, setDisabled] = useState(false);

  const handleSubmitID = (event) => {
    setTaskNumber(taskNumber)
    setDisabled(!disabled);
    setAddNotaBene(true);
    //setSent("task")
    setMessage("IDdone")
    event.preventDefault()
    console.log('taskNumber: ', taskNumber)
       
      for (let i = 0; i < 18; i++) {
        //if (taskNumber===1+2*i) { // vars 1, 3, 5, ,..., 19
          setFirstTask("extrln"); //  p/c   div
        }
       // else if (taskNumber===2*(i+1)) { 
         // setFirstTask("extrpoly"); } //  p/c   div    
  }

  return (
    <div className="App">
      <header className="App-header"> </header>
      <form onSubmit={handleSubmitID}>
        <Container>
        <h1> Экстремум функции </h1> 


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
        <StyledButton type="submit" disabled={disabled} > отправить </StyledButton>

      </form>

      {addNotaBene && <NotaBene  mssg={mssg} setMessage={setMessage} setAddNotaBene={setAddNotaBene}/>}
      
      
      
      {(mssg==="nbread" || mssg==="1done") && firstTask==="extrln"&&  <Extrln_1 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus}> </Extrln_1>}
      
      {/*|| mssg==="1done"*/ }
      
          <Container0>       
          { mssg==="1done" && (<table> 
           
            <thead>
    <tr>
      
      <th scope="col"> макс, балл  </th>  
      <th scope="col">   вопросы   </th>
      <th scope="col"> баллы   </th>
       </tr>
    
      </thead>
  <tbody>
    <tr>  <td> {submax/numq}</td>
    <th scope="row"> 1.0  </th>
      <td> <stus>{scoreA[0]} </stus> </td>
     
    </tr>
     <tr>  
     <td>{submax/numq}</td>
    <th scope="row"> 1.1   </th>
      <td> <stus> {scoreA[1]}</stus>  </td>
      
     
    </tr>
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.2  </th>
      <td> <stus> {scoreA[2]} </stus>  </td>
      
     
    </tr>
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.3    </th>
      <td> <stus> {scoreA[3]} </stus>  </td>
      
     
    </tr>
   
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.4   </th>
      <td> <stus> {scoreA[4]}  </stus> </td>
      
      </tr>
   
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.5   </th>
      <td> <stus> {scoreA[5]}  </stus> </td>
      
    </tr>

    <tr>  
    <td>{2*submax/numq}</td>
    <th scope="row"> 1.6   </th>
      <td> <stus> {scoreA[6]}  </stus> </td>
      
    </tr>

    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.7   </th>
      <td> <stus> {scoreA[7]}  </stus> </td>
    </tr>

    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.8   </th>
      <td> <stus> {scoreA[8]}  </stus> </td>
    </tr>

    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.9   </th>
      <td> <stus> {scoreA[9]}  </stus> </td>
    </tr>


    <tr>  
    <td> {submax}  </td>
    <th scope="row"> %  </th>
      <td> <stus> {Math.round(totalScoreA*100/submax)}  % </stus>  </td>
     
    </tr>

    <tr>  
    <th>  </th>
    <th scope="row">    </th>
      <td> <myh>{totalScoreA} </myh> </td>
     
     
    </tr>

      </tbody>
          </table> )}
      
      {(mssg==="1done")  && ( <Container0>  <myh> Ваша итоговая оценка  {stScore} балла(/ов) из {max} </myh>    </Container0> )}  

      
      </Container0>
      
    </div>
  )
}

export default MainMiniMax


