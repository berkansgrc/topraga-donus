import React from 'react';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AppRoutes } from './routes';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <ScrollToTop />
        <AppRoutes />
      </Layout>
    </ToastProvider>
  );
}

export default App;