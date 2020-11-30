import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MuffleParent from './Components/MuffleParent'

function App() {
  return (
    <Router>
      <MuffleParent></MuffleParent>
    </Router>
  );
}

export default App;
