const localStorage = {}

export async function fetchInput(day) {
  const headers = new Headers({
    'User-Agent': 'github.com/yolocheezwhiz/adventofcode/',
  })
  const now = Date.now()
  localStorage[day] =
    localStorage[day] ||
    (
      await (
        await fetch('https://adventofcode.com/' + day + '/input', {
          headers: headers,
        })
      ).text()
    ).trim()
  const startTime = Date.now()
  return localStorage[day]
}
