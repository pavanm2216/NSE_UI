import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NSEDashboard from './pages/dashboard/NSEDashboard';
import NSELoginPage from './pages/auth/NSELoginPage';
import './index.css';
createRoot(document.getElementById('root')!).render(<BrowserRouter><Routes><Route path="/mf-login" element={<Navigate to="/nse-login" replace/>}/><Route path="/nse-login" element={<NSELoginPage showOtherOptions={false}/>}/><Route path="/nse-dashboard/*" element={<NSEDashboard/>}/><Route path="*" element={<Navigate to="/nse-dashboard" replace/>}/></Routes></BrowserRouter>);
