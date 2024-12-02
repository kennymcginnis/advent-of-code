import sample from './sample.mjs'
import input from './input.mjs'
import ka from './karger.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n')

const parseGraph = (data) => {
  let nodes = []
  let edges = []
  let indexes = {}

  const add = (u) => {
    if (!(u in indexes)) {
      indexes[u] = nodes.length
      nodes.push(u)
    }
    return indexes[u]
  }

  data.forEach((str) => {
    const [left, right] = str.split(': ')
    const u = add(left)

    right.split(' ').forEach((c) => {
      const v = add(c)
      edges.push([u, v])
    })
  })
  return { nodes, edges }
}

const part1 = (input) => {
  // console.log(nodes, edges);

  const { nodes, edges } = parseGraph(parseInput(input))

  const V = nodes.length
  const E = edges.length
  let g = new ka.Graph(V, E)
  g.edge = edges.map(([u, v]) => new ka.Edge(u, v))

  let k = 0
  let res
  let components
  while (k < 1000) {
    k++
    let r = Math.random()
    ;[res, components] = ka.kargerMinCut(g)
    if (res === 3) break
  }

  let list = {}
  components.forEach((c) => {
    if (!(c in list)) list[c] = 0
    list[c]++
  })

  return Object.values(list).reduce((acc, v) => acc * v, 1)
}

const run = () => {
  timer = Date.now()
  let answer = part1(input)
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
