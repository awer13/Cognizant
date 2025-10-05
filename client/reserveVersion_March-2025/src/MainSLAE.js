import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Input, Row, Col } from "antd";
//import { Button, Input, Row, Col, Form } from "antd";
//import { render } from "@testing-library/react";
//import ReactDOM from "react-dom/client";
import DetForm from './DetForm';
import DetA from './DetA';
import Checkit from './Checkit';
import Minor from './Minor';
import FScore from './FScore';

//import DetForm from "./components/DetForm.js";
//import DetA from "./components/DetA.js";
// import Minor from './components/Minor.js';
// import FScore from './components/FScore.js';
//import Checkit from "./components/Checkit.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  /* padding: 30px; */
  padding-left: 50px;
`;
const Container0 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-left: 50px;
  /* word-spacing: 30px; */
  font-weight: bold;
  font-size: 15px;
`;

const StyledButton = styled.button`
  width: 100px;
  margin-bottom: 20px;
  margin-left: 300px;
  margin-top: 20px;
`;
const MatrixContainer = styled.div`
  display: flex;
  width: 280px;
  /* height: 40px; */
  flex-direction: column;
  /* background-color: pink; */
  margin-left: 50px;
  padding-left: 20px;
  /* padding-top: 10px; */
`;
const MatrixRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 500px;
  align-items: flex-start;
  margin-left: 50px;
`;
const MatrixCol = styled.div`
  display: flex;
  flex-direction: col;
  width: 500px;
  align-items: flex-start;
  margin-left: 50px;
