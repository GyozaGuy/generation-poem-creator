import { defineElement, html, renderOnChange } from 'nwc-utils';
import { translate } from '../../services/translationService';
import './PoemCreator.css';

export default defineElement(
  'poem-creator',
  class extends HTMLElement {
    @renderOnChange
    lookupResult = null;
    @renderOnChange
    poem = '';
    timeout = null;

    render({ lookupResult, poem }) {
      return html`
        <div id="poemCreatorContainer">
          <section>
            <input
              id="poemCreatorInputField"
              oninput=${this.lookupCharacter}
              placeholder="Enter a word to find related Chinese characters"
              type="text"
            />
          </section>

          ${lookupResult &&
            html`
              <section>
                <div id="lookupTerm">
                  <strong>${lookupResult.term.word}</strong>
                  ${lookupResult.term.pronunciation}
                  ${lookupResult.alternates.length
                    ? html`
                        (${lookupResult.alternates.join(', ')})
                      `
                    : null}
                </div>

                <div class="vocabList">
                  ${this.generateVocabList(lookupResult.nouns)}
                  ${this.generateVocabList(lookupResult.verbs)}
                </div>
              </section>
            `}

          <section>
            Adjust your poem:
            <div
              id="poemField"
              onblur=${({ target: { textContent } }) => (this.poem = textContent.trim())}
              contenteditable
            >
              ${poem}
            </div>
          </section>
        </div>
      `;
    }

    generateVocabList(list) {
      return html`
        ${list.map(
          ([chinese, meanings]) => html`
            <div>
              ${chinese.split('').map(
                character => html`
                  <strong class="character" onclick=${this.selectCharacter}>
                    ${character}
                  </strong>
                `
              )}
            </div>
            <span>${meanings}</span>
          `
        )}
      `;
    }

    lookupCharacter = ({ target: { value } }) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        this.lookupResult = await translate(value);
      }, 500);
    };

    selectCharacter = ({ target }) => {
      if (!this.poem) {
        this.poem = '';
      }

      this.poem += target.textContent.trim();
    };
  }
);
