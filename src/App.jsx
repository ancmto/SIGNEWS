import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { themeConfig } from '@/components/common/theme';
import { AuthProvider } from '@/components/common/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;