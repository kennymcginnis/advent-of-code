import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.replace(/\r\n/g, '\n').split('\n')
}

function solvePart1(nums) {
  return nums.map((num) => getNSecretNumber(num, 2000)).reduce((sum, num) => sum + num, 0)
}

function getNSecretNumber(num, n) {
  for (let i = 0; i < n; i++) {
    num = getNextSecretNumber(num)
  }

  return num
}

function getNextSecretNumber(num) {
  num = prune(mix(num, num * 64))
  num = prune(mix(num, Math.floor(num / 32)))
  num = prune(mix(num, num * 2048))

  return num
}

function mix(secret, value) {
  return secret ^ value
}

function prune(secret) {
  return ((secret % 16777216) + 16777216) % 16777216
}

function solvePart2(initNums) {
  const prices = []
  const diffs = []
  const priceBy4LastDiffs = []

  for (let i = 0; i < initNums.length; i++) {
    let num = initNums[i]

    prices[i] = [num % 10]
    diffs[i] = []
    priceBy4LastDiffs[i] = new Map()

    for (let j = 1; j < 2001; j++) {
      num = getNextSecretNumber(num)

      prices[i][j] = num % 10
      diffs[i][j] = prices[i][j] - prices[i][j - 1]

      // 5 -> 4 + 1 empty item at start
      if (diffs[i].length >= 5) {
        const diffsKey = getDiffsKey(diffs[i], j)
        if (!priceBy4LastDiffs[i].has(diffsKey)) {
          priceBy4LastDiffs[i].set(diffsKey, prices[i][j])
        }
      }
    }
  }

  const allKeys = priceBy4LastDiffs.reduce((acc, item) => {
    acc.push(...item.keys())
    return acc
  }, [])

  const allKeysSet = new Set(allKeys)

  let max = 0
  for (const key of allKeysSet) {
    const value = priceBy4LastDiffs.reduce((sum, item) => sum + (item.get(key) ?? 0), 0)
    if (value > max) {
      max = value
    }
  }

  return max
}

function getDiffsKey(diffs, j) {
  return `${diffs[j - 3]},${diffs[j - 2]},${diffs[j - 1]},${diffs[j]}`
}

const part1 = () => {
  let data = parseInput(input)
  const initialSecretNumbers = data.map((n) => parseInt(n, 10))
  return solvePart1(initialSecretNumbers)
}

const part2 = () => {
  let data = parseInput(input)
  const initialSecretNumbers = data.map((n) => parseInt(n, 10))
  return solvePart2(initialSecretNumbers)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
