import sample from './sample.mjs'
import second from './second-sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  return input.split('\n').map(line => {
    if (line.includes('mask')) {
      let [, mask] = /mask = (.+)$/.exec(line)
      return { mask }
    } else {
      let [, address, value] = /mem\[(\d+)\] = (\d+)/.exec(line).map(Number)
      return { address, value }
    }
  })
}

const intToPaddedBinary = (int, pad) => int.toString(2).padStart(pad, '0')
const applyMaskToBinary = (mask, binary) => {
  let output = [...binary]
  ;[...mask].forEach((char, c) => {
    if (char !== 'X') output[c] = char
  })
  return output.join('')
}
const parseMaskedBinary = (mask, value) =>
  parseInt(applyMaskToBinary(mask, intToPaddedBinary(value, 36)), 2)

const part1 = () => {
  let data = parseInput(input)

  let memory = {}
  let currentMask
  for (let { mask, address, value } of data) {
    if (mask) {
      currentMask = mask
      continue
    }
    memory[address] = parseMaskedBinary(currentMask, value)
  }

  return Object.values(memory).reduce((a, c) => ((a += c), a), 0)
}

const floatingBinary = (mask, binary) => {
  let masked = [...binary]
  ;[...mask].forEach((char, c) => {
    if (char !== '0') masked[c] = char
  })
  let output = []
  let queue = [masked[0]]

  while (queue.length) {
    let curr = queue.shift()
    let next = masked[curr.length]
    if (curr.length === masked.length) {
      output.push(curr.join(''))
      continue
    }
    if (next === 'X') {
      queue.push([...curr, 0])
      queue.push([...curr, 1])
    } else {
      queue.push([...curr, next])
    }
  }
  return output
}

const part2 = () => {
  let data = parseInput(input)
  let memory = {}
  let currentMask
  for (let { mask, address, value } of data) {
    if (mask) {
      currentMask = mask
      continue
    }
    floatingBinary(currentMask, intToPaddedBinary(address, 36))
      .map(a => parseInt(a, 2))
      .forEach(addr => (memory[addr] = value))
  }

  return Object.values(memory).reduce((a, b) => a + b, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2() // > 3133536444279
  console.log({ part: 2, answer, time: timingMonitor() })
}

const test = () => {
  const eleven = intToPaddedBinary(11, 36)
  assertEquals('000000000000000000000000000000001011', eleven)
  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'
  assertEquals('000000000000000000000000000001001001', applyMaskToBinary(mask, eleven))

  const fourtyTwo = intToPaddedBinary(42, 36)
  assertEquals('000000000000000000000000000000101010', fourtyTwo)
  mask = '000000000000000000000000000000X1001X'
  let expected = [
    '000000000000000000000000000000011010',
    '000000000000000000000000000000011011',
    '000000000000000000000000000000111010',
    '000000000000000000000000000000111011',
  ]
  assertEquals(JSON.stringify(expected), JSON.stringify(floatingBinary(mask, fourtyTwo)))
}

// test()
run()
