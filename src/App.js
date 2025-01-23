import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ManageCards from './components/ManageCards';
import Top10 from './components/Top10';
import ViewExpenses from './components/ViewExpenses';

import './styles/App.css';

function App() {
  // const user = { firstName: 'User', lastName: 'Example' };
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/managecards" element={<ManageCards />} />
          <Route path="/viewexpenses" element={<ViewExpenses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;