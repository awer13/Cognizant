import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
//import Main from './Main'
//import MainMiniMax from './MainMiniMax' //one variable func
//import MainLimit from './MainLimit'
import MainExtremum from './MainExtremum'
//import MainSeries from './MainSeries'
//import MainSLAE from './MainSLAE'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',

     //element: <MainSeries />,  //  Anuar's version
     //element: <MainSLAE />,  //  added by me
      element: <MainExtremum />, //  added by me
      //element: <Main />, //  added by me
     // element: <MainLimit />, //  added by me
     // element: <MainMiniMax />, //  added by me
      children: [ ],
    },
    {
      //path: '/MainLimit',
      //path: '/main',
      //path: '/mainSLA',
      //path: '/mainSer',
      //path: '/mainExtr',
      //path: '/mainEx',
      element: <MainExtremum />, // disabled by me on march 20
      //element: <MainSLAE />,
      //element: <MainSeries />,
      //element: <Main />,
      //element: <MainMiniMax />,
      //element: <MainLimit />,
      children: [
        // {
        //   path: 'dashboard',
        //   element: <Main />,
        // }
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App


