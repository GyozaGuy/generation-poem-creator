import { mountApp } from 'nwc-utils';
import App from './src/App';

document.addEventListener('turbolinks:load', () => {
  mountApp(App, document.body.querySelector('#root'));
});
