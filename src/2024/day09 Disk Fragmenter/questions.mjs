import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let data = [...input]

  let index = 0
  let disk_map = []
  while (data.length) {
    let file_length = data.shift()
    disk_map.push(...Array.from({ length: file_length }).fill(index))
    index++

    if (data.length) {
      let free_space = data.shift()
      disk_map.push(...Array.from({ length: free_space }).fill('.'))
    }
  }

  let first_available = 0
  let last_used = disk_map.length - 1
  while (true) {
    while (disk_map[first_available] !== '.') first_available++
    while (disk_map[last_used] === '.') last_used--
    if (first_available > last_used) break
    disk_map[first_available] = disk_map[last_used]
    disk_map[last_used] = '.'
  }

  return disk_map.reduce((agg, cur, index) => (cur !== '.' ? (agg += cur * index) : agg), 0)
}

const part2 = () => {
  let data = [...input].map((size, index) => ({
    length: Number(size),
    index: index % 2 === 0 ? Math.floor(index / 2) : null,
  }))

  let current_index = data.length
  while (current_index > 0) {
    current_index--
    if (data[current_index].index === null) continue

    const curr_len = data[current_index].length
    let available_space = data.findIndex((d, i) => i < current_index && d.index === null && d.length >= curr_len)
    if (available_space >= 0) {
      const remaining_empty = data[available_space].length - curr_len
      data[available_space] = { ...data[current_index] }
      if (remaining_empty > 0) {
        data.splice(available_space + 1, 0, { length: remaining_empty, index: null })
        current_index++
      }
      if (data[current_index - 1].index === null) {
        if (data?.[current_index + 1]?.index === null) {
          // merge previous, current and next
          data[current_index - 1].length += curr_len + data[current_index + 1].length
          data.splice(current_index, 2)
        } else {
          // merge previous, current
          data[current_index - 1].length += curr_len
          data.splice(current_index, 1)
        }
      } else {
        if (data[current_index + 1].index === null) {
          // merge current and next
          data[current_index].length += data[current_index + 1].length
          data[current_index].index = null
          data.splice(current_index + 1, 1)
        } else {
          // no merge
          data[current_index].index = null
        }
      }
    }
  }

  return data
    .map(({ length, index }) => Array.from({ length }).fill(index ?? '.'))
    .flat()
    .reduce((agg, cur, index) => (cur !== '.' ? (agg += cur * index) : agg), 0)
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
