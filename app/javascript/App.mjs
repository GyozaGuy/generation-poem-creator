import { defineElement, html } from 'nwc-utils';
import './App.css';
import WordLookup from './components/WordLookup/WordLookup';

export default defineElement(
  'root-app',
  class extends HTMLElement {
    render() {
      return html`
        <div id="wrapper">
          ${WordLookup()}
        </div>
      `;
    }
  }
);
