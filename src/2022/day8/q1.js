import data from './input.txt'

const horizontal = data.split('\n').map(l => l.split('').map(Number))
const vertical = horizontal.map((row, r) => row.map((col, c) => horizontal[c][r]))

let size = horizontal.length - 1

const isEdge = (row, col) => (row === 0 || col === 0 || row === size || col === size)
let output = horizontal.map((row, r) => row.map((col, c) => isEdge(r, c) ? 1 : 0))

for (let row = 1; row < size; row++) {
  for (let col = 1; col < size; col++) {
    const elem = horizontal[row][col]
    const left = [...horizontal[row]].slice(0, col)
    if (left.every(item => elem > item)) {
      output[row][col] = 1
      continue
    }
    const right = [...horizontal[row]].slice(col + 1)
    if (right.every(item => elem > item)) {
      output[row][col] = 1
      continue
    }
    const above = [...vertical[col]].slice(0, row)
    if (above.every(item => elem > item)) {
      output[row][col] = 1
      continue
    }
    const below = [...vertical[col]].slice(row + 1)
    if (below.every(item => elem > item)) {
      output[row][col] = 1
      continue
    }
    output[row][col] = 0
  }
}

const visible = output
  .flat()
  .reduce((acc, curr) => acc + curr, 0)

console.log({output, visible})
