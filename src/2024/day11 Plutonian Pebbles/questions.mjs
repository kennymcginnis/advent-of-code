import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let data = input.split(' ')
  for (let blink = 0; blink < 25; blink++) {
    data = data
      .map((stone) => {
        if (stone === '0') return '1'
        if (stone.length % 2 === 0) {
          let half = stone.length / 2
          return [stone.slice(0, half), Number(stone.slice(half)).toString()]
        }
        return (+stone * 2024).toString()
      })
      .flat()
  }

  return data.length
}

const part2 = () => {
  let data = input.split(' ').map(Number)
  const cache = new Map()

  const blink = (number, blinks) => {
    const cacheKey = `${number}-${blinks}`
    if (cache.has(cacheKey)) return cache.get(cacheKey)

    let result
    if (blinks === 0) result = 1
    else if (number === 0) result = blink(1, blinks - 1)
    else if (('' + number).length % 2 === 0) {
      const str = '' + number
      const firstHalf = +str.substring(0, str.length / 2)
      const secondHalf = +str.substring(str.length / 2)
      result = blink(firstHalf, blinks - 1) + blink(secondHalf, blinks - 1)
    } else {
      result = blink(number * 2024, blinks - 1)
    }

    cache.set(cacheKey, result)
    return result
  }

  return data.reduce((agg, cur) => agg + blink(cur, 75), 0)
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
