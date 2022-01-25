import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import AuthenticationContextProvider from './Context/AuthenticationContext';

ReactDOM.render(
  <React.StrictMode>
      <AuthenticationContextProvider>
        <App />
    </AuthenticationContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

