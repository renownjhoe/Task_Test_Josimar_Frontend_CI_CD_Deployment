// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';


// Check for token in local storage and update Redux state
const token = localStorage.getItem('token');
if (token) {
  store.dispatch({ type: 'auth/login', payload: { token } }); // Update with your login action
}

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);