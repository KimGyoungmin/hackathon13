import React from 'react';
import { AppProvider } from './contexts/AppContext.jsx';
import Header from './components/Header/Header';
import MainLayout from './components/MainLayout/MainLayout';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Header />
        <MainLayout />
      </div>
    </AppProvider>
  );
}

export default App;
