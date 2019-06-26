function windowToCanvas (canvas, x, y) {
  const bbox = canvas.getBoundingClientRect()
  return {
    x: (x - bbox.left) * (canvas.width / bbox.width),
    y: (y - bbox.top) * (canvas.height / bbox.height)
  }
}

function isPointInRect (point, rectRange) {
  if (point.x < rectRange[0].x) return false
  if (point.y < rectRange[0].y) return false
  if (point.x > rectRange[0].x + rectRange[1]) return false
  if (point.y > rectRange[0].y + rectRange[2]) return false
  return true
}

export default {
  windowToCanvas,
  isPointInRect
}
