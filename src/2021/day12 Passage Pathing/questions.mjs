// import rawData from './sample-small.mjs'
// import rawData from './sample1.mjs'
// import rawData from './sample-large.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const graphed = data => {
  let output = {
    start: {},
    end: {},
  }

  function connect(l, r) {
    if (!output[l]) output[l] = { [r]: 1 }
    output[l][r] = 1
  }

  for (let [l, r] of data) {
    connect(l, r)
    connect(r, l)
  }
  return output
}

const completeRoutes = (graph, routes, part) => {
  let incomplete = ['start']
  while (incomplete.length) {
    let route = incomplete.shift()
    let last = route.split(',').pop()
    if (last === 'end') {
      routes.add(route)
      continue
    }

    let connections
    if (part === 1) {
      connections = Object.keys(graph[last]).forEach(node => {
        if (node === node.toUpperCase() || !route.includes(node)) {
          incomplete.push(`${route},${node}`)
        }
      })
    }
    if (part === 2) {
      connections = Object.keys(graph[last]).forEach(node => {
        if (node === 'start') return
        if (node === 'end' || node === node.toUpperCase() || !route.includes(node)) {
          incomplete.push(`${route},${node}`)
          return
        }
        if (route.includes(':')) return
        incomplete.push(`${node}:${route},${node}`)
      })
    }
  }
}

const part1 = graph => {
  const part = 1

  let routes = new Set()
  completeRoutes(graph, routes, part)

  let answer = routes.size
  console.log({ part, answer })
}

const part2 = graph => {
  const part = 2

  let routes = new Set()
  completeRoutes(graph, routes, part)

  let answer = routes.size
  console.log({ part, answer }) // > 4659
}

const run = () => {
  let data = rawData.split('\n').map(l => l.split('-'))
  let graph = graphed(data)

  timer = Date.now()
  part1(graph)
  console.log(timingMonitor())

  timer = Date.now()
  part2(graph)
  console.log(timingMonitor())
}

run()
