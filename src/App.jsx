import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateHangout from './pages/CreateHangout';
import HangoutDetails from './pages/HangoutDetails';

function App() {
  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<CreateHangout />} />
          <Route path="/hang/:id" element={<HangoutDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
