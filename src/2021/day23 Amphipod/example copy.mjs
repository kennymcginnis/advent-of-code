import _ from 'underscore'
import { MinPriorityQueue } from '@datastructures-js/priority-queue'

// Board is just a 26 char string representing each spot. The hallway
// is the first 11 places, then chunks of four for each room.
WINNING_BOARD = '...........AAAABBBBCCCCDDDD'
MOVE_COST = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
}
HALLWAY = [0, 1, 3, 5, 7, 9, 10] // hallway cells that aren't doors
DOOR = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
}
ROOM = {
  A: [11, 12, 13, 14],
  B: [15, 16, 17, 18],
  C: [19, 20, 21, 22],
  D: [23, 24, 25, 26],
}

// Is cell c in board b at its final spot. No more moves.
const is_final = (b, c) =>
  _.contains(ROOM[b[c]], c) && _.every(ROOM[b[c]], c0 => c0 < c || b[c0] == b[c])

// Inclusive of x, not of y.
const hallway_clear = (b, x, y) => _.every(_.range(x, y).map(i => b[i] == '.'))

// Hallway pieces always have exactly zero or one moves, which is to its final
// resting place. This returns the move, if possible, for a piece on cell c
// given board b.
function hallway_moves(b, c) {
  // Can we access the door do our room?
  if (!hallway_clear(b, DOOR[b[c]], c)) return []
  room = ROOM[b[c]]

  // Figure out which space in a room to target. This is really inelegant :(
  target = -1
  if (b[room[0]] != '.') return [] // Room full
  if (b[room[3]] == '.') target = room[3]
  if (b[room[2]] == '.' && b[room[3]] == b[c]) target = room[2]
  if (b[room[1]] == '.' && b[room[3]] == b[c] && b[room[2]] == b[c]) target = room[1]
  if (b[room[3]] == b[c] && b[room[2]] == b[c] && b[room[1]] == b[c]) target = room[0]

  // Can't target anywhere, likely a foreign piece still in the room
  if (target == -1) {
    return []
  }

  // Calc distance, create a new string, and return to enqueue
  distance = Math.abs(c - DOOR[b[c]]) + 1 + room.indexOf(target)
  nb = b.substr(0, target) + b[c] + b.substr(target + 1)
  nb = nb.substr(0, c) + '.' + nb.substr(c + 1)
  // A note on cost: this is the cost of this move and not cumulative.
  return { board: nb, cost: distance * MOVE_COST[b[c]] }
}

// For a piece in a room, calculate all its possible moves.
function room_moves(b, c) {
  room_index = Math.floor((c - 11) / 4) // to which room am I in?
  door = 2 + 2 * room_index // what's the door to my current room?
  room_pos = (c - 11) % 4 // where am I in the room? 0 = top, 3 = bottom

  // Check that there's nobody blocking the door
  if (room_pos > 0 && b[c - 1] != '.') return []

  // Find unoccupied hallway spots with a clear path from the door
  targets = HALLWAY.filter(a => b[a] == '.')
  targets = targets.filter(t => hallway_clear(b, door, t))

  // For each target: calc distance, create a new string, and return to enqueue
  return targets.map(t => {
    distance = Math.abs(t - door) + 1 + room_pos
    let nb = b.substr(0, t) + b[c] + b.substr(t + 1)
    nb = nb.substr(0, c) + '.' + nb.substr(c + 1)
    // A note on cost: this is the cost of this move and not cumulative.
    return { board: nb, cost: distance * MOVE_COST[b[c]] }
  })
}

// Return all possible moves for piece c on board b. No processing
// necessary for empty spaces and final spaces. Everything else gets
// thrown to different functions depending on whetehr it's a hallway.
function gen_moves(b, c) {
  if (b[c] == '.') return []
  if (is_final(b, c)) return []
  return c < 11 ? hallway_moves(b, c) : room_moves(b, c)
}

// Standard Djikstra. Queue priority is the cost to get to that board.
function djikstra(initial_board) {
  q = new MinPriorityQueue()

  // Initial board, zero cost and zero priority.
  q.enqueue({ board: initial_board, cost: 0 }, 0)
  seen = new Set()

  while (q.size()) {
    cur = q.dequeue()
    ;[board, cost] = [cur.element.board, cur.element.cost]
    if (!seen.has(board)) {
      seen.add(board)

      if (board == WINNING_BOARD) {
        return cost
      } else {
        // For each position 0..26 find any possible moves and enqueue unless
        // previously evaluated. Queue priority is the cost to get to that position.
        new_moves = _.flatten(
          _.range(27).map(c => gen_moves(board, c)),
          1,
        )
        _.each(
          new_moves,
          move =>
            seen.has(move.board) ||
            q.enqueue({ board: move.board, cost: cost + move.cost }, cost + move.cost),
        )
      }
    }
  }
  return -1 // No solution possible.
}

// Screw input parsing... I'll just type it out.
INITIAL_BOARD = '...........ADDCDCBCABADBACB'
console.log(djikstra(INITIAL_BOARD))
