export function translate(term) {
  return getJson(`/lookup?term=${term}`);
}

async function getJson(path) {
  const response = await fetch(path);
  return response.json();
}
