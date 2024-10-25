import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Control from './components/Control';
import Display from './components/Display';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Control />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </Router>
  );
};

export default App;