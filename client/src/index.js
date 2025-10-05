import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
//import Ncssr_1 from './Ncssr_1'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)



/*added by me from here
ReactDOM.render(
  <React.StrictMode>
      <Ncssr_1 />
  </React.StrictMode>,
  document.getElementById('root')
);
*/


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
