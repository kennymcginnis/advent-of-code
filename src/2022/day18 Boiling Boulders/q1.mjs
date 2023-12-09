import data from './input.mjs'
// import data from './sample1.mjs'

const input = data.split('\n').map(l => l.split(',').map(Number))

let threeD = {}
for (let item of input) {
  let [x, y, z] = item
  if (!threeD[x]) threeD[x] = { [y]: { [z]: true } }
  else if (!threeD[x][y]) threeD[x][y] = { [z]: true }
  else threeD[x][y][z] = true
}

let visible = 0
for (let item of input) {
  let [x, y, z] = item

  // check bottom
  if (!threeD?.[x]?.[y]?.[z - 1]) visible++
  // check top
  if (!threeD?.[x]?.[y]?.[z + 1]) visible++
  // check north
  if (!threeD?.[x]?.[y + 1]?.[z]) visible++
  // check south
  if (!threeD?.[x]?.[y - 1]?.[z]) visible++
  // check east
  if (!threeD?.[x + 1]?.[y]?.[z]) visible++
  // check west
  if (!threeD?.[x - 1]?.[y]?.[z]) visible++
}
console.log(visible)
