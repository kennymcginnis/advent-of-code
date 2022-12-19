// import data from './sample.mjs'
import data from './input.mjs'

const input = data.split('\n').map(l => l.split(',').map(Number))

let c = ['x', 'y', 'z']
let neighbors = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [-1, 0, 0],
]
let min = { x: 'Infinity', y: 'Infinity', z: 'Infinity' }
let max = { x: 0, y: 0, z: 0 }

let grid = {}

const get = (x, y, z) => grid?.[x]?.[y]?.[z]
const set = ([x, y, z], value) => {
  if (get(x, y, z)) return
  if (!grid[x]) grid[x] = { [y]: { [z]: value } }
  else if (!grid[x][y]) grid[x][y] = { [z]: value }
  else grid[x][y][z] = value
}

const calcMinMax = item =>
  item.forEach((value, index) => {
    if (value <= min[c[index]]) min[c[index]] = value - 1
    if (value >= max[c[index]]) max[c[index]] = value + 1
  })

const mapLava = () => {
  for (let item of input) {
    calcMinMax(item)
    set(item, 'lava')
  }
}

const isEdge = (x, y, z) =>
  x === min.x || x === max.x || y === min.y || y === max.y || z === min.z || z === max.z

const spreadWater = (x, y, z) => {
  if (get(x, y, z)) return false
  if (isEdge(x, y, z)) return true
  return neighbors.some(([nx, ny, nz]) => get(x + nx, y + ny, z + nz) === 'water')
}

const checkFromCorner = (x, y, z) => {
  if (spreadWater(x, y, z)) set([x, y, z], 'water')
}

const fillWater = () => {
  for (let x = 0; x <= max.x - min.x; x++) {
    for (let y = 0; y <= max.y - min.y; y++) {
      for (let z = 0; z <= max.z - min.z; z++) {
        checkFromCorner(min.x + x, min.y + y, min.z + z) //bottom-up
        checkFromCorner(max.x - x, max.y - y, max.z - z) //top-down
      }
    }
  }
}

const countSurface = () => {
  let visible = input.reduce(
    (agg, [x, y, z]) => (
      (agg += neighbors.filter(([nx, ny, nz]) => get(x + nx, y + ny, z + nz) === 'water').length),
      agg
    ),
    0,
  )
  console.log(visible)
}

mapLava()
fillWater()
countSurface()
