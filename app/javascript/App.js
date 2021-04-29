import { defineElement, html } from 'nwc-utils';
import './app.css';

export default defineElement(
  'root-app',
  class extends HTMLElement {
    render() {
      return html`
        <input type="text" />
      `;
    }
  }
);
