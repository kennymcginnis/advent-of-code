import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  let distances = {}
  input.split('\n').forEach((r) => {
    //London to Dublin = 464
    let [_, from, to, distance] = [...r.matchAll(/(\w*)\sto\s(\w*)\s=\s(\d*)/g)][0]
    if (!distances[from]) distances[from] = { [to]: Number(distance) }
    else distances[from][to] = Number(distance)
    if (!distances[to]) distances[to] = { [from]: Number(distance) }
    else distances[to][from] = Number(distance)
  })
  return distances
}
const part1 = (data) => {
  const city_count = Object.keys(data).length
  let answer = Infinity

  for (let start of Object.keys(data)) {
    let queue = [{ current: start, traveled: 0, path: [start], formatted: [start] }]
    while (queue.length) {
      let { current, traveled, path, formatted } = queue.shift()
      if (path.length === city_count) {
        answer = Math.min(answer, traveled)
        console.log(formatted.join(''))
        break
      }
      Object.keys(data[current]).forEach((neighbor) => {
        queue.push({
          current: neighbor,
          traveled: traveled + data[current][neighbor],
          path: [...path, neighbor],
          formatted: [
            ...formatted,
            ` -> ${data[current][neighbor]}(${traveled + data[current][neighbor]}) -> ${neighbor}`,
          ],
        })
      })
    }
  }
  return answer // < 210
}

const part2 = (data) => {
  return
}

const run = () => {
  let data = parseInput(sample)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
