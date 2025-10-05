import React, {useState} from "react";
import { render } from '@testing-library/react';
import styled from 'styled-components'
import { button, Input, Row, Col,Form } from 'antd';
import DetA from './components/DetA.js';


// const Container = styled.div`
//   width: 700px;
//   height: 300px;
//   padding: 30px;
//   padding-left: 50px; 
  
// `

function Grade(props) {   

//   const [studentsDet, setStudentsDet] = React.useState('');
//   const [studentsD1, setStudentsD1] = React.useState('');
//   const [studentsD2, setStudentsD2] = React.useState('');
//   const [studentsD3, setStudentsD3] = React.useState('');

  
//   const D1Handler = (event) =>{
//     setStudentsD1(event.target.value)
//   }

//   const D2Handler = (event) =>{
//   setStudentsD2(event.target.value)
//   }

//   const D3Handler = (event) =>{
//   setStudentsD3(event.target.value)
//   }
var dd=DetA()

  return (
    <div>
        
         {dd===props.studentsDet && <h5> {"correct"}  </h5> }</div>
   
  );
}

export default Grade