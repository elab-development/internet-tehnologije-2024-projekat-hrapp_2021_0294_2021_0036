import { Routes, Route, Navigate } from 'react-router-dom';

import Register           from './komponente/Register';
import Login              from './komponente/Login';
import Home               from './komponente/Home';

import ProtectedRoute     from './komponente/ProtectedRoute';
import ProtectedLayout    from './komponente/ProtectedLayout';

import PerformanceReviewsEmployee    from './komponente/employee/PerformanceReviewsEmployee';
import PerformanceReviewsHrWorker    from './komponente/hr_worker/PerformanceReviewsHrWorker';

import AdminDashboard        from './komponente/administrator/AdminDashboard';
import ViewUsers from './komponente/administrator/ViewUsers';

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
      <Route
        path="/leave-requests"
        element={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              textAlign: 'center'
            }}
          >
            <h1>ZA PROJEKAT POSLE!</h1>
            <img
              src="https://images.pexels.com/photos/211122/pexels-photo-211122.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Placeholder"
              style={{ maxWidth: '80%', height: 'auto', marginTop: '1rem' }}
            />
          </div>
        }
      />
         <Route
          path="/performance-reviews"
          element={<PerformanceReviewsEmployee />}
        />
        <Route
          path="/performance-reviews-hr"
          element={<PerformanceReviewsHrWorker />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/view-users"
          element={<ViewUsers />}
        />
        {/* Redirect any unmatched protected path back to /home */}
        <Route path="*"                        element={<Navigate to="/home" replace />} />
      </Route>

      {/* Fallback: if no route matched above, send to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
