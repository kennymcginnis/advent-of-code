import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input
    .split('\n')
    .map((row) => row.split(' '))
    .map(([spring, damage]) => [spring, damage.split(',').map(Number)])

function getArrangements(
  conditions,
  conditionIndex,
  damagedBlocks,
  damagedBlockIndex,
  damagedBlockLength,
) {
  var desiredBlockLength = damagedBlocks[damagedBlockIndex]
  if (conditionIndex >= conditions.length) {
    // Reached the end of the configuration

    if (damagedBlockIndex < damagedBlocks.length - 1) {
      // Invalid configuration, Not all blocks filled.
      return 0
    }

    if (damagedBlockIndex === damagedBlocks.length - 1 && damagedBlockLength < desiredBlockLength) {
      // Invalid configuration, Incomplete block.
      return 0
    }
    // Valid configuration, All blocks filled.
    return 1
  }

  var currentCondition = conditions[conditionIndex]

  if (currentCondition === '.') {
    //  is OK

    if (damagedBlockLength > 0 && damagedBlockLength < desiredBlockLength) {
      // Invalid configuration, Incomplete block.
      return 0
    }

    if (damagedBlockLength > 0 && damagedBlockIndex < damagedBlocks.length) {
      // Move on to next block.
      damagedBlockIndex++
    }

    return getArrangements(conditions, conditionIndex + 1, damagedBlocks, damagedBlockIndex, 0)
  } else if (currentCondition === '#') {
    //  is damaged add one to block

    if (damagedBlockLength >= desiredBlockLength || desiredBlockLength === undefined) {
      // Invalid configuration, block is already full.
      return 0
    }

    return getArrangements(
      conditions,
      conditionIndex + 1,
      damagedBlocks,
      damagedBlockIndex,
      damagedBlockLength + 1,
    )
  }

  var arrangements = 0

  if (damagedBlockLength < desiredBlockLength) {
    // Try to add a damaged  to block
    arrangements += getArrangements(
      conditions.substring(0, conditionIndex) + '#' + conditions.substring(conditionIndex + 1),
      conditionIndex + 1,
      damagedBlocks,
      damagedBlockIndex,
      damagedBlockLength + 1,
    )
  }

  // Ok
  if (damagedBlockLength > 0 && damagedBlockLength < desiredBlockLength) {
    // Invalid configuration, Incomplete block.
    return arrangements
  }

  if (damagedBlockLength === desiredBlockLength && damagedBlockIndex < damagedBlocks.length) {
    // Move on to next block.
    damagedBlockIndex++
  }

  // Try to add an Ok
  return (arrangements += getArrangements(
    conditions.substring(0, conditionIndex) + '.' + conditions.substring(conditionIndex + 1),
    conditionIndex + 1,
    damagedBlocks,
    damagedBlockIndex,
    0,
  ))
}

const part1 = () => {
  let data = parseInput(input)

  var sum = 0
  for (const [conditions, damagedSprings] of data) {
    sum += getArrangements(conditions, 0, damagedSprings, 0, 0)
  }

  return sum
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
