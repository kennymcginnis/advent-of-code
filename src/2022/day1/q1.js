const sample = [1, 2, 3, null, 4, null, 5, 6, null, 7, 8, 9, null, 10];
let elves = []
let index = 0
sample.forEach(a => {
  if (!a) index++
  else elves[index] += a
})
let largest = 0
let largestIndex = null
elves.forEach((a, i) => {
  if (a > largest) {
    largest = a;
    largestIndex = i;
  }
})
