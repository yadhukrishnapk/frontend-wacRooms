import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';
import Header from './componets/Header/Header';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <Provider>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;
