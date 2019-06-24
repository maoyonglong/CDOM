import figureFactory from './src/figure/index'
import { compatible } from './src/utils/index'

class Context {
  constructor (canvas) {
    if (compatible.isCanvasSupport(canvas)) {
      this.canvas = canvas
      this._context = canvas.getContext('2d')
    } else {
      throw new Error(`[error] Your browser don't support canvas.`)
    }
  }
  getContext () {
    return this._context
  }
  setContext (context) {
    this._context = context
  }
  resizeCanvas (width, height) {
    this.canvas.width = width
    this.canvas.height = height
  }
  createFigure (type, opts) {
    return figureFactory(this._context, type, opts)
  }
}

export default Context
