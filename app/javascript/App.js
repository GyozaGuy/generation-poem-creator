import { defineElement, html } from 'nwc-utils';
import './App.css';

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
