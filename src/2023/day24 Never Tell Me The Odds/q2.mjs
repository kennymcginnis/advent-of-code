import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((l) => l.split(' @ ').map((e) => e.split(', ').map(Number)))

const part2 = () => {
  let data = parseInput(input)

  function calc(data) {
    const n = 3
    const N = 400
    const eps = 0.001
    console.time('done')
    console.time('found')
    for (let Vx = -N; Vx < N; Vx++) {
      process.stdout.write('Processing Vx: ' + Vx + '\r')
      for (let Vy = -N; Vy < N; Vy++) {
        for (let Vz = -N; Vz < N; Vz++) {
          const A = Array(6)
            .fill()
            .map(() => Array(5).fill(0))
          const B = Array(6)
            .fill()
            .map(() => [])
          for (let i = 0; i < 2; i++) {
            const [[px, py, pz], [vx, vy, vz]] = data[i]

            A[n * i][0] = 1
            A[n * i + 1][1] = 1
            A[n * i + 2][2] = 1

            A[n * i][3 + i] = Vx - vx
            A[n * i + 1][3 + i] = Vy - vy
            A[n * i + 2][3 + i] = Vz - vz

            B[n * i][0] = px
            B[n * i + 1][0] = py
            B[n * i + 2][0] = pz
          }

          A.pop(), B.pop()
          const invA = matrixInvert(A)
          if (!invA) continue

          const result = matrixMultiply(invA, B)

          if (result[3][0] < 0) continue
          if (result[4][0] < 0) continue

          const [[px, py, pz], [vx, vy, vz]] = data[2]

          const t1 = (px - result[0][0]) / (Vx - vx)
          const t2 = (py - result[1][0]) / (Vy - vy)
          const t3 = (pz - result[2][0]) / (Vz - vz)

          if (Math.abs(t1 - t2) > eps) continue
          if (Math.abs(t1 - t3) > eps) continue
          if (Math.abs(t2 - t3) > eps) continue

          console.timeLog('found')
          console.info(
            Math.round(result[0][0]) + Math.round(result[1][0]) + Math.round(result[2][0]),
            result,
            { Vx, Vy, Vz },
          )
        }
      }
    }
    console.timeEnd('done')
  }

  function matrixMultiply(a, b) {
    const aR = a.length,
      aC = a[0].length,
      bC = b[0].length,
      m = new Array(aR).fill().map(() => new Array(bC).fill(0))
    for (let r = 0; r < aR; ++r) {
      for (let c = 0; c < bC; ++c) {
        for (let i = 0; i < aC; ++i) {
          m[r][c] += a[r][i] * b[i][c]
        }
      }
    }
    return m
  }

  // https://web.archive.org/web/20210406035905/http://blog.acipo.com/matrix-inversion-in-javascript
  // Returns the inverse of matrix `M`.
  function matrixInvert(M) {
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    // if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
      return
    }

    // create the identity matrix (I), and a copy (C) of the original
    var i = 0,
      ii = 0,
      j = 0,
      dim = M.length,
      e = 0,
      t = 0
    var I = [],
      C = []
    for (i = 0; i < dim; i += 1) {
      // Create the row
      I[I.length] = []
      C[C.length] = []
      for (j = 0; j < dim; j += 1) {
        // if we're on the diagonal, put a 1 (for identity)
        if (i == j) {
          I[i][j] = 1
        } else {
          I[i][j] = 0
        }

        // Also, make the copy of the original
        C[i][j] = M[i][j]
      }
    }

    // Perform elementary row operations
    for (i = 0; i < dim; i += 1) {
      // get the element e on the diagonal
      e = C[i][i]

      // if we have a 0 on the diagonal (we'll need to swap with a lower row)
      if (e == 0) {
        // look through every row below the i'th row
        for (ii = i + 1; ii < dim; ii += 1) {
          // if the ii'th row has a non-0 in the i'th col
          if (C[ii][i] != 0) {
            // it would make the diagonal have a non-0 so swap it
            for (j = 0; j < dim; j++) {
              e = C[i][j] //temp store i'th row
              C[i][j] = C[ii][j] //replace i'th row by ii'th
              C[ii][j] = e //repace ii'th by temp
              e = I[i][j] //temp store i'th row
              I[i][j] = I[ii][j] //replace i'th row by ii'th
              I[ii][j] = e //repace ii'th by temp
            }
            // don't bother checking other rows since we've swapped
            break
          }
        }
        // get the new diagonal
        e = C[i][i]
        // if it's still 0, not invertable (error)
        if (e == 0) {
          return
        }
      }

      // Scale this row down by e (so we have a 1 on the diagonal)
      for (j = 0; j < dim; j++) {
        C[i][j] = C[i][j] / e //apply to original matrix
        I[i][j] = I[i][j] / e //apply to identity
      }

      // Subtract this row (scaled appropriately for each row) from ALL of
      // the other rows so that there will be 0's in this column in the
      // rows above and below this one
      for (ii = 0; ii < dim; ii++) {
        // Only apply to other rows (we want a 1 on the diagonal)
        if (ii == i) {
          continue
        }

        // We want to change this element to 0
        e = C[ii][i]

        // Subtract (the row above(or below) scaled by e) from (the
        // current row) but start at the i'th column and assume all the
        // stuff left of diagonal is 0 (which it should be if we made this
        // algorithm correctly)
        for (j = 0; j < dim; j++) {
          C[ii][j] -= e * C[i][j] //apply to original matrix
          I[ii][j] -= e * I[i][j] //apply to identity
        }
      }
    }

    // we've done all operations, C should be the identity
    // matrix I should be the inverse:
    return I
  }

  return calc(data)
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
