import data from './input.mjs'

const input = data.split('\n')
  .map(l => l.split(' -> ')
    .map(l => l.split(',')
      .map(Number)))

const map = {'500,0': '+'}

const pos = (x, y) => `${x},${y}`;

let [maxX, maxY] = input[0][0]
let [minX, minY] = input[0][0]

// mapping cave
for (let path of input) {
  let [startX, startY] = path[0]
  for (let line = 1; line < path.length; line++) {
    const [endX, endY] = path[line]
    if (startX === endX) for (let y = startY; (startY < endY) ? y <= endY : y >= endY; (startY < endY) ? y++ : y--) {
      map[pos(startX, y)] = '#'
    }
    if (startY === endY) for (let x = startX; (startX < endX) ? x <= endX : x >= endX; (startX < endX) ? x++ : x--) {
      map[pos(x, startY)] = '#'
    }
    if (endX < minX) minX = endX
    if (endY < minY) minY = endY
    if (endX > maxX) maxX = endX
    if (endY > maxY) maxY = endY
    startX = endX
    startY = endY
  }
}

//  adding floor
for (let x = minX - 10; x <= maxX + 10; x++) map[pos(x, maxY + 2)] = '#'

const draw = () => {
//draw map
  let drawing = ''
  for (let y = 0; y < maxY + 5; y++) {
    for (let x = minX - 10; x < maxX + 10; x++) {
      drawing += map[pos(x, y)] || '.'
    }
    drawing += `
`
  }
  return drawing
}

let falling = true
let currX, currY
const STARTING = [500, 0]
while (falling) {
  if (currX === undefined) [currX, currY] = STARTING

  // reached the top
  if (map[pos(...STARTING)] === 'o') {
    falling = false
    continue
  }

  // reached the floor
  if (currY > maxY) {
    map[pos(currX, currY)] = 'o'
    currX = undefined
    continue
  }

  // check below
  if (!map[pos(currX, currY + 1)]) {
    currY++
    continue
  }
  // one step down and to the left
  if (!map[pos(currX - 1, currY + 1)]) {
    currX--
    currY++
    continue
  }
  // one step down and to the right
  if (!map[pos(currX + 1, currY + 1)]) {
    currX++
    currY++
    continue
  }

  // If all three possible destinations are blocked, the unit of sand comes to rest
  map[pos(currX, currY)] = 'o'
  currX = undefined
}

const answer = Object.keys(map).filter(a => map[a] === 'o').length

// console.log({map, answer})

console.log(draw())
