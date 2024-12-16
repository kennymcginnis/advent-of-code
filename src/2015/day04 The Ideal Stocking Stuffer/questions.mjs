import md5 from 'blueimp-md5'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const secretKey = 'bgvyzdsv'

const part1 = () => {
  var num = 0
  var hash = md5(secretKey + num)

  while (hash.slice(0, 5) !== '00000') {
    num++
    hash = md5(secretKey + num)
  }

  return num
}

const part2 = () => {
  var num = 0
  var hash = md5(secretKey + num)

  while (hash.slice(0, 6) !== '000000') {
    num++
    hash = md5(secretKey + num)
  }

  return num
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
