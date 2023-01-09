import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input =>
  input.split('\n').map(r => ({ action: r.substring(0, 1), value: Number(r.substring(1)) }))

const facings = {
  0: 'N',
  90: 'E',
  180: 'S',
  270: 'W',
}

const part1 = data => {
  const actions = {
    //means to move north by the given value.
    N: value => (pos.r -= value),
    //means to move south by the given value.
    S: value => (pos.r += value),
    //means to move east by the given value.
    E: value => (pos.c += value),
    //means to move west by the given value.
    W: value => (pos.c -= value),
    //means to turn left the given number of degrees.
    L: value => (pos.f = pos.f - value < 0 ? pos.f - value + 360 : (pos.f - value) % 360),
    //means to turn right the given number of degrees.
    R: value => (pos.f = (pos.f + value) % 360),
    //means to move forward by the given value in the direction the ship is currently facing.
    F: value => actions[facings[pos.f]](value),
  }

  let pos = { r: 0, c: 0, f: 90 }
  for (let { action, value } of data) {
    actions[action](value)
    if (printing) console.log(pos)
  }
  return Math.abs(pos.r) + Math.abs(pos.c)
}

const part2 = data => {
  const actions = {
    //means to move the waypoint north by the given value.
    N: value => (way.r -= value),
    //means to move the waypoint south by the given value.
    S: value => (way.r += value),
    //means to move the waypoint east by the given value.
    E: value => (way.c += value),
    //means to move the waypoint west by the given value.
    W: value => (way.c -= value),
    //means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
    L: value => {
      let orig = { ...way }
      switch (value) {
        case 90:
          way.r = orig.c * -1
          way.c = orig.r
          break
        case 180:
          way.r *= -1
          way.c *= -1
          break
        case 270:
          actions['R'](90)
          break
      }
    },
    //means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
    R: value => {
      let orig = { ...way }
      switch (value) {
        case 90:
          way.r = orig.c
          way.c = orig.r * -1
          break
        case 180:
          way.r *= -1
          way.c *= -1
          break
        case 270:
          actions['L'](90)
          break
      }
    },
    //means to move forward to the waypoint a number of times equal to the given value.
    F: value => {
      pos.r += value * way.r
      pos.c += value * way.c
    },
  }

  let way = { r: -1, c: 10 }
  let pos = { r: 0, c: 0 }
  for (let { action, value } of data) {
    actions[action](value)
    if (printing) console.log({ action, value }, pos, way)
  }
  return Math.abs(pos.r) + Math.abs(pos.c)
}

const run = () => {
  timer = Date.now()
  printing = false
  let answer = part1(parseInput(input))
  console.log({ part: 1, answer, time: timingMonitor() })

  // printing = true
  timer = Date.now()
  answer = part2(parseInput(input)) // > 36605
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
