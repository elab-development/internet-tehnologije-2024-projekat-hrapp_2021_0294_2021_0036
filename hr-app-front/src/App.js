import { Routes, Route, Navigate } from 'react-router-dom';

import Register           from './komponente/Register';
import Login              from './komponente/Login';
import Home               from './komponente/Home';

import ProtectedRoute     from './komponente/ProtectedRoute';
import ProtectedLayout    from './komponente/ProtectedLayout';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/"         element={<Login />}    />

      {/* All protected pages share the sidebar/layout */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home"                   element={<Home />} />
        <Route path="/leave-requests"         element={<div></div>} />
        <Route path="/performance-reviews"    element={<div></div>} />
        {/* Redirect any unmatched protected path back to /home */}
        <Route path="*"                        element={<Navigate to="/home" replace />} />
      </Route>

      {/* Fallback: if no route matched above, send to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
