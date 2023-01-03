import data from './input.txt'

const horizontal = data.split('\n').map(l => l.split('').map(Number))
const vertical = horizontal.map((row, r) => row.map((col, c) => horizontal[c][r]))

let size = horizontal.length - 1

const scenicScore = (arr, elem) => {
  let visible = 0
  for (const item of arr) {
    visible += 1
    if (elem <= item) break
  }
  return visible
}


let answer = 0
for (let row = 1; row < size; row++) {
  for (let col = 1; col < size; col++) {
    const elem = horizontal[row][col]
    const left = [...horizontal[row]].slice(0, col).reverse()
    const lscore = scenicScore(left, elem)

    const right = [...horizontal[row]].slice(col + 1)
    const rscore = scenicScore(right, elem)

    const above = [...vertical[col]].slice(0, row).reverse()
    const ascore = scenicScore(above, elem)

    const below = [...vertical[col]].slice(row + 1)
    const bscore = scenicScore(below, elem)

    let score = lscore * rscore * ascore * bscore;
    if (score > answer) answer = score
  }
}

console.log({answer})
