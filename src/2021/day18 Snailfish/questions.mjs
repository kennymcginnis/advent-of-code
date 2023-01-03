// import rawData from './sample.mjs'
import rawData from './input.mjs'
let printing = false

const assertEquals = (a, b) => {
  if (a === b) {
    console.log(`🎉 Yay ${a} === ${b}`)
  } else {
    console.error(`😭 Oops ${a} !== ${b}`)
  }
}
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

class Numeric {
  constructor(index, value) {
    this.index = index
    this.value = Number(value)
  }
}

const isNumeric = string => !isNaN(string)
const addition = (left, right) => `[${left},${right}]`

const solve = array => {
  let input

  function explode() {
    let left
    let number
    let leftmostPair = { right: { index: 0 } }
    let countUnclosed = 0
    let regularNumbers = []
    let nearestRegularNumbers = {}

    let found = {}

    let i = 0
    while (i < input.length) {
      if (isNumeric(input[i])) {
        if (isNumeric(input[i + 1])) {
          number = new Numeric(i, input[i] + input[i + 1])
          i++
        } else {
          number = new Numeric(i, input[i])
        }
        i++
        if (!found.leftNeighbor) regularNumbers.push(number)
        if (!found.rightNeighbor && found.leftmostPair) {
          nearestRegularNumbers.right = number
          found.rightNeighbor = true
        }
        if (found.leftmostPair && found.rightNeighbor) break
      }

      if (input[i] === '[') {
        countUnclosed++
        // track the index of the first spot the leftmostPair could be
        if (!found.leftmostPair && countUnclosed > 4) leftmostPair.index = i
      }

      if (input[i] === ']') {
        countUnclosed--
        // if not already closed, see if we can close leftmostPair
        if (!found.leftmostPair && leftmostPair.index) {
          let { index } = leftmostPair
          let right = regularNumbers.pop()
          let left = regularNumbers.pop()
          let leftNeighbor = regularNumbers.pop()
          leftmostPair = { index, left, right }
          found.leftmostPair = true

          nearestRegularNumbers.left = leftNeighbor
          found.leftNeighbor = !!leftNeighbor
        }
      }

      // commas are followed by either another set `[` or a number closing a pair
      if (input[i] === ',') {
        // if starting new set, the number to the left is a regular number and not apart of the set
        if (input[i + 1] === '[' && number?.value) left = undefined

        // if we've hit a comma, the number to the left is the first part of a pair
        if (isNumeric(input[i + 1])) left = number
      }
      i++
    }

    function updateNeighbor(pair, { index, value }) {
      let deleteCount = value > 9 ? 2 : 1
      let newElement = value + pair.value
      input.splice(index, deleteCount, newElement)
    }
    function explodeLeftmost({ left, right }) {
      let start = left.index - 1
      let end = left.index + (left.value > 9 ? 3 : 2) + (right.value > 9 ? 3 : 2)
      input.splice(start, end - start, '0')
    }

    if (found.leftmostPair) {
      input = [...input]
      if (found.rightNeighbor) updateNeighbor(leftmostPair.right, nearestRegularNumbers.right)
      if (found.leftmostPair) explodeLeftmost(leftmostPair)
      if (found.leftNeighbor) updateNeighbor(leftmostPair.left, nearestRegularNumbers.left)

      if (printing) console.log({ leftmostPair, nearestRegularNumbers })

      input = input.join('')
    }
    return found.leftmostPair
  }

  function split() {
    let number
    let found = { leftmostSplit: false }
    let leftmostSplit = {}

    let i = 0
    while (i < input.length) {
      if (isNumeric(input[i])) {
        if (isNumeric(input[i + 1])) {
          number = new Numeric(i, input[i] + input[i + 1])
          i++
        } else {
          number = new Numeric(i, input[i])
        }
        if (!found.leftmostSplit && number.value > 9) {
          leftmostSplit = number
          found.leftmostSplit = true
          break
        }
      }
      i++
    }

    function splitLeftmost({ index, value }) {
      let deleteCount = 2
      let newElement = `[${Math.floor(value / 2)},${Math.ceil(value / 2)}]`
      input.splice(index, deleteCount, newElement)
    }

    if (found.leftmostSplit) {
      input = [...input]
      splitLeftmost(leftmostSplit)
      if (printing) console.log({ leftmostSplit })
      input = input.join('')
    }

    return found.leftmostSplit
  }

  while (array.length > 1) {
    let left = array.shift()
    let right = array.shift()

    input = addition(left, right)

    while (true) {
      if (printing) console.log(input)
      if (explode(input)) continue
      if (split(input)) continue
      break
    }
    array.splice(0, 0, input)
  }
  return array[0]
}

