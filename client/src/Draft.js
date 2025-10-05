


<div class="dropdown">
             <button id="myBtn" class="dropbtn">Dropdown</button>
  <div id="myDropdown" class="dropdown-content">
    <a href="#1">Вещественные числа введите в виде десятичной дроби;</a>
    <a href="#2">В качестве разделителя целой и дробной частей числа рекомендуется использовать точку (не запятую);</a>
    <a href="#3">Десятичную дробь введите с точностью до 3-х знаков после запятой;</a>
    <a href="#4">Изменения, внесенные после подтверждения отправки ответов, не сохраняются</a>
  </div>
  document.getElementById("myBtn").onclick = function() {myFunction()};
  </div>

<form>
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
  </form>





export default ReadNote
