const inspections = input.map(i => 0)

const operate = (input, [multiplyOrAdd, numberOrSelf]) => {
  if (multiplyOrAdd === '*') input *= (numberOrSelf === 'old') ? input : numberOrSelf
  else if (multiplyOrAdd === '+') input += (numberOrSelf === 'old') ? input : numberOrSelf
  return input
}

const product = input
  .map(({test}) => test)
  .reduce((acc, n) => acc * n);

[...Array(10000)].forEach((_, round) => {
  input.forEach((monkey, monkeyNum) => {
    const {
      items,
      operation,
      test,
      ifTrue,
      ifFalse
    } = monkey

    items.forEach(item => {
      let worryLevel = operate(item, operation) % product
      const toMonkey = ((worryLevel % test) === 0) ? ifTrue : ifFalse
      input[toMonkey].items.push(worryLevel)
      inspections[monkeyNum] += 1
    })
    monkey.items = []
  })
})

inspections.sort((a, b) => b - a)
const [first, second] = inspections
const answer = first * second

console.log(JSON.stringify(input, null, 2))
console.log(inspections)
console.log(answer)
console.log(product)
