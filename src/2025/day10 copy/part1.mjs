import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  function parseLine(line) {
    const [, i, b] = line.match(/^\[([.#]+)\]\s+((?:\([\d,]+\)\s*)+)\{([\d,]+)\}$/)
    const indicators = [...i].map((l) => l === '#')
    const buttons = [...b.matchAll(/\(([\d,]+)\)/g)].map((m) => m[1].split(',').map(Number))
    return { indicators, buttons }
  }
  return input.split('\n').map(parseLine)
}

const part1 = () => {
  let data = parseInput(input)
  const minimumPressed = data.map(({ indicators, buttons }, idx) => {
    let minimumPressed = Infinity
    const queue = buttons.map((_, buttonId) => ({
      pressed: 0,
      buttonId,
      state: Array(indicators.length).fill(false),
      history: [buttonId],
    }))
    const visitedStates = new Set()
    while (queue.length) {
      let { pressed, buttonId, state, history } = queue.shift()
      // Track state and buttonId
      const stateKey = state.toString() + ':' + buttonId
      if (visitedStates.has(stateKey)) continue
      else visitedStates.add(stateKey)

      // Prune search if we already have a better solution
      if (++pressed >= minimumPressed) continue

      // Copy state before mutating for next step
      const newState = [...state]
      // Toggle buttons
      buttons[buttonId].forEach((btn) => (newState[btn] = !newState[btn]))

      // Check for solution
      if (newState.every((v, i) => v === indicators[i])) {
        minimumPressed = pressed
        console.log({ idx, minimumPressed, history })
        break
      }

      // Enqueue next states
      buttons.forEach((_, id) => {
        if (id !== buttonId) {
          queue.push({ pressed, buttonId: id, state: newState, history: [...history, id] })
        }
      })
    }
    return minimumPressed
  })
  return minimumPressed.reduce((a, b) => a + b, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
