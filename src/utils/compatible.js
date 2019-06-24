function isCanvasSupport (canvas) {
  return canvas.getContext && typeof canvas.getContext === 'function'
}

export default {
  isCanvasSupport
}
