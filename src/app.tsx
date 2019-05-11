import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import App from './App/App';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './App/i18n';

const app = (
  <AsyncComponentProvider>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </AsyncComponentProvider>
);

asyncBootstrapper(app).then(() => {
  ReactDOM.render(app, document.getElementById('root'));
});
