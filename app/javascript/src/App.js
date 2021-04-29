import { defineElement, html } from 'nwc-utils';
import './app.css';

export default defineElement(
  'root-app',
  class RootApp extends HTMLElement {
    render() {
      return html`
        <input type="text" />
      `;
    }
  }
);
