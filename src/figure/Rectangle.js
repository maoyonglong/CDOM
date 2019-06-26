import { Geometry } from './base'

class Rectangle extends Geometry {
  draw () {
    const ctx = this.context
    return super.draw(function () {
      const { origin, width, height } = this.options
      ctx.rect(origin.x, origin.y, width, height)
    })
  }
  setRange () {
    const { origin, width, height } = this.options
    this.rectRange = [origin, width, height]
  }
}

export default Rectangle
