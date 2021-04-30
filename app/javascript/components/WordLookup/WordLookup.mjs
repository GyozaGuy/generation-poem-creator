import { defineElement, html, renderOnChange } from 'nwc-utils';
import { translate } from '../../services/translationService';
import './WordLookup.css';

export default defineElement(
  'word-lookup',
  class extends HTMLElement {
    @renderOnChange
    lookupResult = [];
    timeout = null;

    lookupCharacter = ({ target: { value } }) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        this.lookupResult = await translate(value);
        console.log(this.lookupResult);
      }, 500);
    };

    render({ lookupResult }) {
      return html`
        <input
          id="wordLookupInputField"
          oninput=${this.lookupCharacter}
          placeholder="Type to lookup a Chinese character"
          type="text"
        />
        <div>
          <strong>${lookupResult?.term?.word}</strong>
          ${lookupResult?.term?.pronunciation}
        </div>
        <div class="vocabList">
          ${lookupResult?.nouns?.map(
            ([chinese, meanings]) => html`
              <strong>${chinese}:</strong>
              <span>${meanings}</span>
            `
          )}
        </div>
      `;
    }
  }
);
