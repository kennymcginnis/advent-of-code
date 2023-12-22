import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const mods = {}
  const inputs = {}
  input.split('\n').forEach((l) => {
    const {
      groups: { t, k, m },
    } = l.match(/(?<t>[%&]?)(?<k>.+) -> (?<m>.+)/)
    mods[k] = { t, to: m.split(', '), s: 0 }
    m.split(', ').forEach((m) => {
      inputs[m] ??= {}
      inputs[m][k] = 0
    })
  })

  return [mods, inputs]
}

const part1 = () => {
  let [mods, inputs] = parseInput(input)

  let sum = [0, 0]
  const queue = []

  for (let i = 0; i < 1000; i++) {
    sum[0]++
    queue.push(['button', 'broadcaster', 0])
    while (queue.length) {
      let [from, mod, pulse] = queue.shift()
      if (mod === 'output') continue
      if (mod === 'rx') continue
      const { t, to, s } = mods[mod]
      if (mod === 'broadcaster') {
        for (const m of to) queue.push([mod, m, pulse]), sum[pulse]++
        continue
      }
      if (t === '%' && pulse === 0) {
        mods[mod].s = s ? 0 : 1
        const nPulse = s ? 0 : 1
        for (const m of mods[mod].to) queue.push([mod, m, nPulse]), sum[nPulse]++
        continue
      }
      if (t === '&') {
        inputs[mod][from] = pulse
        const nPulse = Object.values(inputs[mod]).every(Boolean) ? 0 : 1
        for (const m of to) queue.push([mod, m, nPulse]), sum[nPulse]++
        continue
      }
    }
  }

  return sum[0] * sum[1]
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
