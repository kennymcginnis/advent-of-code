import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const [top, bottom] = input.split('\n\n')
const patterns = top.split(', ')
const display = bottom.split('\n')

const part1 = () => {
  let memo = new Map()
  function isPatternPossible(design) {
    if (design === '') return true
    if (memo.has(design)) {
      return memo.get(design)
    }
    for (const pattern of patterns) {
      if (pattern.length > design.length) continue
      if (pattern[0] !== design[0]) continue
      if (design.startsWith(pattern)) {
        const remaining = design.slice(pattern.length)
        if (isPatternPossible(remaining, memo)) {
          memo.set(design, true)
          return true
        }
      }
    }
    memo.set(design, false)
    return false
  }
  return display.filter((row) => isPatternPossible(row, memo)).length
}

const part2 = () => {
  let memo = new Map()
  function patternCount(design) {
    if (design === '') return 1
    if (memo.has(design)) {
      return memo.get(design)
    }
    let count = 0
    for (const pattern of patterns) {
      if (pattern.length > design.length) continue
      if (pattern[0] !== design[0]) continue
      if (design.startsWith(pattern)) {
        const remaining = design.slice(pattern.length)
        count += patternCount(remaining, memo)
      }
    }
    memo.set(design, count)
    return count
  }
  return display.reduce((acc, row) => acc + patternCount(row), 0)
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
