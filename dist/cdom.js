(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CDOM = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function isCanvasSupport(canvas) {
    return canvas.getContext && typeof canvas.getContext === 'function';
  }

  function getClientPos(e) {
    var type = e.type;
    var touchEvents = ['touchstart', 'touchmove', 'touchend'];

    if (touchEvents.indexOf(type) >= 0) {
      var _e$touches$ = e.touches[0],
          pageX = _e$touches$.pageX,
          pageY = _e$touches$.pageY;
      return {
        clientX: pageX - window.scrollX,
        clientY: pageY - window.scrollY
      };
    } else {
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }
  }

  function updateInterval(cb) {
    var self = this;

    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(function () {
        cb();
        self.updateIntervalId = updateInterval.call(self, cb);
      });
    } else {
      return window.setInterval(cb, 1000 / 60);
    }
  }

  function cancelUpdateInterval(id) {
    if (window.requestAnimationFrame) {
      window.cancelAnimationFrame(id);
    } else {
      window.clearInterval(id);
    }
  }

  var compatible = {
    isCanvasSupport: isCanvasSupport,
    getClientPos: getClientPos,
    updateInterval: updateInterval,
    cancelUpdateInterval: cancelUpdateInterval
  };

  function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
      x: (x - bbox.left) * (canvas.width / bbox.width),
      y: (y - bbox.top) * (canvas.height / bbox.height)
    };
  }

  function isPointInRect(point, rectRange) {
    if (point.x < rectRange[0].x) return false;
    if (point.y < rectRange[0].y) return false;
    if (point.x > rectRange[0].x + rectRange[1]) return false;
    if (point.y > rectRange[0].y + rectRange[2]) return false;
    return true;
  }

  var eventUtils = {
    windowToCanvas: windowToCanvas,
    isPointInRect: isPointInRect
  };

  function createGradient(ctx, type, gradient) {
    var range = gradient.range;
    var rangeArgs = range[0].concat(range[1]);
    var grad = type === 'linear' ? ctx.createLinearGradient.apply(ctx, rangeArgs) : ctx.createRadialGradient.apply(ctx, rangeArgs);
    gradient.styles.forEach(function (style) {
      grad.addColorStop(style.position, style.color);
    });
    return grad;
  }

  var Publisher = {
    subscribes: [],
    addSubscribe: function addSubscribe(geometry) {
      geometry._subIdx = this.subscribes.push(geometry) - 1;
    },
    removeSubscribe: function removeSubscribe(geometry) {
      this.subscribes.splice(geometry._subIdx, 1);
    },
    update: function update(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.subscribes.forEach(function (subscribe) {
        subscribe.alreadyApplyStyle = false;
        subscribe.draw();
      });
    }
  };

  var Geometry =
  /*#__PURE__*/
  function () {
    function Geometry(context, opts) {
      _classCallCheck(this, Geometry);

      this.canvas = context.canvas;
      this.context = context;
      this.options = opts;
      this.options.isUpdate = true;
      this.setRange();
      this.applyUpdate();
      Publisher.addSubscribe(this);
    }

    _createClass(Geometry, [{
      key: "setRange",
      value: function setRange() {
        throw new Error('please override the setRangle funciton.');
      }
    }, {
      key: "draw",
      value: function draw(cb) {
        var ctx = this.context;
        var _this$options = this.options,
            stroke = _this$options.stroke,
            fill = _this$options.fill;
        this.resetStyle(ctx);
        this.applyStyle();
        ctx.beginPath();
        cb.call(this);
        ctx.closePath();

        if (stroke) {
          ctx.stroke();
        }

        if (fill) {
          ctx.fill();
        }

        return this;
      }
    }, {
      key: "resetStyle",
      value: function resetStyle() {
        var ctx = this.context;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#000';
        ctx.lineWidth = 1;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 10.0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      }
    }, {
      key: "applyStyle",
      value: function applyStyle() {
        var ctx = this.context;
        if (this.alreadyApplyStyle) return;
        if (!this.options) return;
        var _this$options2 = this.options,
            stroke = _this$options2.stroke,
            fill = _this$options2.fill,
            common = _this$options2.common;

        if (stroke) {
          var color = stroke.color,
              line = stroke.line,
              gradient = stroke.gradient;

          if (color) {
            ctx.strokeStyle = color;
          }

          if (gradient) {
            ctx.strokeStyle = createGradient(ctx, 'linear', gradient);
          }

          if (line) {
            var dash = line.dash,
                width = line.width,
                cap = line.cap,
                join = line.join,
                minterLimit = line.minterLimit;

            if (dash) {
              var type = dash.type,
                  _dash$offset = dash.offset,
                  offset = _dash$offset === void 0 ? 0 : _dash$offset;

              if (type) {
                ctx.setLineDash(type);
              }

              if (offset) {
                ctx.lineDashOffset = offset;
              }
            }

            if (width) {
              ctx.lineWidth = width;
            }

            if (cap) {
              ctx.lineCap = cap;
            }

            if (join) {
              ctx.lineJoin = join;
            }

            if (minterLimit) {
              ctx.minterLimit = minterLimit;
            }
          }
        }

        if (fill) {
          var _color = fill.color,
              shadow = fill.shadow,
              _gradient = fill.gradient;

          if (_color) {
            ctx.fillStyle = _color;
          }

          if (shadow) {
            var _offset = shadow.offset,
                blur = shadow.blur,
                _color2 = shadow.color;
            ctx.shadowOffsetX = _offset.x;
            ctx.shadowOffsetY = _offset.y;
            ctx.shadowBlur = blur;
            ctx.shadowColor = _color2;
          }

          if (_gradient) {
            ctx.fillStyle = createGradient(ctx, 'fill', _gradient);
          }
        }

        if (common) {
          var alpha = common.alpha;

          if (alpha) {
            ctx.globalAlpha = alpha;
          }
        }

        this.alreadyApplyStyle = true;
      }
    }, {
      key: "clear",
      value: function clear() {
        Publisher.removeSubscribe(this);
        Publisher.update(this.context);
      }
    }, {
      key: "applyUpdate",
      value: function applyUpdate() {
        var self = this;

        if (this.options.isUpdate && this.options.update) {
          this.updateIntervalId = compatible.updateInterval.call(this, function () {
            console.log(self.options.isUpdate);

            if (self.options.isUpdate) {
              self.options.update();
            }
          });
        }
      }
    }, {
      key: "cancelUpdate",
      value: function cancelUpdate() {
        this.options.isUpdate = false;
        compatible.cancelUpdateInterval(this.updateIntervalId);
      }
    }, {
      key: "on",
      value: function on(type, handler) {
        var canvas = this.canvas;
        var rectRange = this.rectRange;
        var self = this;
        canvas.addEventListener(type, function (e) {
          var _compatible$getClient = compatible.getClientPos(e),
              clientX = _compatible$getClient.clientX,
              clientY = _compatible$getClient.clientY;

          var point = eventUtils.windowToCanvas(canvas, clientX, clientY);

          if (eventUtils.isPointInRect(point, rectRange)) {
            handler.call(self, e);
          }
        });
      }
    }]);

    return Geometry;
  }();

  var Rectangle =
  /*#__PURE__*/
  function (_Geometry) {
    _inherits(Rectangle, _Geometry);

    function Rectangle() {
      _classCallCheck(this, Rectangle);

      return _possibleConstructorReturn(this, _getPrototypeOf(Rectangle).apply(this, arguments));
    }

    _createClass(Rectangle, [{
      key: "draw",
      value: function draw() {
        var ctx = this.context;
        return _get(_getPrototypeOf(Rectangle.prototype), "draw", this).call(this, function () {
          var _this$options = this.options,
              origin = _this$options.origin,
              width = _this$options.width,
              height = _this$options.height;
          ctx.rect(origin.x, origin.y, width, height);
        });
      }
    }, {
      key: "setRange",
      value: function setRange() {
        var _this$options2 = this.options,
            origin = _this$options2.origin,
            width = _this$options2.width,
            height = _this$options2.height;
        this.rectRange = [origin, width, height];
      }
    }]);

    return Rectangle;
  }(Geometry);

  var Circle =
  /*#__PURE__*/
  function (_Geometry) {
    _inherits(Circle, _Geometry);

    function Circle() {
      _classCallCheck(this, Circle);

      return _possibleConstructorReturn(this, _getPrototypeOf(Circle).apply(this, arguments));
    }

    _createClass(Circle, [{
      key: "draw",
      value: function draw() {
        var ctx = this.context;
        return _get(_getPrototypeOf(Circle.prototype), "draw", this).call(this, function () {
          var _this$options = this.options,
              origin = _this$options.origin,
              radius = _this$options.radius;
          ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
        });
      }
    }, {
      key: "setRange",
      value: function setRange() {
        var _this$options2 = this.options,
            origin = _this$options2.origin,
            radius = _this$options2.radius;
        this.rectRange = [{
          x: origin.x - radius,
          y: origin.y - radius
        }, 2 * radius, 2 * radius];
      }
    }]);

    return Circle;
  }(Geometry);

  var figureSelector = {
    rectangle: Rectangle,
    circle: Circle
  };

  var figureFactory = function figureFactory(context, type, opts) {
    var Figure = figureSelector[type];

    if (Figure) {
      return new Figure(context, opts);
    } else {
      throw new Error('[error] The figure you want to create is not exist.');
    }
  };

  var Context =
  /*#__PURE__*/
  function () {
    function Context(canvas) {
      _classCallCheck(this, Context);

      if (compatible.isCanvasSupport(canvas)) {
        this.canvas = canvas;
        this._context = canvas.getContext('2d');
      } else {
        throw new Error("[error] Your browser don't support canvas.");
      }
    }

    _createClass(Context, [{
      key: "getContext",
      value: function getContext() {
        return this._context;
      }
    }, {
      key: "setContext",
      value: function setContext(context) {
        this._context = context;
      }
    }, {
      key: "resizeCanvas",
      value: function resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
    }, {
      key: "createFigure",
      value: function createFigure(type, opts) {
        return figureFactory(this._context, type, opts);
      }
    }]);

    return Context;
  }();

  return Context;

}));
