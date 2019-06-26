import { compatible, eventUtils } from '../utils/index'

function createGradient (ctx, type, gradient) {
  const range = gradient.range
  const rangeArgs = range[0].concat(range[1])
  let grad = type === 'linear'
    ? ctx.createLinearGradient.apply(ctx, rangeArgs)
    : ctx.createRadialGradient.apply(ctx, rangeArgs)
  gradient.styles.forEach(style => {
    grad.addColorStop(style.position, style.color)
  })
  return grad
}

const Publisher = {
  subscribes: [],
  addSubscribe (geometry) {
    geometry._subIdx = this.subscribes.push(geometry) - 1
  },
  removeSubscribe (geometry) {
    this.subscribes.splice(geometry._subIdx, 1)
  },
  update (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    this.subscribes.forEach(subscribe => {
      subscribe.alreadyApplyStyle = false
      subscribe.draw()
    })
  }
}

class Geometry {
  constructor (context, opts) {
    this.canvas = context.canvas
    this.context = context
    this.options = opts
    this.options.isUpdate = true
    this.setRange()
    this.applyUpdate()
    Publisher.addSubscribe(this)
  }
  setRange () {
    throw new Error('please override the setRangle funciton.')
  }
  draw (cb) {
    const ctx = this.context
    const { stroke, fill } = this.options
    this.resetStyle(ctx)
    this.applyStyle()
    ctx.beginPath()
    cb.call(this)
    ctx.closePath()
    if (stroke) {
      ctx.stroke()
    }
    if (fill) {
      ctx.fill()
    }
    return this
  }
  resetStyle () {
    const ctx = this.context
    ctx.strokeStyle = '#000'
    ctx.fillStyle = '#000'
    ctx.lineWidth = 1
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10.0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  }
  applyStyle () {
    const ctx = this.context
    if (this.alreadyApplyStyle) return
    if (!this.options) return
    const { stroke, fill, common } = this.options
    if (stroke) {
      const { color, line, gradient } = stroke
      if (color) {
        ctx.strokeStyle = color
      }
      if (gradient) {
        ctx.strokeStyle = createGradient(ctx, 'linear', gradient)
      }
      if (line) {
        const { dash, width, cap, join, minterLimit } = line
        if (dash) {
          const { type, offset = 0 } = dash
          if (type) {
            ctx.setLineDash(type)
          }
          if (offset) {
            ctx.lineDashOffset = offset
          }
        }
        if (width) {
          ctx.lineWidth = width
        }
        if (cap) {
          ctx.lineCap = cap
        }
        if (join) {
          ctx.lineJoin = join
        }
        if (minterLimit) {
          ctx.minterLimit = minterLimit
        }
      }
    }
    if (fill) {
      const { color, shadow, gradient } = fill
      if (color) {
        ctx.fillStyle = color
      }
      if (shadow) {
        const { offset, blur, color } = shadow
        ctx.shadowOffsetX = offset.x
        ctx.shadowOffsetY = offset.y
        ctx.shadowBlur = blur
        ctx.shadowColor = color
      }
      if (gradient) {
        ctx.fillStyle = createGradient(ctx, 'fill', gradient)
      }
    }
    if (common) {
      const { alpha } = common
      if (alpha) {
        ctx.globalAlpha = alpha
      }
    }
    this.alreadyApplyStyle = true
  }
  clear () {
    Publisher.removeSubscribe(this)
    Publisher.update(this.context)
  }
  applyUpdate () {
    const self = this
    if (this.options.isUpdate && this.options.update) {
      this.updateIntervalId = compatible.updateInterval.call(this, function () {
        console.log(self.options.isUpdate)
        if (self.options.isUpdate) {
          self.options.update()
        }
      })
    }
  }
  cancelUpdate () {
    this.options.isUpdate = false
    compatible.cancelUpdateInterval(this.updateIntervalId)
  }
  on (type, handler) {
    const canvas = this.canvas
    const rectRange = this.rectRange
    const self = this
    canvas.addEventListener(type, function (e) {
      const { clientX, clientY } = compatible.getClientPos(e)
      const point = eventUtils.windowToCanvas(canvas, clientX, clientY)
      if (eventUtils.isPointInRect(point, rectRange)) {
        handler.call(self, e)
      }
    })
  }
}

export {
  Geometry
}
