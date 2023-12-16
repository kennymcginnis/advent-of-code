import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split(',').map((step) => {
    const [, label, action, lens] = step.match(/([a-z]+)([\-=])(\d?)/)
    return {
      label,
      action,
      lens: Number(lens),
      box: hash(label),
    }
  })

function hash(s) {
  let cur_val = 0
  for (let i = 0; i < s.length; ++i) {
    cur_val += s.charCodeAt(i)
    cur_val *= 17
    cur_val %= 256
  }
  return cur_val
}

const part2 = () => {
  let data = parseInput(input)
  let hashmap = Array(256)

  for (let { label, action, lens, box } of data) {
    let found = -1
    if (!hashmap[box]) hashmap[box] = []
    if (hashmap[box].length > 0) {
      found = hashmap[box].findIndex((e) => e.label === label)
    }
    if (found > -1) {
      switch (action) {
        case '=':
          hashmap[box][found].lens = lens
          break
        case '-':
          hashmap[box].splice(found, 1)
          break
      }
    } else {
      switch (action) {
        case '=':
          hashmap[box].push({ label: label, lens: lens })
          break
      }
    }
  }

  let answer = 0
  for (let box = 0; box < 256; box++) {
    if (hashmap[box]) {
      for (let index = 0; index < hashmap[box].length; index++) {
        answer += (box + 1) * (index + 1) * hashmap[box][index].lens
      }
    }
  }

  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
