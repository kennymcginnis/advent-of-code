let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let players = {
    1: { player: 1, position: 10, score: 0 },
    2: { player: 2, position: 8, score: 0 },
  }

  let player, roll
  let turn = 1
  let lastRoll = 0
  let noWinner = true
  while (noWinner) {
    player = 2 - (turn % 2)
    roll = (lastRoll + 1) * 3 + 3
    players[player].positionition = (players[player].positionition + roll) % 10 || 10
    players[player].score += players[player].positionition
    lastRoll += 3
    noWinner = players[player].score < 1000
    if (printing) console.log(players[player])
    turn++
  }

  player = 2 - (turn % 2)
  return lastRoll * players[player].score
}

const part2 = () => {
  var diceMap = {}
  for (let diceOne = 1; diceOne <= 3; diceOne++) {
    for (let diceTwo = 1; diceTwo <= 3; diceTwo++) {
      for (let diceThree = 1; diceThree <= 3; diceThree++) {
        var outcome = diceOne + diceTwo + diceThree
        if (!diceMap.hasOwnProperty(outcome)) diceMap[outcome] = 0
        diceMap[outcome]++
      }
    }
  }

  var outcomes = Object.keys(diceMap).map(Number)
  var maxOutcome = Math.max(...outcomes)
  var minOutcome = Math.min(...outcomes)

  function quantum(p1, p2, turn = 1) {
    const current = turn ? p1 : p2

    if (p1.score >= 21) return 1
    if (p2.score >= 21) return 0

    let sum = 0

    for (let outcome = minOutcome; outcome <= maxOutcome; outcome++) {
      const oldPos = current.position
      const oldScore = current.score

      current.position = (current.position + outcome) % 10 || 10
      current.score += current.position

      sum += diceMap[outcome] * quantum(p1, p2, !turn)

      current.position = oldPos
      current.score = oldScore
    }

    return sum
  }

  return quantum({ player: 1, position: 10, score: 0 }, { player: 2, position: 8, score: 0 })
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
