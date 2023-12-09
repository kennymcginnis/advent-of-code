// import rawData from './sample1.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const data = rawData.split('\n').map(r => r.split('').map(Number))

const part1 = () => {
  let part = 1,
    gamma = '',
    epsilon = '',
    counter = Array.from({ length: data[0].length }, () => [0, 0])
  for (let row in data) {
    for (let col in data[row]) {
      counter[col][data[row][col]] += 1
    }
  }

  for (let [zero, one] of counter) {
    if (zero > one) {
      gamma += '0'
      epsilon += '1'
    } else {
      gamma += '1'
      epsilon += '0'
    }
  }

  const answer = parseInt(gamma, 2) * parseInt(epsilon, 2)
  console.log({ part, answer })
}

const part2 = () => {
  let part = 2,
    generator = [...data],
    scrubber = [...data]

  const iterate = (type, filtered, index) => {
    let counter = [0, 0]
    for (let row in filtered) counter[filtered[row][index]] += 1
    const [zero, one] = counter
    switch (type) {
      case 'generator':
        let greater = one >= zero ? 1 : 0
        return filtered.filter(r => r[index] === greater)
      case 'scrubber':
        let lesser = zero <= one ? 0 : 1
        return filtered.filter(r => r[index] === lesser)
    }
  }

  let index = 0
  while (generator.length > 1) {
    generator = iterate('generator', generator, index)
    index++
  }

  index = 0
  while (scrubber.length > 1) {
    scrubber = iterate('scrubber', scrubber, index)
    index++
  }

  const answer = parseInt(generator[0].join(''), 2) * parseInt(scrubber[0].join(''), 2)
  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
