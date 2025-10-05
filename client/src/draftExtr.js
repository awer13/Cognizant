
const onInputIndef2 = (event) => {
    let count = 0;
    var studIndef2 = Array(stDipN).fill("notchosen");
    const stDer2 = Array(stDipN).fill(0);
    for (let i = 0; i < stDipN; i++) {
      stIndef2[i] = (event.target[count].value)
      studIndef2[i] = stIndef2[i];
      count += 1;
    }
    setstIndef2(studIndef2)
}

<form onSubmit={handleSubmit_1}> 
<MatrixRow > 
{stDer2.map((row, indexRow = 1) => {
 return (
   <MatrixRow key={indexRow} >
     <Row gutter={20}>
     <Col span={4}>
     <label > </label> 
     <label > y''(d_{indexRow + 1}) </label> &nbsp;
     </Col >  
     <Col span={25}>
<label>   </label>
<select onChange={onInputIndef2} disabled={disabled} > 
<option value=" def" disabled selected >выберите </option>
<option value="неопределен"> не существует </option>
</select>
<label>   </label>
</Col>
<Col span={2}> <label>   </label>  </Col>
<Col>
<label > </label> 

<Col span={25}> 
<label>  либо введите </label> &nbsp;
</Col >  

<Col span={2}>  <label > </label>  </Col >  
<Col span={2}>
     <input
       key={indexRow}
       type="Number"
       name={indexRow}
       disabled={disabled}
       //onChange={onInputDer2di}
     /> 
      <label>   </label>
      </Col>
    
     </Col>
     <label > </label> 
     </Row> 
   </MatrixRow>
 );
})}

</MatrixRow>


<h4> 1.5 Выберите  либо введите значение(я)  <myh ref={containerDiRef}/>: </h4>

<Row gutter={20}>
    <Col span={5}>
    <label>   </label>
      <select onChange={onInputIndef2} disabled={disabled} > 
      <option value="" disabled selected >выберите </option>
      <option value="не существует"> не существует </option>
      </select>
    </Col>   
    <Col span={3}>
    <label> либо введите </label> 
    </Col>  

    <Col span={4}>
    { /*  <Input  type="Number"  disabled={disabled} /> {" "}  */}
<Input  type="Number" onChange={onInputder2dip} disabled={disabled} /> {" "} 
</Col>
  </Row> 




  <Container> 
      <Container1><h4> Подтвердите отправку введенных ответов: </h4> </Container1>
      
      <Row gutter={20}>
      <label>   </label>
        <Col span={2}>
          {" "}
          <select onChange={onInputAns} disabled={disabled} required > 
          <option value="" disabled selected >подтвердите </option>
          <option  value="подтверждено">  отправить </option>
    </select>
        </Col>
      </Row> 
      </Container>

      <StyledButton type='submit' disabled={disabled} > отправить </StyledButton>

      <StyledButton type='submit' disabled={disabled} > перейти к следующей задаче </StyledButton>
    <StyledButton  type='submit' disabled={disabled} > save </StyledButton>

    <Container> 
      <Container1><h4> Подтвердите сохранение введенных ответов: </h4> </Container1>
      
      <Row gutter={20}>
      <label>   </label>
        <Col span={2}>
          {" "}
          <select onChange={onConfirmed} disabled={disabled} required > 
          <option value="" disabled selected >подтвердите </option>
          <option  value="подтверждено">  сохранить </option>
    </select>
        </Col>
      </Row> 
      </Container>
      
  </form>

    for (let i = 0; i < stDipN; i++) { 
      if ((event.target[count].value)==="")
        stDer2[i]="empty"
     else stDer2[i]=Number(event.target[count].value)
         count += 1;
     }
      console.log("stDer2=",stDer2);
      



    useEffect(() => {
      if (stSpN===1)
        katex.render(`y''(s_1)  `, containerStRef.current);
      else
      katex.render(`y''(s_i),   i=\\overline{1,${stSpN}}   `, containerStRef.current);
      //katex.render(`y''(s)   `, containerStRef.current);
    }, [texExpression2,stSpN]); 

    


const onInputAns = (event) => {
  setstAns(event.target.value)
}

<Container0>       
{ mssg==="1done" && (<table> 
 
  <thead>
<tr>

<th scope="col"> макс, балл  </th>  
<th scope="col">   задачa 1   </th>
<th scope="col"> баллы   </th>
<th scope="col">   задачa 2   </th>
</tr>

</thead>
<tbody>
<tr>  <td> {submax/numq}</td>
<th scope="row"> 1.0  </th>
<td> <stus>{scoreA[0]} </stus> </td>
<th scope="row"> 2.0 </th>

</tr>
<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.1   </th>
<td> <stus> {scoreA[1]}</stus>  </td>
<th scope="row">  2.1  </th>

</tr>
<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.2  </th>
<td> <stus> {scoreA[2]} </stus>  </td>
<th scope="row"> 2.2   </th>

</tr>
<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.3    </th>
<td> <stus> {scoreA[3]} </stus>  </td>
<th scope="row"> 2.3    </th>

</tr>

<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.4   </th>
<td> <stus> {scoreA[4]}  </stus> </td>
<th scope="row"> 2.4   </th>
</tr>

<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.5   </th>
<td> <stus> {scoreA[5]}  </stus> </td>
<th scope="row"> 2.5   </th>
</tr>

<tr>  
<td>{2*submax/numq}</td>
<th scope="row"> 1.6   </th>
<td> <stus> {scoreA[6]}  </stus> </td>
<th scope="row"> 2.6   </th>
</tr>

<tr>  
<td>{submax/numq}</td>
<th scope="row"> 1.7   </th>
<td> <stus> {scoreA[7]}  </stus> </td>
<th scope="row"> 2.7   </th>
</tr>


<tr>  
<td> {submax}  </td>
<th scope="row"> %  </th>
<td> <stus> {Math.round(totalScoreA*100/submax)}  % </stus>  </td>
<th scope="row">    </th>

</tr>

<tr>  
<th>  </th>
<th scope="row">    </th>
<td> <myh>{totalScoreA} </myh> </td>
<th scope="row">   </th>

</tr>

</tbody>
</table> )}

{(mssg==="1done")  && ( <Container0>  <myh> Ваша итоговая оценка  {stScore} балла(/ов) из {max} </myh>    </Container0> )}  


</Container0>

const onConfirmed = (event) => {
  setConfirm(event.target.value)
}

{/*{(mssg==="nbread" || mssg==="1done") && firstTask==="extrln"&&  <Extrln_1 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber} taskStatus={taskStatus} setStatus={setStatus}> </Extrln_1>}
      {(mssg==="1adone" || mssg==="1done") && firstTask==="extrln"&&  <Extrln_2 scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} stSpN={stSpN} setstSpN={setstSpN} setDiPN={setDiPN} stDipN={stDipN} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Extrln_2>}
      {/*{mssg==="nbread" && firstTask==="extrpoly"&&  <Extrpoly scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </Extrpoly>}*/}

      {/*{mssg==="nbread" && firstTask==="polynomform"&&  <PolynomFrom scoreA={scoreA} setScoreA={setScoreA} totalScoreA={totalScoreA} setTotalScoreA={setTotalScoreA} stScore={stScore} setStScore={setStScore}  mssg={mssg} setMessage={setMessage} taskNumber={taskNumber} setTaskNumber={setTaskNumber}> </PolynomFrom>}*/}