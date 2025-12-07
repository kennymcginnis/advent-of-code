import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  const [ranges, ids] = input.split('\n\n')
  const fresh = ranges.split('\n').map((range) => range.split('-').map(Number))
  const available = ids.split('\n').map(Number)
  let answer = 0
  for (let id of available) {
    for (let [start, end] of fresh) {
      if (id >= start && id <= end) {
        answer++
        break
      }
    }
  }
  return answer
}

const part2 = () => {
  const [ranges] = input.split('\n\n')
  const intervals = ranges
    .split('\n')
    .map((range) => range.split('-').map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])

  const merged = intervals.splice(0, 1)
  for (const [start, end] of intervals) {
    if (start > merged[merged.length - 1][1]) merged.push([start, end])
    if (end > merged[merged.length - 1][1]) merged[merged.length - 1][1] = end
  }
  return merged.reduce((sum, [start, end]) => sum + end - start + 1, 0)
}

// modify Number to add an isBetween method
Number.prototype.isBetween = function (start, end) {
  return this >= start && this <= end
}

// is number between
const isBetween = (num, start, end) => num >= start && num <= end

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2() // 352556672963116
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
