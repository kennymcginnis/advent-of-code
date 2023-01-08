import sample from './sample.mjs'
import input from './input.mjs'

const log = console.log

function assert() {
  if (arguments.length && !arguments[0]) console.error('assert', ...arguments)
}

const getInput = s =>
  s
    .trim()
    .split(/\s*---[^-]+---\s*/)
    .map(x => x.split(/\s+/).map(x => x.split(/,/).map(x => parseInt(x))))

//find most frequent translation value
function find_common_modifier(arr) {
  let a = arr.slice(0)
  a.sort((x, y) => x.v - y.v)
  let mx = 1,
    cur = 1,
    res = a[0]
  for (let i = 1; i < a.length; i++) {
    if (a[i].v == a[i - 1].v) {
      cur++
    } else {
      if (cur > mx) {
        mx = cur
        res = a[i - 1]
      }
      cur = 1
    }
  }
  if (cur > mx) {
    mx = cur
    res = a[a.length - 1]
  }
  res.occur = mx
  return res
}

//find xyz-translations
function find_translation(a, b) {
  //idx 0-2 for x-translation, 3-5 for y-translation, 6-8 for z-translation
  let arr = [[], [], [], [], [], [], [], [], []]
  function push(ar, c, op, v) {
    ar.push({ c, v, op })
  }
  //compare 3 pairs of beacon
  for (let i = 0; i < 3; i++) {
    //all possible xyz rotated/flipped
    //x translation
    push(arr[0], 0, -1, a[i][0] + b[i][0]) //x0:x1
    push(arr[0], 0, +1, a[i][0] - b[i][0]) //x0:-x1
    push(arr[1], 1, -1, a[i][0] + b[i][1]) //x0:y1
    push(arr[1], 1, +1, a[i][0] - b[i][1]) //x0:-y1
    push(arr[2], 2, -1, a[i][0] + b[i][2]) //x0:z1
    push(arr[2], 2, +1, a[i][0] - b[i][2]) //x0:-z1
    //y translation
    push(arr[3], 1, -1, a[i][1] + b[i][1]) //y0:y1
    push(arr[3], 1, +1, a[i][1] - b[i][1]) //y0:-y1
    push(arr[4], 0, -1, a[i][1] + b[i][0]) //y0:x1
    push(arr[4], 0, +1, a[i][1] - b[i][0]) //y0:-x1
    push(arr[5], 2, -1, a[i][1] + b[i][2]) //y0:z1
    push(arr[5], 2, +1, a[i][1] - b[i][2]) //y0:-z1
    //z translation
    push(arr[6], 2, -1, a[i][2] + b[i][2]) //z0:z1
    push(arr[6], 2, +1, a[i][2] - b[i][2]) //z0:-z1
    push(arr[7], 0, -1, a[i][2] + b[i][0]) //z0:x1
    push(arr[7], 0, +1, a[i][2] - b[i][0]) //z0:-x1
    push(arr[8], 1, -1, a[i][2] + b[i][1]) //z0:y1
    push(arr[8], 1, +1, a[i][2] - b[i][1]) //z0:-y1
  }
  //take 3 from 18 translations (grouped into 9-element array)
  let xyz_translations = []
  for (const mod of arr) {
    let most = find_common_modifier(mod) //find most frequent translation
    //take translations used by 3 pairs of beacon
    if (most.occur == 3) xyz_translations.push(most)
  }
  return xyz_translations //.length == 3
}

function distance(a, b) {
  let sum = 0
  for (const i in a) {
    sum += (a[i] - b[i]) ** 2
  }
  return sum
}

function create_beacon_thumbprints(data) {
  let beacons = []
  data.forEach((scanner, scanner_idx) => {
    scanner.forEach((beacon, beacon_idx) => {
      let bc = { scanner_idx, beacon_idx, peers: [] }

      scanner.forEach((to, to_idx) => {
        if (beacon_idx == to_idx) return
        const d = distance(beacon, to)
        bc.peers.push({ i: to_idx, d })
      }) //loop peers

      //sum 2 nearest distance
      bc.peers.sort((a, b) => a.d - b.d).splice(2)
      bc.sum = bc.peers.reduce((ac, c) => ac + c.d, 0)
      //distance between 2 nearest peers
      bc.psum = distance(scanner[bc.peers[0].i], scanner[bc.peers[1].i])
      //risky hash by distance
      bc.hash = bc.sum * bc.psum
      // to derive translation values later
      bc.tri = [beacon, scanner[bc.peers[0].i], scanner[bc.peers[1].i]]
      beacons.push(bc)
    }) //loop beacon
  }) //loop scanner
  return beacons
}

function main() {
  const ans = []
  const [, ...data] = getInput(input)

  const found_scanners = new Map() //match scanner-N to scanner-0 by 1 matched beacon-tri
  let beacons = create_beacon_thumbprints(data)
  const uniq = new Set(beacons.map(x => x.hash))
  ans[0] = uniq.size

  //part 2
  //loop til all scanners found
  while (found_scanners.size < data.length - 1) {
    //match beacon thumbprint from scanner-0 and scanner-N
    for (const a of beacons.filter(x => x.scanner_idx == 0)) {
      for (const b of beacons.filter(x => x.scanner_idx > 0)) {
        if (found_scanners.has(b.scanner_idx)) continue
        if (a.hash == b.hash) {
          const translations = find_translation(a.tri, b.tri)
          found_scanners.set(b.scanner_idx, { a, b, translations })
        }
      }
    }

    //extend scanner-0 by adding new beacons relative to scanner-0
    for (const [idx, match] of found_scanners) {
      for (const beacon of data[idx]) {
        const t = match.translations
        const a = [
          t[0].v + beacon[t[0].c] * t[0].op, //x
          t[1].v + beacon[t[1].c] * t[1].op, //y
          t[2].v + beacon[t[2].c] * t[2].op, //z
        ]
        //avoid duplicate which confuse thumbprint calculation
        if (!data[0].some(b => b[0] == a[0] && b[1] == a[1] && b[2] == a[2])) data[0].push(a)
      }
    }

    //todo: instead regenerate all, do only for new joined beacons
    //redo thumbprint for new joined beacon
    beacons = create_beacon_thumbprints(data)
  }

  const scanners = [[0, 0, 0]]
  for (const [idx, match] of found_scanners) {
    const t = match.translations
    scanners[idx] = [t[0].v, t[1].v, t[2].v]
  }

  let farthest = 0
  for (const a of scanners) {
    for (const b of scanners) {
      let d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
      farthest = Math.max(d, farthest)
    }
  }
  ans[1] = farthest

  log('Part1: ' + ans[0] + '\nPart2: ' + ans[1])
}

main()
log(new Date().toString())