`;
 var dispit=0, checked=0, Score=0,  message=" ";

var dd = 0,
  max = 25;
var checked = 0,
  score = 0;
var indctr = "det",
  summary = "Итоговый балл";

var delta = [],
  sx = [];
var sdeltaTemp = [];
var scores = [];
var x_1 = 0,
  x_2 = 0,
  x_3 = 0;
// let matrixA = []
let rhs = [];
// let thisMinor = [];
// let minor = [];
// var matrixA = [];

function App() {
  const theme = React.useState(
    "Решение систем линейных алгебраических уравнений по правилу Крамера"
  );
  const askmatrixdim = React.useState("Введите размерность матрицы n x m");
  const [rows, setRows] = React.useState(" ");
  const [clms, setClms] = React.useState(" ");
  const [matrix, setMatrix] = useState([]);
  const [b, setB] = useState([]);
  const [stDet, setStDet] = React.useState("");
  // const [delta, setDelta] = React.useState('');
  const [sdelta, setsDelta] = React.useState("");
  // const [sx, setsX] = React.useState('');

  const onInputRows = (event) => {
    setRows(Number(event.target.value));
    var nRows = Number(event.target.value);
    let a = Array(nRows).fill(0);
    for (let i = 0; i < nRows; i++) {
      a[i] = new Array(clms).fill(0);
    }
    setMatrix(a);
  };
  const setupArrays = () => {};

  const onInputColumns = (event) => {
    setClms(Number(event.target.value));
    var nClms = Number(event.target.value);
    let a = Array(rows).fill(0);
    for (let i = 0; i < rows; i++) {
      a[i] = new Array(nClms).fill(0);
    }
    setMatrix(a);
  };
  React.useEffect(() => {
    console.log("setup arrays");
    setupArrays();
  }, [rows, clms]);

  const detHandler = (event) => {
    event.preventDefault();
    setStDet(Number(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let count = 0;
    var matrixA = Array(rows);
    var rhs = Array(rows);
    var thisMinor = Array(rows);
    var minor = Array(rows);
    for (let i = 0; i < rows; i++) {
      minor[i] = new Array(clms).fill(0);
    }
    for (let i = 0; i < rows; i++) {
      rhs[i] = 0;
    }
    for (let i = 0; i < rows; i++) {
      matrixA[i] = new Array(clms).fill(0);
    }
    for (let i = 0; i < rows; i++) {
      thisMinor[i] = new Array(clms).fill(0);
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < clms; j++) {
        // console.log(
        //   "(event.target[count].value)",
        //   Number(event.target[count].value)
        // );
        // If the floating point number cannot be parsed, we set 0 for this value
        matrixA[i][j] = !isNaN(Number(event.target[count].value))
          ? Number(event.target[count].value)
          : 0;

        minor[i][j] = matrixA[i][j];
        count += 1;
      }
    }
    setMatrix(matrixA);
    for (let i = 0; i < rows; i++) {
      b[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
      rhs[i] = b[i];
      count += 1;
    }
    count += 1;
    for (let i = 0; i < rows; i++) {
      sdeltaTemp[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
      count += 1;
    }

    for (let i = 0; i < rows; i++) {
      sx[i] = !isNaN(Number(event.target[count].value))
        ? Number(event.target[count].value)
        : 0;
      count += 1;
    }

    setB(rhs);
    // setDelta(delta);
    setsDelta(sdeltaTemp);
    // setsX(sx);

    dd = DetA(matrixA);
    console.log("matrix", matrixA);
    // if (dd === 0) {
    //   summary = "Cистема не имеет решения";
    // } else {
    summary = "Итоговый балл";
    indctr = "det";
    // console.log("corv for det=", dd);
    // checked = Checkit(stDet, dd, indctr);
    score = checked;
    scores[0] = checked;
    // console.log("score for det=", checked);
    console.log("matrixA01", matrixA);
    for (let k = 0; k < rows; k++) {
      // удалил это т к скорее всего использовались ссылки на одни и те же переменные, при получении с инпутов значений создаем сразу матрицу минор и после изменеяем ее, не трогая изначальную матрицу

      // console.log("k=", k);
      // for (let i = 0; i < rows; i++) {
      //   var a = matrixA[i];
      //   // minor[i] = a;
      // }

      for (let i = 0; i < rows; i++) {
        minor[i][k] = b[i];
      }

      console.log("minor00=", minor[0][0], "minor01=", minor[0][1]);
      console.log("minor10=", minor[1][0], "minor11=", minor[1][1]);
      console.log("matrixA00=", matrixA[0][0], "matrixA01=", matrixA[0][1]);
      console.log("matrixA10=", matrixA[1][0], "matrixA01=", matrixA[1][1]);

      delta[k] = DetA(minor);
      // }
      const x = [x_1, x_2, x_3];
      indctr = "notdet";
      // console.log("correct delta=", delta);

      for (let k = 0; k < delta.length; k++) {
        console.log("corv for delta", k + 1, "=", delta[k]);

        checked = Checkit(sdelta[k], delta[k], indctr);
        console.log("score for delta", k + 1, "=", checked);

        scores[k + 1] = checked;
        score += checked;
        console.log("score + delta", k + 1, "=", score);

        x[k + 1] = delta[k] / dd;
        indctr = "x";
        console.log("corv for x", k + 1, "=", x[k + 1]);
        checked = Checkit(sx, x[k], indctr);
        console.log("score for x", k + 1, "=", checked);

        scores[delta.length + k + 1] = checked;
        score += checked;
        console.log("score + x", k + 1, "=", score);
      }
    }
    console.log("correct value delta=", delta);
    // k=1
    // thisMinor=Minor(minor,k,b,rows);
    // delta2=DetA(thisMinor);

    // k=2
    // thisMinor=Minor(matrixA,k,b,rows);
    // delta3=DetA(thisMinor);
    dispit=1;
  };

  return (
    <div className="App">
      <header className="App-header"> </header>
      <Container>
        <h2> {theme} </h2>
        <h5> {askmatrixdim} </h5>

        <Row gutter={20}>
          <label> n </label>
          <Col span={2}>
            {" "}
            <Input onChange={onInputRows} defaultValue=" " />{" "}
          </Col>
          <label> m </label>

          <Col span={2}>
            <Input
              onChange={(event) => onInputColumns(event, 2, 5)}
              defaultValue=" "
            />
          </Col>
        </Row>

        <h5>
          {" "}
          Введите матрицу {rows} x {clms}:{" "}
        </h5>
      </Container>
      <form onSubmit={handleSubmit}>
        {" "}
        {matrix.map((row, indexRow = 1) => {
          return (
            <MatrixRow key={indexRow}>
              {" "}
              {row.map((item, indexColumn = 1) => {
                return (
                  <input
                    key={indexRow + " " + indexColumn}
                    type="text"
                    //defaultValue={(indexColumn + 1) * (indexRow + 2)}
                    name={indexRow + "," + indexColumn}
                  />
                );
              })}
            </MatrixRow>
          );
        })}
        <Container>
          <h5> Введите вектор b : </h5>
        </Container>
        {matrix.map((row, indexRow = 1) => {
          return (
            <MatrixRow key={indexRow}>
              <input
                key={indexRow}
                type="Number"
                //defaultValue={(indexRow + 1) * 3}
                name={indexRow}
              />
            </MatrixRow>
          );
        })}
        <Container>
          <h5> {"Введите определитель матрицы:"} </h5>

          <Row gutter={50}>
            <label>
              {" "}
              det
              <Col span={2}>
                {" "}
                <input type="Number" value={stDet} onChange={detHandler} />{" "}
              </Col>
            </label>
          </Row>

          <h5> {"Введите миноры:"} </h5>

          {matrix.map((row, indexRow = 1) => {
            return (
              <MatrixCol key={indexRow}>
                {" "}
                <label> delta {indexRow + 1} </label>
                <input
                  key={indexRow}
                  type="text"
                  //defaultValue={0}
                  name={indexRow}
                  // value ={stD1}  onChange={D1Handler}
                />
              </MatrixCol>
            );
          })}

          <h5> {"Введите решение системы:"} </h5>

          {matrix.map((row, indexRow = 1) => {
            return (
              <MatrixCol key={indexRow}>
                {" "}
                <label> x_{indexRow + 1} </label>
                <input
                  key={indexRow}
                  type="text"
                  //defaultValue={0}
                  name={indexRow}
                />
              </MatrixCol>
            );
          })}
        </Container>
        <StyledButton type="submit"> сохранить </StyledButton>
      </form>

      {dispit>0 && (<DetForm dd={dd} delta={delta}  >  </DetForm>)} 
      <Container0>
        <h5>
          {" "}
          {summary} {score} из {max}{" "}
        </h5>
      </Container0>

      {/* <Container0>  {message} </Container0> */}
    </div>
  );
}
export default App;
