import data from './input.txt'

let working = ''

data
  .split('')
  .every((r, i) => {
    const curr = working.substring(working.length -3) + r
    if (i > 2 && curr.length === (new Set(curr)).size) return false
    working += r
    return true
  })

console.log(working.length + 1)
