import input from './input.mjs'
import { randomUUID } from 'crypto'

function isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'

  return (
    nonNullObject &&
    Object.prototype.toString.call(val) !== '[object RegExp]' &&
    Object.prototype.toString.call(val) !== '[object Date]'
  )
}

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return clone && isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, optionsArgument)
    : value
}

function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument)
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}

function mergeObject(target, source, optionsArgument) {
  var destination = {}
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument)
    })
  }
  Object.keys(source).forEach(function (key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument)
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument)
    }
  })
  return destination
}

function overwriteMerge(destinationArray, sourceArray, options) {
  return sourceArray
}

function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source)
  var options = optionsArgument || { arrayMerge: overwriteMerge }
  var arrayMerge = options.arrayMerge || defaultArrayMerge

  if (array) {
    return Array.isArray(target)
      ? arrayMerge(target, source, optionsArgument)
      : cloneIfNecessary(source, optionsArgument)
  } else {
    return mergeObject(target, source, optionsArgument)
  }
}

function deepmergeAll(array, optionsArgument) {
  if (!Array.isArray(array) || array.length < 2) {
    throw new Error('first argument should be an array with at least two elements')
  }

  // we are sure there are at least 2 values, so it is safe to have no initial value
  return array.reduce(function (prev, next) {
    return deepmerge(prev, next, optionsArgument)
  })
}

const output = deepmerge(input, {
  offer: {
    disc_type_cd: 'P',
    offer_details: {
      rdm_freq_ct: '1',
      case_type_cd: 'F1',
    },
  },
  elig_crit: {
    min_cumlt_mer_spend_am: '',
    max_award_cap_am: '9999999999999.99',
    disc_am: '23.00',
    min_trans_am: '233.00',
  },
})

output.offer.funding_struct_dtls.funding_srce_options[0].aggregated_fund_thld_amt = '300'

console.log(JSON.stringify(output, null, 2))
console.log(randomUUID())
