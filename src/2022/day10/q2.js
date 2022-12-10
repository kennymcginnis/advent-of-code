import data from './input.txt'

const input = data.split('\n').map((l) => l.split(' '))

let cycle = 0
let register = 1
let output = [[], [], [], [], [], []]
let dead = [...Array(240)].map((_, i) => {
  output[Math.floor(i / 40)][i % 40] = '.'
})

const draw = () => {
  let rowcycle = cycle % 40
  const lit = (register - 1) <= rowcycle && rowcycle <= (register + 1)
  // console.log({cycle, register, lit})
  if (lit) output[Math.floor(cycle / 40)][cycle % 40] = '#'
  cycle++
}

input.forEach(([action, value]) => {
  switch (action) {
    case 'addx':
      draw()
      draw()
      register += Number(value)
      break
    case 'noop':
      draw()
      break
    default:
  }
})

console.log(`
${output[0].join('')}
${output[1].join('')}
${output[2].join('')}
${output[3].join('')}
${output[4].join('')}
${output[5].join('')}
`)
