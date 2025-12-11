import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return Object.fromEntries(
    input.split('\n').map((line) => {
      const [key, value] = line.split(': ')
      return [key, value.split(' ')]
    }),
  )
}

const part1 = () => {
  let data = parseInput(input)
  let answer = 0
  const queue = data['you'].map((n) => ({ position: n, visited: ['you'] }))
  while (queue.length) {
    const { position, visited } = queue.shift()
    const neighbors = data[position]
    for (const neighbor of neighbors) {
      if (visited.includes(neighbor)) continue
      visited.push(neighbor)
      if (neighbor === 'out') {
        answer++
        continue
      }
      queue.push({ position: neighbor, visited: [...visited, position] })
    }
  }
  return answer
}

const part2 = () => {
  const data = parseInput(input)
  const memo = {}

  function dfs(node, visited) {
    // Mark if we've visited 'dac' or 'fft'
    if (node === 'dac') visited.dac = true
    if (node === 'fft') visited.fft = true

    // If we reach 'out', check if both 'dac' and 'fft' were visited
    if (node === 'out') return visited.dac && visited.fft ? 1 : 0

    const key = `${node}|${visited.dac}|${visited.fft}`
    if (memo[key] !== undefined) return memo[key]

    let count = 0
    for (const neighbor of data[node]) {
      count += dfs(neighbor, { ...visited })
    }
    memo[key] = count
    return count
  }

  // Start DFS from 'svr' with no special nodes visited
  return dfs('svr', { dac: false, fft: false })
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
