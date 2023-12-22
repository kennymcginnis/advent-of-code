import {exec} from "child_process";
import {readFileSync, writeFileSync} from "fs";

const input = readFileSync('input.txt', 'utf8')
const types = [[], []]
const edges = []

let output = 'digraph {\n{\nbroadcaster [shape=invtrapezium]\n'

input.split('\n').forEach((l) => {
  const {
    groups: { t, k, m },
  } = l.match(/(?<t>[%&]?)(?<k>.+) -> (?<m>.+)/)
  if (t === '%') types[0].push(k)
  if (t === '&') types[1].push(k)
  edges.push(`${k} -> ${m}`)
})

output += types[0].join(', ') + ' [shape=diamond]\n'
output += types[1].join(', ') + ' [shape=invhouse]\n'
output += 'rx [shape=trapezium]\n'
output += '}\n'

output += edges.join('\n') + '\n}\n'

writeFileSync('data.dot', output)
exec('dot -Tpng data.dot -o data.png')
