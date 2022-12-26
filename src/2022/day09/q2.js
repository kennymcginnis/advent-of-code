import data from './input.txt'

let tail = []
let rope = [...Array(10)].map(_ => ({x: 0, y: 0}));

const move = (dir, knot) => {
  let curr = rope[knot]
  if (knot === 0) {
    // console.log(`Dir: ${dir} Head:${rope[0].x},${rope[0].y}`)
    switch (dir) {
      case 'U':
        curr.y += 1
        break
      case 'D':
        curr.y -= 1
        break
      case 'L':
        curr.x -= 1
        break
      case 'R':
        curr.x += 1
        break
      default:
    }
    // console.log(`Head:${rope[0].x},${rope[0].y}`)
  } else {
    let prev = rope[knot - 1]
    let horDiff = Math.abs(prev.x - curr.x)
    let virDiff = Math.abs(prev.y - curr.y)
    let diff = horDiff + virDiff

    if (horDiff === 2) {
      if (prev.x > curr.x) curr.x += 1; else curr.x -= 1
      if (diff === 3) curr.y = prev.y
    }
    if (virDiff === 2) {
      if (diff === 3) curr.x = prev.x
      if (prev.y > curr.y) curr.y += 1; else curr.y -= 1
    }
    // console.log(`Knot${knot}:${curr.x},${curr.y}`)
    if (knot === 9) tail.push(`Tail:${curr.x},${curr.y}`)
  }
}

data
  .split('\n')
  .map(l => l.split(' '))
  .forEach(([dir, dist]) =>
    [...Array(Number(dist))].map((_, d) =>
      [...Array(10)].map((i, knot) =>
        move(dir, knot)
      )
    )
  )

const answer = new Set(tail).size

console.log({tail, answer})
