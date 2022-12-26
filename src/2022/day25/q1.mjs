// import input from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const MAX_SNAFU = 100
const RADIX = 5

const parseInput = () => input.split('\n').map(r => r.split(''))

const translate = {
  '=': -2,
  '-': -1,
  0: 0,
  1: 1,
  2: 2,
}

const uglify = {
  '-2': '=',
  '-1': '-',
  0: 0,
  1: 1,
  2: 2,
}

const decrypt = snafu => {
  let input = [...snafu].reverse()
  let output = input.reduce((a, c, i) => a + 5 ** i * translate[c], 0)
  console.log({ input: snafu.join(''), output })
  return output
}

const encrypt = input => {
  let output = []

  while (input) {
    let remainder = input % 5
    switch (remainder) {
      case 0:
        output.push('0')
        break
      case 1:
        output.push('1')
        break
      case 2:
        output.push('2')
        break
      case 3:
        output.push('=')
      input += 2
        break
      case 4:
        output.push('-')
        input += 1
        break
    }

    input = Math.floor(input / 5)
  }

  return output.reverse().join('')
}

const part1 = () => {
  let input = parseInput()
  let output = input.reduce((a, c) => a + decrypt(c), 0)
  let answer = encrypt(output)
  console.log({ output, answer })
}

timingMonitor()
part1()
console.log(timingMonitor())
