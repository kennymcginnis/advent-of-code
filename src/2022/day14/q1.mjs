import data from './input.mjs'

const input = data.split('\n')
  .map(l => l.split(' -> ')
    .map(l => l.split(',')
      .map(Number)))

const map = {
  '500,0': '+',
}


const pos = (x, y) => `${x},${y}`

let max = input[0][0][1]
for (let path of input) {
  let [sx, sy] = path[0]
  for (let line = 1; line < path.length; line++) {
    const [ex, ey] = path[line]
    if (sx === ex) for (let y = sy; (sy < ey) ? y <= ey : y >= ey; (sy < ey) ? y++ : y--) {
      map[pos(sx, y)] = '#'
    }
    if (sy === ey) for (let x = sx; (sx < ex) ? x <= ex : x >= ex; (sx < ex) ? x++ : x--) {
      map[pos(x, sy)] = '#'
    }
    if (ey > max) max = ey
    [sx, sy] = [ex, ey]
  }
}

let falling = true
let cx, cy
const starting = [500, 0]
while (falling) {
  if (cx === undefined) [cx, cy] = starting

  // endless void
  if (cy > max) falling = false

  // check below
  if (!map[pos(cx, cy + 1)]) {
    cy++
    continue
  }
  // one step down and to the left
  if (!map[pos(cx - 1, cy + 1)]) {
    cx--
    cy++
    continue
  }
  // one step down and to the right
  if (!map[pos(cx + 1, cy + 1)]) {
    cx++
    cy++
    continue
  }

  // If all three possible destinations are blocked, the unit of sand comes to rest
  map[pos(cx, cy)] = 'o'
  cx = undefined
}

const answer = Object.keys(map).filter(a => map[a] === 'o').length

console.log({map, answer})
