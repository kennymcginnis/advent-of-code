import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split(''))
}

const run = () => {
  timer = Date.now()
  // Split the input into sections, separating on double newlines before a line starting with digits and 'x'
  const sections = input.split(/\n\n(?=\d+x)/)

  // Parse the first section to count '#' characters in each group
  const groupCounts = sections[0].split(/\n\n/).map((line) => line.match(/[#]/g).length)

  // Parse the remaining sections into arrays of [groupSize, requiredCounts]
  const parsedSections = sections.slice(1).map((section) =>
    section.split(/\n/).map((line) => {
      const [groupSizeStr, requiredCountsStr] = line.split(':')
      const groupSize = eval(groupSizeStr.replace('x', '*'))
      const requiredCounts = requiredCountsStr.match(/\d+/g).map(Number)
      return [groupSize, requiredCounts]
    }),
  )

  // For each parsed section, count how many entries meet the requirement
  const validCounts = parsedSections.map(
    (section) =>
      section.filter(([groupSize, requiredCounts]) => {
        // Calculate the minimum required group size
        const minRequired = requiredCounts.reduce((sum, count, idx) => sum + count * groupCounts[idx], 0)
        return groupSize >= minRequired
      }).length,
  )

  // Get the result from the first parsed section
  const answer = validCounts[0]
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
