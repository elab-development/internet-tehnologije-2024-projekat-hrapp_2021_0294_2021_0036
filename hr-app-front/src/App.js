import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Register from './komponente/Register';
import Login    from './komponente/Login';

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/"    element={<Login />} />

    </Routes>
  );
}

export default App;
