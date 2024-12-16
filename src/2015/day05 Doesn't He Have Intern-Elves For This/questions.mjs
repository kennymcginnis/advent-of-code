import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n')

const part1 = (data) => {
  const isNice = (row) => {
    // It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
    var vowels = row.match(/[aeiou]/g)
    // It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
    var doubles = row.match(/([a-z])\1/)
    // It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
    var badCouplet = row.match(/ab|cd|pq|xy/)
    return vowels && vowels.length >= 3 && !badCouplet && doubles
  }

  return data.filter(isNice).length
}

const part2 = (data) => {
  const isNice = (row) => {
    // It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
    var repeat = row.match(/([a-z][a-z])[a-z]*\1/)
    // It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.
    var zxz = row.match(/([a-z])[a-z]\1/)
    return repeat && zxz
  }
  return data.filter(isNice).length
}

const run = () => {
  let data = parseInput(input)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
