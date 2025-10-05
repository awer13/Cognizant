import React from 'react'
// import ReactDOM from 'react-dom'
import { useState } from 'react'
import {Input, Row, Col } from 'antd'
// import { Button, Input, Row, Col } from 'antd'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
// import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import RootForm from './RootForm'
import SinForm from './SinForm'
import ExpForm from './ExpForm'
import PolynomForm from './PolynomFrom'
import NotaBene from './NotaBene'


const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`

const Container0 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  /* word-spacing: 30px; */
  color: red;
  font-size: 15px;
`

function Main() {
  const max = 25
  const [scoreA, setScoreA] = React.useState(0)
  const [scoreB, setScoreB] = React.useState(0)
  const [sent, setSent] = React.useState(0)
  const [secondTask, setSecondTask] = React.useState("nothing");
  const [taskNumber, setTaskNumber] = useState([]);
  const [lastName, setLName] = useState([]);
  const [firstName, setFName] = useState([]);
  const [mssg, setMessage] = React.useState('  ')
  const [taskStatus, setStatus] = React.useState('notsolved')
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

  const saveResults = async (scoreA, scoreB, firstName, lastName, taskNumber,mssg,taskStatus) => {
    try {
      const docRef = await addDoc(collection(db, 'myresults'), {
      // const docRef = await addDoc(collection(db, 'results'), {
        first: firstName,
        last: lastName,
        scoreA: scoreA,
        scoreB: scoreB,
        taskNumber: taskNumber,
        NB: mssg,
        taskStatus: taskStatus
      })
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  //testing above function when app is loaded
  React.useEffect(() => {
    saveResults(scoreA,scoreB, firstName, lastName, taskNumber,mssg, taskStatus)
  }, [taskStatus])

  // const HandleSubmitRes = (event) => {
  //   // saveResults(scoreA,scoreB, firstName, lastName, taskNumber,mssg,taskStatus)
  //   console.log("submitted")
  // }

  //reading data for future use
  // const readData = async () => {
  //   const querySnapshot = await getDocs(collection(db, 'users'))

  //   querySnapshot.forEach((doc) => {
  //     console.log(`${doc.id} => ${doc.data()}`)
  //   })
  // }
  const [disabled, setDisabled] = useState(false);

  const handleSubmitID = (event) => {
    setSent("task")
    setTaskNumber(taskNumber)
    setDisabled(!disabled);
    setAddNotaBene(true);
    event.preventDefault()
    console.log('taskNumber: ', taskNumber)
       
      for (let i = 0; i < 20; i++) {
        if (taskNumber===1+3*i) setSecondTask("root")
        else if (taskNumber===2+3*i) setSecondTask("sinus")
        else if (taskNumber===3+3*i) setSecondTask("exp")
        else if (taskNumber===77) setSecondTask("zero")    //janu-29
      }    
  }

  return (
    <div className="App">
      <header className="App-header"> </header>
      <form onSubmit={handleSubmitID}>
        <Container0>
        {/*<h1> {'Шекті есептеу'} </h1> */}
        <h1> {'Вычисление пределов'} </h1> 

          {/*<h3> {'Келесі мәліметтерді енгізіңіз:'} </h3> */}
           <h3> {'Введите ваши данные:'} </h3>  
          
          <Container0> </Container0>
          <Row gutter={20}>
            <label> Фамилия </label>
            <Col span={10}>
              {' '}
              <Input type="text" name="lastName" onChange={onInputLName} required/>{' '}
            </Col>
          </Row>{' '}
          <Container0> </Container0>
          <Row gutter={20}>
             <label> Имя </label>
           {/* <label> Атыңыз </label>*/}
            <Col span={11}>
              {' '}
              <Input type="text" name="firstName" onChange={onInputFName} required/>{' '}
            </Col>
          </Row>{' '}
          <Container0> </Container0>
          <Row gutter={20}>
            {/*<label> Вариант номері </label>*/}
            <label> Номер варианта </label>
            <Col span={3}>
              <Input type="Number" name="taskNumber" onChange={onInputTnum} min={1} max={60} disabled = {disabled}/>{' '}
            </Col>
          </Row>
        </Container0>
        <StyledButton type="submit" disabled={disabled} > Сохранить </StyledButton>
      </form>

      {addNotaBene && <NotaBene setAddNotaBene={setAddNotaBene}/>}

      {sent==="task" &&
        <Container0>   
           {/*  <h4> Шектерді есептеңіз </h4>  */}
           <h4> Вычислите пределы </h4>
        <div className="imageBox">
          <img alt="compute limit" src={`/image/task_${taskNumber}.jpg`}  width="60%" height="60%"/>
          </div>
          </Container0>
      }

      {sent==="task" && <PolynomForm scoreA={scoreA} setScoreA={setScoreA} mssg={mssg} setMessage={setMessage}> </PolynomForm>}
      {secondTask==="root" && <RootForm scoreRoot={scoreB} setScoreRoot={setScoreB}  taskStatus={taskStatus} setStatus={setStatus}>   </RootForm>}
     
      {secondTask==="sinus" && <SinForm scoreSin={scoreB} setScoreSin={setScoreB} mssg={mssg} setMessage={setMessage} taskStatus={taskStatus} setStatus={setStatus}>   </SinForm>}
      {secondTask==="exp" && <ExpForm scoreExp={scoreB} setScoreExp={setScoreB} mssg={mssg} setMessage={setMessage} taskStatus={taskStatus} setStatus={setStatus}> </ExpForm>}
      {/* <form onSubmit={HandleSubmitRes}> */}
        <Container0>

{/* {sent==="task" && (<Container0>  Бірінші тапсырма бойынша бағаңыз {scoreA} балл {max/2}-тен </Container0> )}*/}
{sent==="task" && (<Container0>  Ваша оценка за первое задание {scoreA} из {max/2} </Container0> )} 
      {sent==="task" && (<Container>   {mssg}  </Container> )}
      {sent==="task" && (<Container0>  Ваша итоговая оценка {scoreA+scoreB} баллов из {max} </Container0> )}
      {/*{sent==="task" && (<Container0>  Қорытынды бағаңыз {scoreA+scoreB} балл {max}-тен </Container0> )}*/}
      </Container0>
        {/* <StyledButton type="submit"> отправить </StyledButton>
      </form> */}
    </div>
  )
}

export default Main
