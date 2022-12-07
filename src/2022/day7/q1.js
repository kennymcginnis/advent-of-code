import data from './input.txt'

let drive = {size: 0}
let curr = {}
let answer = 0

const command = (command, dir) => {
  switch (command) {
    case 'cd':
      cd(dir)
      break
    case 'ls': // ignored
    default:   // ignored
  }
}

const cd = dir => {
  switch (dir) {
    case '/':
      curr = drive
      break
    case '..':
      curr = curr.parent
      break
    default:
      curr = curr[dir]
      break
  }
}

const size = obj => {
  Object.keys(obj).forEach(k => {
    switch (k) {
      case 'parent': // ignored
      case 'size':   // ignored
        break
      default:
        if (typeof obj[k] === 'object') obj.size += size(obj[k])
        if (typeof obj[k] === 'number') obj.size += obj[k]
    }
  })
  if (obj.size <= 100000) answer += obj.size
  return obj.size
}

data
  .split('\n')
  .map(r => r.split(' '))
  .forEach(r => {
    const [first, second, third] = r
    switch (first) {
      case '$':
        command(second, third);
        break
      case 'dir':
        curr[second] = {parent: curr, size: 0}
        break
      default:
        curr[second] = Number(first)
        break
    }
  })

size(drive)

console.dir(drive)
console.log({answer})
