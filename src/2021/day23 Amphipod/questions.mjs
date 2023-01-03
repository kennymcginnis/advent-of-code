import sample from './sample.mjs'
import input from './input.mjs'
import routing from './routing.mjs'
// import { MaxPriorityQueue } from '@datastructures-js/priority-queue'
const MinHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}}; // prettier-ignore

let printing = true
let routes = routing()
const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oopst', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const isNumeric = string => !isNaN(string)
const amphipods = {
  a: { energy: 1, rooms: ['at', 'ab'] },
  b: { energy: 10, rooms: ['bt', 'bb'] },
  c: { energy: 100, rooms: ['ct', 'cb'] },
  d: { energy: 1000, rooms: ['dt', 'db'] },
}

const ignored = ['key', 'from', 'to', 'energy', 'previous']

function move(state, from, to) {
  const amphipod = state[from]
  let moved = {
    ...state,
    from,
    to,
    [from]: false,
    [to]: amphipod,
    energy: state.energy + routes[from][to].length * amphipods[amphipod].energy,
    previous: state,
  }
  moved.key = stringify(moved)
  return moved
}

function stringify(state) {
  const p = i => state[i] || '.'
  return `${p('1')}${p('2')}[${p('at')}${p('ab')}]${p('4')}[${p('bt')}${p('bb')}]${p('6')}[${p('ct')}${p('cb')}]${p('8')}[${p('dt')}${p('db')}]${p('10')}${p('11')}` // prettier-ignore
}

function complete(state) {
  return Object.entries(amphipods).every(([a, amphipod]) => {
    let [top, bottom] = amphipod.rooms
    return state[top] === a && state[bottom] === a
  })
}

function isValid(state, from, to) {
  if (state[to]) return false
  const amphipod = state[from]
  const [top, bottom] = amphipods[amphipod].rooms
  // Don't move from correct spots
  if (from === top && state[bottom] === amphipod) return false
  if (from === bottom) return false
  // hallways
  if (isNumeric(to) && !isNumeric(from)) return true
  // Once an amphipod stops moving in the hallway, it will stay in that spot until it can move into a room
  if (isNumeric(to) && isNumeric(from)) return false
  // Amphipods will never move from the hallway into a room unless that room is their destination room
  if (!isNumeric(to) && to !== top && to !== bottom) return false
  // and that room contains no amphipods which do not also have that room as their own destination.
  if (to === top && (!state[bottom] || state[bottom] !== amphipod)) return false

  return true
}

function isClear(state, from, to) {
  return Object.values(routes[from][to]).every(step => !state[step])
}

const route = data => {
  let completed = []
  let visited = new Map()

  data.key = stringify(data)
  let queue = [[0, data]]

  while (queue.length) {
    const [cost, state] = MinHeap.pop(queue)

    if (complete(state)) {
      return state.energy
    }

    Object.keys(state)
      .filter(from => state[from] && !ignored.includes(from))
      .map(from =>
        Object.keys(routes[from])
          .filter(to => isValid(state, from, to))
          .filter(to => isClear(state, from, to))
          .map(to => move(state, from, to))
          .filter(next => !visited.has(next.key) || next.energy < visited.get(next.key)),
      )
      .flat()
      .forEach(next => {
        visited.set(next.key, next)
        MinHeap.push(queue, [next.energy, next])
      })
  }
  return completed
}

const part1 = () => {
  let data = input
  return route(data)
}

const part2 = () => {
  return
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

const test = () => {
  assertEquals(
    complete({
      ab: 'a',
      at: 'a',
      bb: 'b',
      bt: 'b',
      cb: 'c',
      ct: 'c',
      db: 'd',
      dt: 'd',
    }),
    true,
  )
}

run()
