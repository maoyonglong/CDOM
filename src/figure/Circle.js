import { Geometry } from './base'

class Circle extends Geometry {
  draw () {
    const ctx = this.context
    return super.draw(function () {
      const { origin, radius } = this.options
      ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI)
    })
  }
  setRange () {
    const { origin, radius } = this.options
    this.rectRange = [{
      x: origin.x - radius,
      y: origin.y - radius
    }, 2 * radius, 2 * radius]
  }
}

export default Circle
