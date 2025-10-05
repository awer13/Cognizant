//import React, {useState} from "react";
import styled from 'styled-components'


const Container0 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
  background-color: lightyellow;
  width: 750px;
  color: red;
`
const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`


function NotaBene({mssg, setMessage, setAddNotaBene}){
    const handleSubmitNB = (event) => {
      mssg="nbread"
      setMessage(mssg)
      setAddNotaBene(false);  
     }
    return (
        <div >
        <Container0> 
        <h3> Обязательно к ознакомлению!: </h3>
       
          <li> Вещественные числа введите в виде десятичной дроби; </li>
          <li> В качестве разделителя целой и дробной частей числа рекомендуется использовать точку (не запятую); </li>
          <li> Десятичную дробь введите с точностью до 3-х знаков после запятой; </li>
          <li> После перехода к следующей задаче или нажатия кнопки "сохранить" не будет доступа к изменению введенных данных. </li>


          {/*
          <li> Изменения, внесенные после подтверждения отправки ответов, не сохраняются </li>
           <li>
             
        При необходимости ввода символа 
          <img alt="infty symbol" src={`/image/infty.jpg`}  width="3%" height="3%"/>
          введите текст infty ; </li>
          <h3> Келесі ережелермен танысу міндетті: </h3>
        <li>
          <img alt="infty symbol" src={`/image/infty.jpg`}  width="3%" height="3%"/>
          символын енгізу керек болған жағдайда infty мәтінін енгізіңіз; </li>
          <li> Нақты сандарды ондық бөлшек түрінде енгізіңіз; </li>
          <li> Ондық бөлшектің бөлшек бөлігін ажырату үшін (үтір емес) нүкте қолданыңыз; </li>
          <li> Ондық бөлшекті үтірден кейін 2 орынға дейінгі дәлдікпен енгізіңіз; </li>
          <li> "Сақтау" кнопкасы басылғаннан кейін енгізілген мәліметті озгерту мүмкіндігі болмайды. </li>
           */}
    </Container0>
  

<form onSubmit={handleSubmitNB}>
<StyledButton  type='submit'> ознакомлен(a) </StyledButton>
  </form>
  </div>
)
}


export default NotaBene
