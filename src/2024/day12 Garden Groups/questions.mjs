import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, 0], // top
  [0, -1], // left
  [0, 1], //  right
  [1, 0], //  bottom
]
const parseInput = (input) => {
  let names = {}
  let queue = []
  let farm = input.split('\n').map((r, row) =>
    r.split('').map((value, col) => {
      names[value] = 1
      queue.push({ value, row, col })
      return value
    }),
  )
  return { farm, names, queue }
}

const part1 = () => {
  let { farm, names, queue } = parseInput(input)

  let visited = {}
  let regions = {}
  while (queue.length) {
    const { value, row, col } = queue.shift()
    if (visited[`${row},${col}`]) continue

    let plot = `${value}-${names[value]}`
    if (!regions[plot]) {
      regions[plot] = { perimeter: 0, plots: [{ row, col }] }
      names[value]++
    } else {
      regions[plot].plots.push({ row, col })
    }

    visited[`${row},${col}`] = true
    spread(row, col, value, plot)
  }

  function spread(r, c, value, plot) {
    for (let [nr, nc] of neighbors) {
      let [row, col] = [r + nr, c + nc]
      if (farm?.[row]?.[col] === value) {
        if (visited[`${row},${col}`]) continue
        regions[plot].plots.push({ row, col })
        visited[`${row},${col}`] = true
        spread(row, col, value, plot)
      } else {
        regions[plot].perimeter++
      }
    }
  }
  return Object.values(regions).reduce((acc, { perimeter, plots }) => acc + perimeter * plots.length, 0)
}

const part2 = () => {
  const M = input.split('\n').map((l) => [...l])

  const findRegion = (pos) => {
    const queue = [pos]
    const area = [pos]
    const perimeter = []
    const seen = new Set()

    while (queue.length) {
      const [r, c] = queue.shift()
      seen.add([r, c] + '')
      const t = M[r]?.[c]
      ;[
        [r - 1, c],
        [r, c + 1],
        [r + 1, c],
        [r, c - 1],
      ].forEach(([nr, nc], i) => {
        if (seen.has([nr, nc] + '')) return
        const nt = M[nr]?.[nc]
        if (!nt || nt !== t) {
          perimeter.push([nr, nc, i])
          return
        }
        area.push([nr, nc])
        queue.push([nr, nc])
        seen.add([nr, nc] + '')
      })
    }
    return {
      type: M[pos[0]][pos[1]],
      area,
      perimeter,
    }
  }

  const seen = new Set()
  const result = []
  M.forEach((row, r) => {
    row.forEach((_, c) => {
      if (seen.has([r, c] + '')) return

      const region = findRegion([r, c])
      result.push(region)
      region.area.forEach((p) => seen.add(p + ''))
    })
  })

  const countEdges = (perimeter, dir) => {
    const pts = perimeter.filter((p) => p[2] === dir)
    const group = dir % 2 === 0 ? 0 : 1
    const collect = group === 0 ? 1 : 0
    let count = 0
    ;[...new Set(pts.map((p) => p[group]))].forEach((r) => {
      const line = pts
        .filter((p) => p[group] === r)
        .map((p) => p[collect])
        .sort((a, b) => a - b)
        .flatMap((r, i, arr) => (i == 0 ? [1] : [r - arr[i - 1]]))
      count += line.filter((d) => d > 1).length + 1
    })
    return count
  }

  const findSides = (region) => [0, 1, 2, 3].reduce((a, c) => a + countEdges(region.perimeter, c), 0)

  return result.reduce((a, c) => a + c.area.length * findSides(c), 0)
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
