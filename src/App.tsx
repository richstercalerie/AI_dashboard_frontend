import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { store } from './redux/store';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CrmModule from './pages/CrmModule';
import ChurnPrediction from './pages/ChurnPrediction';
import ShapAnalysis from './pages/ShapAnalysis';
import BehaviorTracker from './pages/BehaviorTracker';
import KanbanBoard from './pages/KanbanBoard';
import Settings from './pages/Settings';
import CustomerDetails from './pages/CustomerDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="crm" element={<CrmModule />} />
                <Route path="crm/:customerId" element={<CustomerDetails />} />
                <Route path="churn-prediction" element={<ChurnPrediction />} />
                <Route path="shap-analysis" element={<ShapAnalysis />} />
                <Route path="behavior-tracker" element={<BehaviorTracker />} />
                <Route path="kanban" element={<KanbanBoard />} />
                <Route path="settings" element={
  <ProtectedRoute requireAdmin>
    <Settings />
  </ProtectedRoute>
} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;