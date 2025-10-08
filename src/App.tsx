import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MealList from './components/MealList';
import Gallery from './pages/Gallery';
import SurpriseMe from './pages/SurpriseMe';
import MealDetail from './pages/MealDetail';
import ResponsiveAppBar from './components/Navbar';
import { MealProvider } from './context/MealContext';

function App() {
  return (
    <Router basename="/mp2">
      <MealProvider>
        <div className="App">
          <ResponsiveAppBar />
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<MealList />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/surprise" element={<SurpriseMe />} />
            <Route path="/detail/:id" element={<MealDetail />} />
          </Routes>
        </div>
      </MealProvider>
    </Router>
  );
}

export default App;
