// import rawData from './sample1.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

class Packet {
  constructor({ version, typeId }) {
    this.version = version
    this.typeId = typeId
    this.packets = []
  }
}

const base16toBinary = base16 =>
  [...base16].map(n => parseInt(n, 16).toString(2).padStart(4, '0')).join('')

const parsePackets = (input, totalSubPackets = -1) => {
  const packets = []
  let totalPackets = 0
  const startInputSize = input.length

  function shift(length, parse) {
    let output = input.substring(0, length)
    input = input.substring(length)
    return parse ? parseInt(output, 2) : output
  }

  while (input.length && (totalSubPackets < 0 || totalPackets < totalSubPackets)) {
    if (/^0+$/.test(input)) {
      // Only zeros, most likely due to padding
      break
    }
    totalPackets++
    const version = shift(3, true)
    const typeId = shift(3, true)
    const packet = new Packet({ version, typeId })
    if (typeId === 4) {
      let binaryString = ''
      let startsWithOne = shift(1) === '1'
      while (startsWithOne) {
        binaryString += shift(4)
        startsWithOne = shift(1) === '1'
      }
      binaryString += shift(4)
      packet.value = parseInt(binaryString, 2)
    } else {
      const lengthTypeId = shift(1)
      if (lengthTypeId === '0') {
        const length = shift(15, true)
        const subPackets = shift(length)
        packet.packets = parsePackets(subPackets)
      } else {
        const totalSubPackets = shift(11, true)
        packet.packets = parsePackets(input, totalSubPackets)
        input = input.substring(packet.packets.consumed)
      }
    }

    //we have the list of subpackets, we can act on it
    switch (typeId) {
      case 0: // sum
        packet.value = packet.packets.reduce((a, p) => a + p.value, 0)
        break
      case 1: // product
        packet.value = packet.packets.reduce((a, p) => a * p.value, 1)
        break
      case 2: // min
        packet.value = Math.min(...packet.packets.map(p => p.value))
        break
      case 3: // max
        packet.value = Math.max(...packet.packets.map(p => p.value))
        break
      case 5: // greater than
        packet.value = Number(packet.packets[0].value > packet.packets[1].value)
        break
      case 6: // lower than
        packet.value = Number(packet.packets[0].value < packet.packets[1].value)
        break
      case 7: // equal to
        packet.value = Number(packet.packets[0].value === packet.packets[1].value)
        break
      default:
        break
    }

    packets.push(packet)
  }
  packets.consumed = startInputSize - input.length
  return packets
}

const sumVersions = packets =>
  packets.map(p => p.version + sumVersions(p.packets)).reduce((a, b) => a + b, 0)

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)

const part1 = data => {
  let packets = parsePackets(data)
  let answer = sumVersions(packets)
  return answer
}

const part2 = data => {
  let packets = parsePackets(data)
  let answer = packets[0].value
  return answer
}

const run = () => {
  let answer
  let data = base16toBinary(rawData)

  timer = Date.now()
  answer = part1(data)
  console.log({ part: 1, answer })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer })
}

run()