function magnitude(pair) {
  const [a, b] = pair.map(n => (Array.isArray(n) ? magnitude(n) : n))
  return 3 * a + 2 * b
}

const part1 = () => {
  const data = rawData.split('\n')
  const reduced = solve(data)
  return magnitude(JSON.parse(reduced))
}

const part2 = () => {
  const lines = rawData.split('\n')
  let max = 0
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      max = Math.max(
        max,
        magnitude(JSON.parse(solve([lines[i], lines[j]]))),
        magnitude(JSON.parse(solve([lines[j], lines[i]]))),
      )
    }
  }

  return max
}

const run = () => {
  timer = Date.now()

  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

const test = () => {
  assertEquals(addition('[1,2]', '[[3,4],5]'), '[[1,2],[[3,4],5]]')
  //(the 9 has no regular number to its left, so it is not added to any regular number).
  assertEquals(explode('[[[[[9,8],1],2],3],4]'), '[[[[0,9],2],3],4]')
  //(the 2 has no regular number to its right, and so it is not added to any regular number).
  assertEquals(explode('[7,[6,[5,[4,[3,2]]]]]'), '[7,[6,[5,[7,0]]]]')
  assertEquals(explode('[[6,[5,[4,[3,2]]]],1]'), '[[6,[5,[7,0]]],3]')
  // (the pair [3,2] is unaffected because the pair [7,3] is further to the left; [3,2] would explode on the next action).
  assertEquals(
    explode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]'),
    '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]',
  )
  assertEquals(explode('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'), '[[3,[2,[8,0]]],[9,[5,[7,0]]]]')
  assertEquals(split(10), '[5,5]')
  assertEquals(split(11), '[5,6]')
  assertEquals(split(12), '[6,6]')
  assertEquals(
    solve(['[[[[4,3],4],4],[7,[[8,4],9]]]', '[1,1]']),
    '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]',
  )
  assertEquals(solve(['[1,1]', '[2,2]', '[3,3]', '[4,4]']), '[[[[1,1],[2,2]],[3,3]],[4,4]]')
  assertEquals(
    solve(['[1,1]', '[2,2]', '[3,3]', '[4,4]', '[5,5]']),
    '[[[[3,0],[5,3]],[4,4]],[5,5]]',
  )
  assertEquals(
    solve(['[1,1]', '[2,2]', '[3,3]', '[4,4]', '[5,5]', '[6,6]']),
    '[[[[5,0],[7,4]],[5,5]],[6,6]]',
  )
  assertEquals(
    solve(
      `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
  [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]`.split('\n'),
    ),
    '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]',
  )
  assertEquals(
    solve(
      `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
  [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
  [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
  [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
  [7,[5,[[3,8],[1,4]]]]
  [[2,[2,2]],[8,[8,1]]]
  [2,9]
  [1,[[[9,3],9],[[9,0],[0,7]]]]
  [[[5,[7,4]],7],1]
  [[[[4,2],2],6],[8,7]]`.split('\n'),
    ),
    '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]',
  )
  assertEquals(magnitude(JSON.parse('[[1,2],[[3,4],5]]')), 143)
  assertEquals(magnitude(JSON.parse('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')), 1384)
  assertEquals(magnitude(JSON.parse('[[[[1,1],[2,2]],[3,3]],[4,4]]')), 445)
  assertEquals(magnitude(JSON.parse('[[[[3,0],[5,3]],[4,4]],[5,5]]')), 791)
  assertEquals(magnitude(JSON.parse('[[[[5,0],[7,4]],[5,5]],[6,6]]')), 1137)
  assertEquals(magnitude(JSON.parse('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')), 3488)
}

// test()
run()
