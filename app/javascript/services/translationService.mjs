export function getPinyin(poem) {
  if (poem) {
    return getJson(`/pinyin?poem=${poem}`);
  }

  return;
}

export function translate(term, characterSet) {
  if (term) {
    return getJson(`/lookup?term=${term}&mode=${characterSet}`);
  }

  return;
}

async function getJson(path) {
  const response = await fetch(path);
  return response.json();
}
