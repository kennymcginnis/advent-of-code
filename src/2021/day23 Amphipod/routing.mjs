const connections = {
  ab: ['at'],
  at: ['ab', '3'],
  bb: ['bt'],
  bt: ['bb', '5'],
  cb: ['ct'],
  ct: ['cb', '7'],
  db: ['dt'],
  dt: ['db', '9'],
  1: ['2'],
  2: ['1', '3'],
  3: ['2', 'at', '4'],
  4: ['3', '5'],
  5: ['4', 'bt', '6'],
  6: ['5', '7'],
  7: ['6', 'ct', '8'],
  8: ['7', '9'],
  9: ['8', 'dt', '10'],
  10: ['9', '11'],
  11: ['10'],
}

const routing = () => {
  let routes = Object.keys(connections).reduce((a, i) => ((a[i] = {}), a), {})
  let queue = Object.keys(connections).map(o => [o])

  while (queue.length) {
    let route = queue.shift()
    let [first] = route
    let last = route[route.length - 1]
    if (route.length > '1' && !['3', '5', '7', '9'].includes(last)) {
      let [self, ...rest] = route
      routes[first][last] = rest
    }
    queue.push(...connections[last].filter(l => !route.includes(l)).map(m => [...route, m]))
  }
  return routes
}

export default routing
