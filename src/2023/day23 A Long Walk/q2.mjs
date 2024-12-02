import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const part2 = (input) => {
  let map = parseInput(input)

  let isValid = (y, x) =>
    !(y < 0 || y >= map.length || x < 0 || x >= map[0].length || map[y][x] == '#')

  let nodes = ['0,1', map.length - 1 + ',' + (map[0].length - 2)]
  let nodeDist = []
  for (let i = 0; i < nodes.length; i++) {
    nodeDist[i] = {}
    let node = nodes[i].split(',').map((x) => +x)
    let nav = (step, last, y, x) => {
      //dirs are ULDR
      if (!isValid(y, x)) return

      let valid = 0
      if (isValid(y - 1, x)) valid++
      if (isValid(y + 1, x)) valid++
      if (isValid(y, x - 1)) valid++
      if (isValid(y, x + 1)) valid++
      if (step > 0 && (valid > 2 || y < 1 || y >= map.length - 1)) {
        if (!nodes.includes(y + ',' + x)) nodes.push(y + ',' + x)
        nodeDist[i][nodes.indexOf(y + ',' + x)] = step
        return
      }

      if (last !== 2 && y > 0) nav(step + 1, 0, y - 1, x)
      if (last !== 0 && y < map.length - 1) nav(step + 1, 2, y + 1, x)
      if (last !== 3) nav(step + 1, 1, y, x - 1)
      if (last !== 1) nav(step + 1, 3, y, x + 1)
    }

    nav(0, -1, node[0], node[1])
  }

  console.log(nodes, nodeDist)

  let longestPath = []
  let longestSteps = 0
  let nav2 = (steps, node, prev) => {
    if (node === 1) {
      if (steps > longestSteps) {
        longestPath = prev
        longestSteps = steps
      }
      return
    }
    prev.push(node)
    for (let target in nodeDist[node]) {
      if (prev.includes(+target)) continue
      nav2(steps + nodeDist[node][target], +target, [...prev])
    }
  }
  nav2(0, 0, [])
  return { longestPath, longestSteps }
}

const run = () => {
  timer = Date.now()
  let answer = part2(input)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
