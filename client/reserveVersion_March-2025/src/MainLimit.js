import React from 'react'
import { useState } from 'react'
import {Input, Row, Col } from 'antd'
import styled from 'styled-components'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import LimPolynom from './LimPolynom' //   1+4*i
import LimPolynom2 from './LimPolynom2' //   1+4*i
import LimExp from './LimExp' // 
import LimExp2 from './LimExp2' // 
import LimRoot from './LimRoot' //   1+4*i
import LimRoot2 from './LimRoot2' //   
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
  padding-right: 10px;
  font-weight: bold;
  font-size: 15px;
  background: aliceblue;
  margin: 2%; 
  font-family: Roboto; 
  text-align: center;
  
`

function MainLimit() {
  const max = 15, submax=max/3, numq=5;
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

  const saveResults = async (scoreA, scoreB, scoreC, stScore, firstName, lastName, taskNumber,taskStatus) => {
    try {
      // const docRef = await addDoc(collection(db, "myresults"), {
    const docRef = await addDoc(collection(db, '1_limit'), {
      //const docRef = await addDoc(collection(db, 'series38'), { 
         Student: firstName + " " + lastName,
         TaskNumber: taskNumber,
        TotalScore: stScore,
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
      saveResults(scoreA, scoreB, scoreC, stScore, firstName, lastName, taskNumber,taskStatus)
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
        if (taskNumber===1+2*i) { // vars 1, 3, 5, ,..., 19
          //setFirstTask("polynomform"); //  p/c   div
          setFirstTask("limpolynom2"); //  p/c   div
          setSecondTask("limroot2") //    b/(b-1) [ser: (1/b)^k]   conv
          setThirdTask("LimExp2") //   l=c >1   div
        }
        else if (taskNumber===2*(i+1)) { 
          setFirstTask("limpolynom"); //  p/c   div
          setSecondTask("limroot") //    5/(5-b) [ser: (b/5)^k]  conv
          setThirdTask("LimExp") //  l=0<1    conv
        }
      }    
  }

  return (
    <div className="App">
      <header className="App-header"> </header>
      <form onSubmit={handleSubmitID}>
        <Container>
        {/*<h1> {'Сан қатарлары'} </h1> */}
        <h1> {'Вычисление пределов'} </h1> 


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
      
      
      {/*{mssg==="nbread" && firstTask==="polynomform"&&  <PolynomFrom scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </PolynomFrom>}*/}
      {mssg==="nbread" && firstTask==="limpolynom"&&  <LimPolynom scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </LimPolynom>}
      {mssg==="1done" && secondTask==="limroot"&&  <LimRoot scoreB={scoreB} setScoreB={setScoreB} totalScoreB={totalScoreB} setTotalScoreB={setTotalScoreB} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </LimRoot>}
      {mssg==="2done" && thirdTask==="LimExp"&&  <LimExp scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </LimExp>}
      {mssg==="2done" && thirdTask==="LimExp2"&&  <LimExp2 scoreC={scoreC} setScoreC={setScoreC} totalScoreC={totalScoreC} setTotalScoreC={setTotalScoreC} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus} > </LimExp2>}
      {mssg==="nbread" && firstTask==="limpolynom2"&&  <LimPolynom2 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </LimPolynom2>}
      {mssg==="1done" && secondTask==="limroot2"&&  <LimRoot2 scoreB={scoreB} setScoreB={setScoreB} totalScoreB={totalScoreB} setTotalScoreB={setTotalScoreB} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </LimRoot2>}
      
      
         

          <Container0>       

          {(mssg==="1done" || mssg==="2done" || mssg==="3done") && (<table> 
            <thead>
    <tr>
      
      <th scope="col"> макс, балл  </th>  
      <th scope="col">   задачa 1   </th>
      <th scope="col"> баллы   </th>
      <th scope="col"> задачa 2    </th>
      <th scope="col"> баллы   </th>
      <th scope="col"> задачa 3    </th>
      <th scope="col"> баллы  </th>
       </tr>
    
      </thead>
  <tbody>
    <tr>  <td> {submax/numq}</td>
    <th scope="row"> 1.1  </th>
      <td> <stus>{scoreA[0]} </stus> </td>
      <th scope="row"> 2.1 </th>
      <td> <stus> {scoreB[0]} </stus></td>
      <th scope="row"> 3.1  </th>
      <td> <stus>{scoreC[0]}  </stus></td>
    </tr>
     <tr>  
     <td>{submax/numq}</td>
    <th scope="row"> 1.2   </th>
      <td> <stus> {scoreA[1]}</stus>  </td>
      <th scope="row">  2.2  </th>
      <td> <stus> {scoreB[1]} </stus> </td>
      <th scope="row">  3.2  </th>
      <td> <stus> {scoreC[1]} </stus> </td>
    </tr>
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.3  </th>
      <td> <stus> {scoreA[2]} </stus>  </td>
      <th scope="row"> 2.3   </th>
      <td> <stus> {scoreB[2]}  </stus> </td>
      <th scope="row"> 3.3   </th>
      <td> <stus> {scoreC[2]}</stus>  </td>
    </tr>
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.4    </th>
      <td> <stus> {scoreA[3]} </stus>  </td>
      <th scope="row"> 2.4    </th>
      <td> <stus> {scoreB[3]}</stus>  </td>
      <th scope="row"> 3.4 </th>
      <td> <stus>{scoreC[3]}</stus>  </td>
    </tr>
   
    <tr>  
    <td>{submax/numq}</td>
    <th scope="row"> 1.5   </th>
      <td> <stus> {scoreA[4]}  </stus> </td>
      <th scope="row"> 2.5   </th>
      <td> <stus> {scoreB[4]} </stus> </td>
      <th scope="row">3.5  </th>
      <td> <stus> {scoreC[4]} </stus> </td>
    </tr>

    <tr>  
    <td> {submax}  </td>
    <th scope="row"> %  </th>
      <td> <stus> {totalScoreA*100/submax}  % </stus>  </td>
      <th scope="row">    </th>
      <td> <stus>  {totalScoreB*100/submax}% </stus> </td>
      <th scope="row">    </th>
      <td> <stus>  {totalScoreC*100/submax}% </stus> </td>
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
      
      {(mssg==="3done")  && ( <Container0>  <myh> Ваша итоговая оценка  {stScore} балла(/ов) из {max} </myh>    </Container0> )}  

      
      </Container0>
      
    </div>
  )
}

export default MainLimit


