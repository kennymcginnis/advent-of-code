import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const required = {
  byr: 'Birth Year', //  - four digits; at least 1920 and at most 2002.
  iyr: 'Issue Year', //  - four digits; at least 2010 and at most 2020.
  eyr: 'Expiration Year', //  - four digits; at least 2020 and at most 2030.
  hgt: 'Height', // - a number followed by either cm or in:
  hcl: 'Hair Color', //  - a # followed by exactly six characters 0-9 or a-f.
  ecl: 'Eye Color', //  - exactly one of: amb blu brn gry grn hzl oth.
  pid: 'Passport ID', //  - a nine-digit number, including leading zeroes.
  cid: 'Country ID', //  - ignored, missing or not.
}

const parseInput = input => {
  return input.split('\n\n').map(passport => {
    let joined = passport
      .split('\n')
      .map(line => line.split(' '))
      .flat()
    return joined.reduce((agg, item) => {
      let [key, value] = item.split(':')
      agg[key] = value
      return agg
    }, {})
  })
}

const part1 = () => {
  let data = parseInput(input)
  return Object.values(data).filter(
    passport =>
      Object.keys(passport).length === 8 || (Object.keys(passport).length === 7 && !passport.cid),
  ).length
}

const part2 = () => {
  let data = parseInput(input)
  return Object.values(data)
    .filter(
      passport =>
        Object.keys(passport).length === 8 || (Object.keys(passport).length === 7 && !passport.cid),
    )
    .filter(({ byr, iyr, eyr, hgt, hcl, ecl, pid, cid }) => {
      // byr: 'Birth Year', //  - four digits; at least 1920 and at most 2002.
      if (byr.length !== 4 || 1920 > Number(byr) || Number(byr) > 2002) return false
      // iyr: 'Issue Year', //  - four digits; at least 2010 and at most 2020.
      if (iyr.length !== 4 || 2010 > Number(iyr) || Number(iyr) > 2020) return false
      // eyr: 'Expiration Year', //  - four digits; at least 2020 and at most 2030.
      if (eyr.length !== 4 || 2020 > Number(eyr) || Number(eyr) > 2030) return false
      // hcl: 'Hair Color', //  - a # followed by exactly six characters 0-9 or a-f.
      if (!/^#[a-f0-9]{6}$/.test(hcl)) return false
      // ecl: 'Eye Color', //  - exactly one of: amb blu brn gry grn hzl oth.
      if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl)) return false
      // pid: 'Passport ID', //  - a nine-digit number, including leading zeroes.
      if (isNaN(pid) || pid.length !== 9) return false
      // cid: 'Country ID', //  - ignored, missing or not.
      // hgt: 'Height', //  - a number followed by either cm or in:
      let height = Number(hgt.substring(0, hgt.length - 2))
      let unit = hgt.substring(hgt.length - 2)
      if (unit === 'cm') {
        if (!height || 150 > height || height > 193) return false
      } else if (unit === 'in') {
        if (!height || 59 > height || height > 76) return false
      } else {
        return false
      }
      return true
    }).length // < 152
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
