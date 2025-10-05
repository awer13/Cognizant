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
`
const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`


function NBextremum({setAddNotaBene}){

    const handleSubmitNB = (event) => {
        setAddNotaBene(false);
        
     }
    return (
        <div >
        <Container0> 
        <h3> Келесі ережелермен танысу міндетті: </h3>
          <li> Нақты сандарды ондық бөлшек түрінде енгізіңіз; </li>
          <li> Ондық бөлшектің бөлшек бөлігін ажырату үшін (үтір емес) нүкте қолданыңыз; </li>
          <li> Ондық бөлшекті үтірден кейін 4 орынға дейінгі дәлдікпен енгізіңіз; </li>
          <li> "Сақтау" кнопкасы басылғаннан кейін енгізілген мәліметті озгерту мүмкіндігі болмайды. </li>
    </Container0>
  

<form onSubmit={handleSubmitNB}>
<StyledButton  type='submit'> таныстым </StyledButton>
  </form>
  </div>
)
}


export default NBextremum
