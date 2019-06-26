function isCanvasSupport (canvas) {
  return canvas.getContext && typeof canvas.getContext === 'function'
}

function getClientPos (e) {
  const type = e.type
  const touchEvents = ['touchstart', 'touchmove', 'touchend']
  if (touchEvents.indexOf(type) >= 0) {
    let { pageX, pageY } = e.touches[0]
    return { clientX: pageX - window.scrollX, clientY: pageY - window.scrollY }
  } else {
    return { clientX: e.clientX, clientY: e.clientY }
  }
}

function updateInterval (cb) {
  const self = this
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(function () {
      cb()
      self.updateIntervalId = updateInterval.call(self, cb)
    })
  } else {
    return window.setInterval(cb, 1000 / 60)
  }
}

function cancelUpdateInterval (id) {
  if (window.requestAnimationFrame) {
    window.cancelAnimationFrame(id)
  } else {
    window.clearInterval(id)
  }
}

export default {
  isCanvasSupport,
  getClientPos,
  updateInterval,
  cancelUpdateInterval
}
