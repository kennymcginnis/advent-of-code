const run = () => {
  var partOne = 0
  var partTwo = 0

  str.split('\n').forEach(function (s, i) {
    partOne += s.length - eval(s).length
    partTwo += JSON.stringify(s).length - s.length
  })

  console.log('Part One:', partOne)
  console.log('Part Two:', partTwo)
}

run()
