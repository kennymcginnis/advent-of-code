import data from './input.txt'

const input = data.split('\n').map((l) => l.split(' '))

console.log({input})

let cycle = 1
let register = 1

let output = {
  20: true,
  60: true,
  100: true,
  140: true,
  180: true,
  220: true
}

input.forEach(([action, value]) => {
  switch (action) {
    case 'addx':
      cycle += 2
      register += Number(value)
      break
    case 'noop':
      cycle += 1
      break
    default:
  }

  // console.log({cycle, register})
  if (output[cycle]) {
    output[cycle] = cycle * register
  } else if (output[cycle + 1]) {
    output[cycle + 1] = (cycle + 1) * register
  }
})

console.log({output})

const answer = Object.keys(output).reduce((acc, curr) => acc + output[curr], 0);

console.log({answer})
