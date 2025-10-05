import React, {useState} from "react";
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
  line-height: 1.8;
`
const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`


function NBextremum({ mssg, setMessage, setAddNotaBene}){

    const handleSubmitNB = (event) => {
      mssg="nbread"
      setMessage(mssg)
        setAddNotaBene(false);
     }
    return (
        <div >
        <Container0> 
        <h3> Обязательно к ознакомлению!: </h3>
        <li>
        При необходимости ввода символа 
          <img alt="infty symbol" src={`/image/infty.jpg`}  width="3%" height="3%"/>
          введите текст infty ; </li>
          <li> Вещественные числа введите в виде десятичной дроби; </li>
          <li> В качестве разделителя целой и дробной частей числа рекомендуется использовать точку (не запятую); </li>
          <li> Десятичную дробь введите с точностью до двух знаков после запятой; </li>
          <li> После нажатия кнопки "Сохранить" не будет доступа к изменению введенных данных. </li>

        {/*<h3> Келесі ережелермен танысу міндетті: </h3> 

          <li> Нақты сандарды ондық бөлшек түрінде енгізіңіз; </li>
          <li> Ондық бөлшектің бөлшек бөлігін ажырату үшін (үтір емес) нүкте қолданыңыз; </li>
          <li> Ондық бөлшекті үтірден кейін 4 орынға дейінгі дәлдікпен енгізіңіз; </li>
          <li>
         ∞ символын енгізу керек болған жағдайда орнына infty мәтінін енгізіңіз; </li>
          <li> "<myit>келесі есепке өту/cақтау</myit>" кнопкасы басылғаннан кейін енгізілген мәліметті озгерту мүмкіндігі болмайды. </li>
          */}
    </Container0>
  

<form onSubmit={handleSubmitNB}>
<StyledButton  type='submit'> таныстым </StyledButton>
  </form>
  </div>
)
}


export default NBextremum
