import data from './input.txt'

let tail = []
let currHead = {x: 0, y: 0}
let currTail = {x: 0, y: 0}


const move = dir => {
  switch (dir) {
    case 'U':
      currHead.y -= 1
      break
    case 'D':
      currHead.y += 1
      break
    case 'L':
      currHead.x -= 1
      break
    case 'R':
      currHead.x += 1
      break
    default:
  }
  // console.log(`Head:${currHead.x},${currHead.y}`)

  let horDiff = Math.abs(currHead.x - currTail.x)
  let virDiff = Math.abs(currHead.y - currTail.y)
  let diff = horDiff + virDiff

  if (horDiff === 2) {
    if (currHead.x > currTail.x) currTail.x += 1; else currTail.x -= 1
    if (diff === 3) currTail.y = currHead.y
  }
  if (virDiff === 2) {
    if (diff === 3) currTail.x = currHead.x
    if (currHead.y > currTail.y) currTail.y += 1; else currTail.y -= 1
  }

  tail.push(`Tail:${currTail.x},${currTail.y}`)
  // console.log(`Tail:${currTail.x},${currTail.y}`)
}

data
  .split('\n')
  .map(l => l.split(' '))
  .forEach(([dir, dist]) => [...Array(Number(dist))].forEach(_ => move(dir)))

const answer = new Set(tail).size

console.log({tail, answer})
