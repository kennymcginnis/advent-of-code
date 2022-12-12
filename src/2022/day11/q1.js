const inspections = input.map(i => 0)

const operate = (input, [multiplyOrAdd, numberOrSelf]) => {
  if (multiplyOrAdd === '*') input *= (numberOrSelf === 'old') ? input : numberOrSelf
  else if (multiplyOrAdd === '+') input += (numberOrSelf === 'old') ? input : numberOrSelf
  return input
}

[...Array(20)].forEach((_, round) => {
  input.forEach((monkey, monkeyNum) => {
    const {
      items,
      operation,
      test,
      ifTrue,
      ifFalse
    } = monkey

    let item = items.shift();
    while (item) {
      let worryLevel = Math.floor(operate(item, operation) / 3)
      const toMonkey = ((worryLevel % test) === 0) ? ifTrue : ifFalse
      input[toMonkey].items.push(worryLevel)
      inspections[monkeyNum] += 1
      item = items.shift();
    }
  })
})

inspections.sort((a, b) => b - a)
const [first, second] = inspections
const answer = first * second

console.log(JSON.stringify(input, null, 2))
console.log(inspections)
console.log(answer)
