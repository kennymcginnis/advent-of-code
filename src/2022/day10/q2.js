import data from './sample2.txt'

const input = data.split('\n').map((l) => l.split(' '))

console.log({input})

let cycle = 1
let register = 1
let output = [[], [], [], [], [], []]

const draw = () => {
  cycle++
  output[Math.floor(cycle / 40)][cycle % 40] = '.'
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
`)
