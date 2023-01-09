import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  const splitter = /(\d+)-(\d+)\s(\w):\s(\w+)/g
  let [fields, yours, others] = input.split('\n\n')

  let valid = Array(1000)
  fields = fields.split('\n').map(line => {
    let [, section, lmin, lmax, rmin, rmax] = /(.+): (\d+)-(\d+) or (\d+)-(\d+)/.exec(line)

    for (let i = +lmin; i <= +lmax; i++) valid[i] = true
    for (let i = +rmin; i <= +rmax; i++) valid[i] = true

    return { section, lmin: +lmin, lmax: +lmax, rmin: +rmin, rmax: +rmax }
  })

  others = others.split('\n')
  others.shift()
  others = others.map(r => r.split(',').map(Number))

  yours = yours.split('\n')[1].split(',').map(Number)

  return { valid, fields, yours, others }
}

const transpose = others => {
  let columns = Array.from({ length: others[0].length }, () => Array(others.length))
  for (let row in others) {
    for (let col in others[0]) {
      columns[col][row] = others[row][col]
    }
  }
  return columns
}

const part1 = ({ valid, others }) => {
  let invalid = []
  for (let person of others) {
    for (let num of person) {
      if (!valid[num]) invalid.push(num)
    }
  }

  return invalid.reduce((a, c) => ((a += c), a), 0)
}

const part2 = ({ valid, fields, yours, others }) => {
  others = others.filter(person => person.every(num => valid[num]))

  let columns = transpose(others)

  let mapped = {}
  while (Object.keys(mapped).length !== columns.length) {
    for (let { section, lmin, lmax, rmin, rmax } of fields) {
      let lastViable
      let viable = columns.filter((col, c) => {
        if (col && col.every(c => (lmin <= c && c <= lmax) || (rmin <= c && c <= rmax))) {
          lastViable = c
          return true
        }
        return false
      })
      if (viable.length === 1) {
        mapped[section] = lastViable
        columns[lastViable] = null
      }
    }
  }

  let departures = [
    'departure location',
    'departure station',
    'departure platform',
    'departure track',
    'departure date',
    'departure time',
  ]
  return departures.reduce((a, c) => {
    a *= yours[mapped[c]]
    return a
  }, 1)
}

const run = () => {
  let data = parseInput(input)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
