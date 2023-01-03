import sample from './sample.mjs'
import input from './input.mjs'

let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n\n')

const mapped = inputImage =>
  inputImage
    .split('\n')
    .reduce(
      (rowAgg, row, rIndex) => (
        (rowAgg[rIndex] = row
          .split('')
          .reduce((colAgg, image, c) => ((colAgg[c] = image), colAgg), {})),
        rowAgg
      ),
      {},
    )

const pixels = {
  '.': '0',
  '#': '1',
}

const neighbors = [
  [-1, -1], // top-left
  [-1, 0], //  top-middle
  [-1, 1], //  top-right
  [0, -1], //  left
  [0, 0], //   middle (self)
  [0, 1], //   right
  [1, -1], //  bottom-left
  [1, 0], //   bottom-middle
  [1, 1], //   bottom-right
]

const print = image => {
  if (!printing) return
  let { minRow, minCol, maxRow, maxCol } = minMax(image)
  for (let r = minRow - 1; r <= maxRow + 1; r++) {
    let line = ''
    for (let c = minCol - 1; c <= maxCol + 1; c++) {
      line += image?.[r]?.[c] || '.'
    }
    console.log(line)
  }
  console.log('')
}

const score = image => {
  return Object.values(image)
    .map(row => Object.values(row).filter(item => item === '#'))
    .flat().length
}

const minMax = image => {
  let minRow = Infinity,
    minCol = Infinity,
    maxRow = 0,
    maxCol = 0
  for (let row in image) {
    if (row < minRow) minRow = Number(row)
    if (row > maxRow) maxRow = Number(row)
    for (let col in image[row]) {
      if (col < minCol) minCol = Number(col)
      if (col > maxCol) maxCol = Number(col)
    }
  }
  return { minRow, minCol, maxRow, maxCol }
}

const enhance = (enhancement, input, outerEdges) => {
  let output = JSON.parse(JSON.stringify(input))
  let { minRow, minCol, maxRow, maxCol } = minMax(input)

  for (let r = minRow - 1; r <= maxRow + 1; r++) {
    for (let c = minCol - 1; c <= maxCol + 1; c++) {
      let binary = ''
      for (let [nr, nc] of neighbors) {
        let value = input?.[r + nr]?.[c + nc]
        binary += value === undefined ? outerEdges : +(value === '#')
      }
      let integer = parseInt(binary, 2)
      if (output[r]) output[r][c] = enhancement[integer]
      else output[r] = { [c]: enhancement[integer] }
    }
  }
  print(output)
  return output
}

const run = () => {
  let [imageEnhancementAlgorithm, inputImage] = parseInput(input)
  imageEnhancementAlgorithm = [...imageEnhancementAlgorithm]

  let pixelMap = mapped(inputImage)
  if (printing) console.log({ imageEnhancementAlgorithm, pixelMap })

  let part1 = [...Array(2)].reduce(
    (image, _, index) => enhance(imageEnhancementAlgorithm, image, index % 2),
    pixelMap,
  )

  timer = Date.now()
  console.log({ part: 1, answer: score(part1), time: timingMonitor() })

  let part2 = [...Array(50)].reduce(
    (image, _, index) => enhance(imageEnhancementAlgorithm, image, index % 2),
    pixelMap,
  )

  timer = Date.now()
  console.log({ part: 2, answer: score(part2), time: timingMonitor() })
}

run()
