export const sumArray = (arr) => arr.reduce((a, b) => a + b)
export const multiplyArray = (arr) => arr.reduce((a, b) => a * b)
export const sumObjectValues = (obj) => sumArray(Object.values(obj))
