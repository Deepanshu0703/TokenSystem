import React from 'react';
import Dashboard from './Dashboard';
import CurrentToken from './CurrentToken';
import { BrowserRouter as Router, Routes,Route,  } from 'react-router-dom';

function App() {

  return (
<Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/current-token" element={<CurrentToken />}/>
        <Route path="*" element={<h1>404 Not Found</h1>}/>
      </Routes>
    </Router>
  )};

export default App;