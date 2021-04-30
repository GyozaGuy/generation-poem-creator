import { defineElement, html } from 'nwc-utils';
import './App.css';
import PoemCreator from './components/PoemCreator/PoemCreator';

export default defineElement(
  'root-app',
  class extends HTMLElement {
    render() {
      return html`
        <div id="wrapper">
          ${PoemCreator()}
        </div>
      `;
    }
  }
);
