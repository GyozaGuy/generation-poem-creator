import { defineElement, html, renderOnChange } from 'nwc-utils';
import { getPinyin, translate } from '../../services/translationService';
import './PoemCreator.css';

export default defineElement(
  'poem-creator',
  class extends HTMLElement {
    @renderOnChange backgroundImage = null;
    @renderOnChange containerHeight = 700;
    @renderOnChange containerWidth = 1000;
    @renderOnChange lookupResult = null;
    @renderOnChange pinyin = '';
    @renderOnChange poem = '';
    @renderOnChange poemFontSize = 48;
    @renderOnChange textColor = '#000000';
    @renderOnChange textShadowColor = '#ffffff';
    timeout = null;

    async propChanged(name, value) {
      if (name === 'poem' && value) {
        this.pinyin = (await getPinyin(value)).pinyin;
      }
    }

    render({
      backgroundImage,
      containerHeight,
      containerWidth,
      lookupResult,
      pinyin,
      poem,
      poemFontSize,
      textColor,
      textShadowColor
    }) {
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
            <div>
              <h3>Text settings</h3>

              Size:
              <input
                max="200"
                min="10"
                oninput=${({ target: { value } }) => (this.poemFontSize = value)}
                type="range"
                value="${this.poemFontSize}"
              />

              Color:
              <input
                oninput=${({ target: { value } }) => (this.textColor = value)}
                type="color"
                value="${textColor}"
              />

              Shadow:
              <input
                oninput=${({ target: { value } }) => (this.textShadowColor = value)}
                type="color"
                value="${textShadowColor}"
              />
            </div>

            <div>
              <h3>Container settings</h3>
              Height:
              <input
                max="1000"
                min="100"
                oninput=${({ target: { value } }) => (this.containerHeight = value)}
                type="range"
                value="${this.containerHeight}"
              />

              Width:
              <input
                max="1000"
                min="100"
                oninput=${({ target: { value } }) => (this.containerWidth = value)}
                type="range"
                value="${this.containerWidth}"
              />

              Background:
              <select onchange=${({ target: { value } }) => (this.backgroundImage = value)}>
                <option value="">None</option>
                <option value="Fan">Fan</option>
                <option value="Fruit">Fruit</option>
                <option value="Lanterns">Lanterns</option>
                <option value="Temple">Temple</option>
                <option value="Tiger">Tiger</option>
              </select>
            </div>
          </section>

          <section>
            <div id="poemPronunciation">${pinyin}</div>
            <div
              id="poemContainer"
              style="
                ${backgroundImage
                ? `--background-image: url(/backgrounds/${backgroundImage}.jpg);`
                : ''}
                --container-height: ${containerHeight}px;
                --container-width: ${containerWidth}px
              "
            >
              <div
                id="poemField"
                onblur=${({ target: { textContent } }) => (this.poem = textContent.trim())}
                style="
                  --font-size: ${poemFontSize}px;
                  --text-color: ${textColor};
                  --text-shadow-color: ${textShadowColor};
                "
                contenteditable
              >
                ${poem}
              </div>
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
