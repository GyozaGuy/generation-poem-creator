import { defineElement, html, renderOnChange } from 'nwc-utils';
import { getPinyin, translate } from '../../services/translationService';
import './PoemCreator.css';

export default defineElement(
  'poem-creator',
  class extends HTMLElement {
    @renderOnChange
    lookupResult = null;
    @renderOnChange
    pinyin = '';
    @renderOnChange
    poem = '';
    @renderOnChange
    poemFontSize = 48;
    timeout = null;

    async propChanged(name, value) {
      if (name === 'poem' && value) {
        this.pinyin = (await getPinyin(value)).pinyin;
      }
    }

    render({ lookupResult, pinyin, poem, poemFontSize }) {
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

                <p>Click a character to add it to your poem:</p>

                <div class="vocabList">
                  ${this.generateVocabList(lookupResult.nouns)}
                  ${this.generateVocabList(lookupResult.verbs)}
                </div>
              </section>
            `}

          <section id="displayControls">
            Font size:
            <input
              max="200"
              min="10"
              oninput=${({ target: { value } }) => {
                this.poemFontSize = value;
              }}
              type="range"
              value="${this.poemFontSize}"
            />
          </section>

          <section>
            <div id="poemPronunciation">${pinyin}</div>
            <div
              id="poemField"
              onblur=${({ target: { textContent } }) => (this.poem = textContent.trim())}
              style="--font-size: ${poemFontSize}px"
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
