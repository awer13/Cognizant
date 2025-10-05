import * as React from "react";
import styled from 'styled-components'

const StyledButton = styled.button`
  width: 200px;
  margin-bottom: 20px;
  margin-left: 50px;
  margin-top: 5 px;
  background-color: aliceblue;
  border-radius: 8px;
  border: 0.2px solid gray;
  height: 50px;
  
  //padding-top: 20 px;
  //font-size: 16px;
`

const Container0 = styled.div`
margin-left: 50px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 20px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
  background-color: aliceblue;
  width: 750px;
  //color: red;
`
var chngName="скрыть правила";

//const App = () => {
function ReadNote({mssg, setMessage,setAddNotaBene}){

  //const [notabene, setNotaBene] = React.useState("Обязательно к ознакомлению!:");
  const [open, setOpen] = React.useState(false);
  const [buttonName, setName] = React.useState("показать правила");
  if (mssg=="3done"){
    setAddNotaBene(false);
  }
  
  const handleOpen = () => {
    if (mssg!=="1done" &  mssg!=="2done")
    {
      mssg="nbread"
      setMessage(mssg)
    }
    
    setOpen(!open);
    //setNotaBene(!notabene);
    if (buttonName=="показать правила")
    chngName="свернуть правила"
    else chngName="показать правила"
    setName(chngName);
    //setAddNotaBene(false);  
  };

  return (
    <div>
      <StyledButton onClick={handleOpen}>  <myh3> {buttonName}  </myh3>  </StyledButton>
      {open ? <div>
        <Container0> 
         <li> Вещественные числа введите в виде десятичной дроби; </li>
          <li> В качестве разделителя целой и дробной частей числа рекомендуется использовать точку (не запятую); </li>
          <li> Десятичную дробь введите с точностью до 4-х знаков после запятой; </li>
          <li> Изменения, внесенные после подтверждения отправки ответов, не сохраняются </li>
          </Container0> 
          </div> : <div>  </div>}
    </div>
  );
};

export default ReadNote;