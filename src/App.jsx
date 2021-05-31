import React, { useEffect, useState } from 'react'
import {BrowserRouter,Switch,Route, HashRouter, Redirect} from 'react-router-dom'
import Home from './Home.jsx'
import Room from './Room.jsx'
import './App.css'

//const roomnumber=React.createContext("")

const App=function(){
   
return(
    <HashRouter basename='/chat'>
        <Switch>
            <Route exact path='/' component={Home} >
            

            </Route>
            <Route default><Redirect to="/"></Redirect></Route>
        </Switch>
    </HashRouter>
)
}
export default App