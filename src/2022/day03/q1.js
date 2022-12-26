import data from './input.txt'

const split = data.split('\n')
const sum = [(acc, curr) => acc + curr, 0]

const answer = split
  .map(l => {
    const half = Math.ceil(l.length / 2);
    return [l.slice(0, half), l.slice(half)]
  })
  .map(l => {
    const [left, right] = l
    const match = [...left].find(i => right.includes(i))
    return match.charCodeAt() - ((match === match.toLowerCase()) ? 96 : 38)
  })
  .reduce(...sum)

console.log({answer})
