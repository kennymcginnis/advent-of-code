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

let max = input.length == 34 ? 4000000 : 20

const distance = ([[sx, sy], [bx, by]]) => Math.abs(sx - bx) + Math.abs(sy - by)

const checkPos = check => {
  // console.log(check)
  const [x, y] = check
  if (x < 0 || y < 0 || x > max || y > max) return false
  for (let radar of input) {
    const [sensor] = radar
    let dist = distance([sensor, check])
    if (dist <= distance(radar)) return false
  }
  console.log(x * 4000000 + y)
  return true
}

outerLoop:for (let sensor of input) {
  console.log(sensor)
  let [[sensorX, sensorY]] = sensor
  let dist = distance(sensor) + 1
  // travel the perimeter + 1
  for (let i = 0; i < dist; i++) {
    if (checkPos([sensorX + i, sensorY - dist + i])) break outerLoop
    if (checkPos([sensorX + dist - i, sensorY + i])) break outerLoop
    if (checkPos([sensorX - i, sensorY + dist - i])) break outerLoop
    if (checkPos([sensorX - dist + i, sensorY - i])) break outerLoop
  }
}
