import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((row) => row.split(''))

const print = (input) => console.log(input.map((row) => row.join('')).join('\n'))

const part1 = () => {
  let data = parseInput(input)

  let invert = Array(data[0].length)
    .fill()
    .map(() => Array(data.length))

  for (let row in data) {
    for (let col in data[row]) {
      invert[col][row] = data[row][col]
    }
  }

  let answer = 0
  for (let row of invert) {
    let sorted = row
      .join('')
      .split('#')
      .map((row) =>
        row
          .split('')
          .sort((a, b) => (b === 'O' ? 1 : -1))
          .join(''),
      )
      .join('#')
      .split('')

    sorted.forEach((value, index) => {
      if (value === 'O') answer += sorted.length - index
    })
  }

  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
