// import data from './sample.mjs'
import data from './input.mjs'

const input = data
  .split('\n')
  .map(l => l
    .split(':')
    .map(l => l
      .split('=')
      .map(l => l
        .split(',')
        .map(Number)
        .filter(n => (parseInt(n) === 0 || +n))
      )
      // .filter(Number)
      .flat()
    )
  )

// console.log(input)

let map = {}
const pos = (x, y) => `${x},${y}`
const distance = ([[sx, sy], [bx, by]]) => Math.abs(sx - bx) + Math.abs(sy - by)

const add = (x, y) => {
  let c = pos(x, y)
  if (!map[c]) map[c] = '#'
}

const targetY = 2000000 // 10 //

for (let row of input) {
  let [[sx, sensorY], [bx, by]] = row

  let distFromTarget = Math.abs(sensorY - targetY)
  let manhattan = distance(row);
  if (distFromTarget <= manhattan) {
    // console.log({row, manhattan, distFromTarget})
    for (let x = 0; x <= (manhattan - distFromTarget); x++) {
      add(sx + x, targetY)
      add(sx - x, targetY)
    }
  }
  // remove beacons
  if (by === targetY) map[pos(bx, by)] = 'B'
}

const answer = Object.keys(map).filter(a => map[a] === '#').length

console.log(answer)

// const sortObjectByKeys = (object, asc = true) => Object.fromEntries(
//   Object.entries(object).sort(([k1], [k2]) => k1 < k2 ^ !asc ? -1 : 1),
// )
//
// const orderedMap = sortObjectByKeys(map)
//
// console.log(orderedMap)
