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

  var Geometry = function Geometry(context, opts) {
    _classCallCheck(this, Geometry);

    this.context = context;
    this.options = opts;
  };

  var Rectangle =
  /*#__PURE__*/
  function (_Geometry) {
    _inherits(Rectangle, _Geometry);

    function Rectangle() {
      _classCallCheck(this, Rectangle);

      return _possibleConstructorReturn(this, _getPrototypeOf(Rectangle).apply(this, arguments));
    }

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
      value: function draw(origin, center, radius, type) {
        var ctx = this.context;
        ctx.beginPath();
        ctx.arc(origin.x + center.x, origin.y + center.y, radius, 0, 2 * Math.PI);

        if (type === 'stroke') {
          ctx.stroke();
        } else if (type === 'fill') {
          ctx.fill();
        } else {
          throw new Error('[error] You should offer the type paramter');
        }
      }
    }, {
      key: "applyStyle",
      value: function applyStyle() {
        /**
         * options may be:
         * {
         *  stroke: {
         *    
         *  }
         * }
         */
        if (this.options) {
          if (this.options.stroke) ;

          if (this.options.fill) ;
        }
      }
    }, {
      key: "stroke",
      value: function stroke() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.push('stroke');
        this.draw.apply(this, args);
      }
    }, {
      key: "fill",
      value: function fill() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        args.push('fill');
        this.draw.apply(this, args);
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

  function isCanvasSupport(canvas) {
    return canvas.getContext && typeof canvas.getContext === 'function';
  }

  var compatible = {
    isCanvasSupport: isCanvasSupport
  };

  var CDOM =
  /*#__PURE__*/
  function () {
    function CDOM(canvas) {
      _classCallCheck(this, CDOM);

      if (compatible.isCanvasSupport(canvas)) {
        this.canvas = canvas;
        this._context = canvas.getContext('2d');
      } else {
        throw new Error("[error] Your browser don't support canvas.");
      }
    }

    _createClass(CDOM, [{
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

    return CDOM;
  }();

  return CDOM;

}));
