import data from './sample.txt'

const input = JSON.parse('[' + data.replaceAll('\n\n', ',').replaceAll('\n', ',') + ']')

const compare = ([left, right]) => {

  let leftIsArray = Array.isArray(left)
  let rightIsArray = Array.isArray(right)

  if (leftIsArray || rightIsArray) {
    if (!leftIsArray) left = [left]
    if (!rightIsArray) right = [right]

    for (let i = 0; i < left.length; i++) {
      //If the right list runs out of items first, the inputs are not in the right order.
      if (right[i] === undefined) return false

      let correctOrder = compare([left[i], right[i]])
      if (correctOrder !== undefined) return correctOrder
    }

    // If left ran out, it is correct order, otherwise no order is found
    return left.length < right.length ? true : undefined
  } else {
    // Left side is smaller, so correct order
    if (left < right) return true;
    // Right side is smaller, so wrong order
    if (left > right) return false
    // Otherwise no order is found
  }
}

input.sort((a, b) => compare([a, b]) ? -1 : 1)
console.log(input)
