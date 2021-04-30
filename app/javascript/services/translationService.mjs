export function translate(term) {
  if (term) {
    return getJson(`/lookup?term=${term}`);
  }

  return;
}

async function getJson(path) {
  const response = await fetch(path);
  return response.json();
}
