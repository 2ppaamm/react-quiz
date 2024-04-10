import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react'; // Import the Auth0 React wrapper

// Auth0 configuration details
const domain = "pamelalim.auth0.com";
const clientId = "x0AAlKqaQ8Zw6YF4kdMzTE08oAXjIhGJ";
const audience = "https://mathapi.allgifted.com";

// Creating the root element with React 18's new root API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      audience={audience}
      scope="openid profile email">
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// Call to report web vitals (performance measurements). If you're not using this functionality, it can be removed.
reportWebVitals();