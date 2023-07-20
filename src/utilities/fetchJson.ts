export async function fetchJson(url: string) {
  return (
    fetch(url)
      .then((r) => r.json())
      // eslint-disable-next-line no-console
      .catch(console.error)
  )
}
