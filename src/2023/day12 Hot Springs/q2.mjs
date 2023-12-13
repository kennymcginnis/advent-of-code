import sample from './sample.mjs'
import input from './input.mjs'

const lines = input.split('\n')

var cache = {}

function getArrangements(
  conditions,
  conditionIndex,
  damagedSpringsBlocks,
  damagedSpringBlockIndex,
  damagedSpringBlockLength,
) {
  var desiredBlockLength = damagedSpringsBlocks[damagedSpringBlockIndex]
  var key = conditionIndex + ',' + damagedSpringBlockIndex + ',' + damagedSpringBlockLength
  if (key in cache) {
    return cache[key]
  }

  if (conditionIndex >= conditions.length) {
    // Reached the end of the configuration

    if (damagedSpringBlockIndex < damagedSpringsBlocks.length - 1) {
      // Invalid configuration, Not all blocks filled.
      return (cache[key] = 0)
    }

    if (
      damagedSpringBlockIndex === damagedSpringsBlocks.length - 1 &&
      damagedSpringBlockLength < desiredBlockLength
    ) {
      // Invalid configuration, Incomplete block.
      return (cache[key] = 0)
    }

    // Valid configuration, All blocks filled.
    return (cache[key] = 1)
  }

  var currentCondition = conditions[conditionIndex]

  if (currentCondition === '.') {
    // Spring is OK

    if (damagedSpringBlockLength > 0 && damagedSpringBlockLength < desiredBlockLength) {
      // Invalid configuration, Incomplete block.
      return (cache[key] = 0)
    }

    if (damagedSpringBlockLength > 0 && damagedSpringBlockIndex < damagedSpringsBlocks.length) {
      // Move on to next block.
      damagedSpringBlockIndex++
    }

    return (cache[key] = getArrangements(
      conditions,
      conditionIndex + 1,
      damagedSpringsBlocks,
      damagedSpringBlockIndex,
      0,
    ))
  } else if (currentCondition === '#') {
    // Spring is damaged add one to block

    if (damagedSpringBlockLength >= desiredBlockLength || desiredBlockLength === undefined) {
      // Invalid configuration, block is already full.
      return (cache[key] = 0)
    }

    return (cache[key] = getArrangements(
      conditions,
      conditionIndex + 1,
      damagedSpringsBlocks,
      damagedSpringBlockIndex,
      damagedSpringBlockLength + 1,
    ))
  }

  var arrangements = 0

  if (damagedSpringBlockLength < desiredBlockLength) {
    // Try to add a damaged spring to block
    arrangements += getArrangements(
      conditions,
      conditionIndex + 1,
      damagedSpringsBlocks,
      damagedSpringBlockIndex,
      damagedSpringBlockLength + 1,
    )
  }

  // Ok spring
  if (damagedSpringBlockLength > 0 && damagedSpringBlockLength < desiredBlockLength) {
    // Invalid configuration, Incomplete block.
    return (cache[key] = arrangements)
  }

  if (
    damagedSpringBlockLength === desiredBlockLength &&
    damagedSpringBlockIndex < damagedSpringsBlocks.length
  ) {
    // Move on to next block.
    damagedSpringBlockIndex++
  }

  // Try to add an Ok spring
  arrangements += getArrangements(
    conditions,
    conditionIndex + 1,
    damagedSpringsBlocks,
    damagedSpringBlockIndex,
    0,
  )

  return (cache[key] = arrangements)
}

var sum = 0
for (const line of lines) {
  var lineParts = line.split(' ')
  var conditions = (lineParts[0] + '?').repeat(5).slice(0, -1)

  var damagedSpringsTmp = lineParts[1].split(',').map((str) => Number(str))

  var damagedSprings = []
  for (let i = 0; i < 5; i++) {
    damagedSprings = damagedSprings.concat(damagedSpringsTmp)
  }
  cache = {}
  sum += getArrangements(conditions, 0, damagedSprings, 0, 0)
}

console.log(sum)
