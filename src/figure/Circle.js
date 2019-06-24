import { Geometry } from './base'

class Circle extends Geometry {
  draw (origin, center, radius, type) {
    const ctx = this.context
    ctx.beginPath()
    ctx.arc(origin.x + center.x, origin.y + center.y, radius, 0, 2 * Math.PI)
    if (type === 'stroke') {
      ctx.stroke()
    } else if (type === 'fill') {
      ctx.fill()
    } else {
      throw new Error('[error] You should offer the type paramter')
    }
  }
  applyStyle () {
    if (this.options) {
      if (this.options.stroke) {

      }
      if (this.options.fill) {

      }
    }
  }
  stroke (...args) {
    args.push('stroke')
    this.draw.apply(this, args)
  }
  fill (...args) {
    args.push('fill')
    this.draw.apply(this, args)
  }
}

export default Circle
