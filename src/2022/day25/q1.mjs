// import input from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const MAX_SNAFU = 100
const RADIX = 5

const parseInput = () => input.split('\n').map(Number)

console.log(timingMonitor())
