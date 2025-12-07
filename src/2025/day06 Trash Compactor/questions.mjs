import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  const d = input.split('\n')
  const o = d.pop()
  const digits = d.map((r) => r.match(/\S+/g).map(Number))
  const operators = o.match(/\S+/g).map((r) => r.trim())
  let answer = 0

  operators.forEach((operator, i) => {
    let subtotal = operator === '*' ? 1 : 0

    digits.forEach((digitList) => {
      const digit = digitList[i]

      if (operator === '*') {
        subtotal *= digit
      } else {
        subtotal += digit
      }
    })

    answer += subtotal
  })
  return answer
}

const part2 = () => {
  let data = input.split('\n')

  let answer = 0
  let digits = []
  for (let col = data[0].length - 1; col >= 0; col--) {
    let digit = ''
    for (let row = 0; row < data.length - 1; row++) {
      let char = data[row].charAt(col)
      if (char === ' ') char = ''
      digit = `${digit}${char}`
    }
    digits.push(digit)

    const operator = data[data.length - 1].charAt(col)
    if (operator === '*' || operator === '+') {
      let subtotal = operator === '*' ? 1 : 0
      subtotal = digits.reduce((prev, current) => {
        if (operator === '*') {
          return prev * +current
        } else {
          return prev + +current
        }
      }, subtotal)

      answer += subtotal
      digits = []
      col--
    }
  }

  return answer
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
