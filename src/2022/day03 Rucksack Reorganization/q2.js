import data from './input.txt'

const split = data.split('\n')

function* chunks(array, n) {
  for (let i = 0; i < array.length; i += n) yield array.slice(i, i + n);
}
const chunked = [...chunks(split, 3)]

const answer = chunked
  .reduce((agg, cur) => {
    const [first, second, third] = cur
    const match = [...first].find(i => second.includes(i) && third.includes(i))
    agg += match.charCodeAt() - ((match === match.toLowerCase()) ? 96 : 38)
    return agg
  }, 0)

console.log(answer)
