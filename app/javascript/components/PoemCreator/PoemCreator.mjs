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
              placeholder="Type to lookup a Chinese character"
              type="text"
            />
          </section>

          ${lookupResult &&
            html`
              <section>
                <div id="lookupTerm">
                  <strong>${lookupResult.term.word}</strong>${lookupResult.term.pronunciation}
                </div>

                <div class="vocabList">
                  ${lookupResult.nouns.map(
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
                </div>
              </section>
            `}

          <section>
            Adjust your poem:
            <div id="poemField" contenteditable>${poem}</div>
          </section>
        </div>
      `;
    }

    lookupCharacter = ({ target: { value } }) => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        this.lookupResult = await translate(value);
        console.log(this.lookupResult);
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
