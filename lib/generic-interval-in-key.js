var genericIntervalInKey = function (Key, startPitch) {
  return function (intervalSize) {
    return Key.plusInterval(startPitch, intervalSize)
  }
}

module.exports = genericIntervalInKey
