import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import NSELoginPage from "./pages/NSELoginPage";
import NSEDashboard from "./pages/NSEDashboard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to NSE login */}
            <Route path="/" element={<Navigate to="/nse-login" replace />} />
            <Route path="/nse-login" element={<NSELoginPage />} />
            <Route path="/mf-login" element={<NSELoginPage />} />
            <Route path="/mutual-funds/*" element={<NSEDashboard />} />
            {/* Catch-all → NSE login */}
            <Route path="*" element={<Navigate to="/nse-login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
