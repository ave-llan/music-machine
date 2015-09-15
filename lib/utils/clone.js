/**
 * helper function to clone a simple object/array made up of primitives.
 * Will not work if the object or array contains non-primitives.
 * @param {object|array} obj - an object array made up only of primitives
 * @returns {object|array} a new clone of the provided object or array
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = clone
