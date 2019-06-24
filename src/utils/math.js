function degToAngle (deg) {
  return deg * Math.PI / 180
}

function angleToDeg (angle) {
  return angle * 180 / Math.PI
}

export default {
  degToAngle,
  angleToDeg
}
