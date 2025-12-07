import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]
const clone = (input) => JSON.parse(JSON.stringify(input))
const print = (board) => {
  console.log('')
  for (let row of board) console.log(row.join(''))
}

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split(''))
}

const part1 = () => {
  let data = parseInput(input)
  let width = data[0].length - 1
  let height = data.length - 1
  let splits = new Set()
  const start = { row: 1, col: 70 } // col: 7 or 70
  console.log(data[start.row][start.col])
  let queue = [start]
  while (queue.length) {
    let { row, col } = queue.shift()
    if (row > height) continue
    switch (data[row][col]) {
      case '.': // down
        data[row][col] = '|'
        queue.push({ row: row + 1, col })
        break
      case '^': // split
        if (col > 0) {
          splits.add([row, col].toString())
          data[row][col - 1] = '|'
          queue.push({ row: row + 1, col: col - 1 })
        }
        if (col < width) {
          splits.add([row, col].toString())
          data[row][col + 1] = '|'
          queue.push({ row: row + 1, col: col + 1 })
        }
        break
      case undefined: // the end
    }
  }
  // print(data)
  return splits.size
}

const part2 = () => {
  let data = input.split('\n')
  const beams = new Array(data[0].length).fill(0)
  beams[data[0].indexOf('S')] = 1
  for (const row of data.slice(1)) {
    let split = row.indexOf('^', 0)
    while (split >= 0) {
      if (beams[split] > 0) {
        beams[split + 1] += beams[split]
        beams[split - 1] += beams[split]
        beams[split] = 0
      }
      split = row.indexOf('^', split + 1)
    }
  }
  return beams.reduce((acc, time) => acc + time, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
