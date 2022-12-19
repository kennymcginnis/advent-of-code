import input from './input.mjs'
// import input from './sample.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const free = { clay: 0, obsidian: 0 }
const parseInput = () =>
  input.split('\n').map(blueprint => {
    let bp = blueprint.match(/\d+/g).map(Number)
    return {
      number: bp[0],
      ore: { ...free, ore: bp[1] },
      clay: { ...free, ore: bp[2] },
      geode: { ...free, ore: bp[5], obsidian: bp[6] },
      obsidian: { ...free, ore: bp[3], clay: bp[4] },
    }
  })

const testBlueprint = (blueprint, time) => {
  let max = {
    ore: Math.max(
      blueprint.ore.ore,
      blueprint.clay.ore,
      blueprint.obsidian.ore,
      blueprint.geode.ore,
    ),
    clay: blueprint.obsidian.clay,
  }

  let maxGeode = 0

  const canBuildRobot = ({ resources, blueprint }) => {
    return (
      blueprint.ore <= resources.ore &&
      blueprint.clay <= resources.clay &&
      blueprint.obsidian <= resources.obsidian
    )
  }

  const buildTime = ({ resources, robots, blueprint }) => {
    return Math.max(
      Math.ceil((blueprint.ore - resources.ore) / robots.ore),
      blueprint.clay && robots.clay && Math.ceil((blueprint.clay - resources.clay) / robots.clay),
      blueprint.obsidian &&
        robots.obsidian &&
        Math.ceil((blueprint.obsidian - resources.obsidian) / robots.obsidian),
    )
  }

  const timeUntilCompletion = data => 1 + (canBuildRobot(data) ? 0 : buildTime(data))

  const updateResources = ({ resources, timeSkip, robots, blueprint }) => {
    return {
      ore: resources.ore + timeSkip * robots.ore - blueprint.ore,
      clay: resources.clay + timeSkip * robots.clay - blueprint.clay,
      obsidian: resources.obsidian + timeSkip * robots.obsidian - blueprint.obsidian,
      geodes: resources.geodes,
    }
  }

  const buildRobot = data => {
    let { time, throttle, robots, constructing } = data
    let timeSkip = timeUntilCompletion(data)
    if (time - timeSkip > (throttle || 0)) {
      let resources = updateResources({ ...data, timeSkip })
      if (constructing === 'geode') {
        resources.geodes += time - timeSkip
      } else {
        robots = { ...robots, [constructing]: robots[constructing] + 1 }
      }
      search({ time: time - timeSkip, resources, robots })
    }
  }

  const search = data => {
    if (data.time < 1) return
    if (data.resources.geodes > maxGeode) maxGeode = data.resources.geodes

    //Build geode robot
    if (data.robots.obsidian > 0) {
      buildRobot({ ...data, constructing: 'geode', blueprint: blueprint.geode })
      if (canBuildRobot({ ...data, blueprint: blueprint.geode })) return
    }

    if (data.robots.clay > 0)
      buildRobot({ ...data, constructing: 'obsidian', blueprint: blueprint.obsidian, throttle: 2 })
    if (data.robots.clay < max.clay)
      buildRobot({ ...data, constructing: 'clay', blueprint: blueprint.clay, throttle: 3 })
    if (data.robots.ore < max.ore)
      buildRobot({ ...data, constructing: 'ore', blueprint: blueprint.ore, throttle: 4 })
  }

  let robots = { ore: 1, clay: 0, obsidian: 0 }
  let resources = { ore: 0, clay: 0, obsidian: 0, geodes: 0 }
  search({ time, robots, resources })
  console.log('Blueprint max: ' + maxGeode)
  return maxGeode
}

const part1 = () => {
  const blueprints = parseInput()

  let qualityLevel = 0
  for (const blueprint of blueprints) {
    qualityLevel += blueprint.number * testBlueprint(blueprint, 24)
  }
  console.log({ part1: qualityLevel })
}

const part2 = () => {
  timingMonitor()

  const blueprints = parseInput()

  let result = 1
  for (let i = 0; i < 3; i++) {
    result *= testBlueprint(blueprints[i], 32)
  }
  console.log({ part2: result })

  console.log(timingMonitor())
}

part1()
part2()
