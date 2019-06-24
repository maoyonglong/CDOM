import Rectangle from './Rectangle'
import Circle from './Circle'

const figureSelector = {
  rectangle: Rectangle,
  circle: Circle
}

const figureFactory = function (context, type, opts) {
  const Figure = figureSelector[type]
  if (Figure) {
    return new Figure(context, opts)
  } else {
    throw new Error('[error] The figure you want to create is not exist.')
  }
}

export default figureFactory
