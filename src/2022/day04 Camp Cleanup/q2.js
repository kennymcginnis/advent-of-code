import data from './input.txt'

const fullyContained = data
  .split('\n')
  .map(l => l
    .split(',')
    .map(m => m.split('-').map(Number))
  )
  .filter(pair => {
    const [[start1, end1], [start2, end2]] = pair
    return (start2 <= end1 && start2 >= start1)
      || (start1 <= end2 && start1 >= start2)
  })

console.log(fullyContained.length)
