import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '2rem' }}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;