import data from './input.txt'

const fullyContained = data
  .split('\n')
  .map(l => l
    .split(',')
    .map(m => m.split('-').map(Number))
  )
  .filter(pair => {
    const [[minL, maxL], [minR, maxR]] = pair
    return (minL >= minR && maxL <= maxR)
      || (minR >= minL && maxR <= maxL)
  })

console.log(fullyContained.length)
