// import rawData from './sample.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
const emptyLens = {
  two: null, //   1
  three: null, // 7
  four: null, //  4
  five: [], //    2,3,5
  six: [], //     0,6,9
  seven: null, // 8
}

const part1 = () => {
  const part = 1
  const data = rawData.split('\n').map(l => l.split(' | ').map(m => m.split(' ')))

  let answer = 0
  for (let [r, l] of data) {
    for (let i of l) {
      if ([2, 3, 4, 7].includes(i.length)) answer += 1
    }
  }

  console.log({ part, answer })
}

const part2 = () => {
  const part = 2

  const data = rawData
    .split('\n')
    .map(l => l.split(' | ').map(m => m.split(' ').map(n => n.split(''))))

  function decode(lens, input) {
    switch (input.length) {
      case 2:
        return 1
      case 3:
        return 7
      case 4:
        return 4
      case 5: // 2,3,5
        let three = lens.two.every(i => input.includes(i))
        if (three) return 3

        // five contains the two segments in four that are not in one, two does not
        let bd = lens.four.filter(i => !lens.two.includes(i))
        let five = bd.every(i => input.includes(i))
        return five ? 5 : 2
      case 6: // 0,6,9
        if (lens.two.some(i => !input.includes(i))) return 6

        // nine contains every segment in four, zero does not
        let nine = lens.four.every(i => input.includes(i))
        return nine ? 9 : 0
      case 7:
        return 8
    }
  }

  function all([l, r]) {
    let lens = { ...emptyLens }
    for (let i of l) {
      if ([2, 3, 4, 7].includes(i.length)) lens[numbers[i.length]] = i
      else lens[numbers[i.length]].push(i)
    }

    let output = ''
    for (let i of r) output += decode(lens, i)

    return Number(output)
  }

  const answer = data.reduce((a, i) => a + all(i), 0)

  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
