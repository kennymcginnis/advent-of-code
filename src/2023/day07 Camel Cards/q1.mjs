import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let sort = { A: '14', K: '13', Q: '12', J: '11', T: '10' }
let sorting = (v) => sort[v] || '0' + v

const parseInput = (input) => {
  return input.split('\n').map((r) => {
    let [cards, b] = r.split(' ')
    return { cards, hand: cards.split(''), bid: +b }
  })
}

const part1 = () => {
  let data = parseInput(input)
  for (let row of data) {
    row.map = row.hand.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {})
    row.score = Object.values(row.map).sort((a, b) => b - a)[0] * 10
    if (row.score === 20) {
      // Two pair
      if (Object.keys(row.map).length === 3) row.score += 5
    } else if (row.score === 30) {
      // Full house
      if (Object.keys(row.map).length === 2) row.score += 5
    }
    row.sorter = row.score + row.hand.map((a) => sorting(a)).join('')
  }
  data.sort((a, b) => b.sorter - a.sorter)
  return data.reduce((a, c, i) => a + c.bid * (data.length - i), 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
