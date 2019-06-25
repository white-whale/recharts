import _isArray from "lodash/isArray";
import _isFunction from "lodash/isFunction";

var _class, _class2, _temp;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @fileOverview Curve
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { line as shapeLine, area as shapeArea, curveBasisClosed, curveBasisOpen, curveBasis, curveLinearClosed, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape';
import { select } from 'd3-selection';
import classNames from 'classnames';
import pureRender from '../util/PureRender';
import { PRESENTATION_ATTRIBUTES, getPresentationAttributes, filterEventAttributes, filterSvgAttributes } from '../util/ReactUtils';
import { isNumber } from '../util/DataUtils';
var CURVE_FACTORIES = {
  curveBasisClosed: curveBasisClosed,
  curveBasisOpen: curveBasisOpen,
  curveBasis: curveBasis,
  curveLinearClosed: curveLinearClosed,
  curveLinear: curveLinear,
  curveMonotoneX: curveMonotoneX,
  curveMonotoneY: curveMonotoneY,
  curveNatural: curveNatural,
  curveStep: curveStep,
  curveStepAfter: curveStepAfter,
  curveStepBefore: curveStepBefore
};

var defined = function defined(p) {
  return p.x === +p.x && p.y === +p.y;
};

var getX = function getX(p) {
  return p.x;
};

var getY = function getY(p) {
  return p.y;
};

var getCurveFactory = function getCurveFactory(type, layout) {
  if (_isFunction(type)) {
    return type;
  }

  var name = "curve".concat(type.slice(0, 1).toUpperCase()).concat(type.slice(1));

  if (name === 'curveMonotone' && layout) {
    return CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
  }

  return CURVE_FACTORIES[name] || curveLinear;
};

var Curve = pureRender(_class = (_temp = _class2 =
/*#__PURE__*/
function (_Component) {
  _inherits(Curve, _Component);

  function Curve() {
    _classCallCheck(this, Curve);

    return _possibleConstructorReturn(this, _getPrototypeOf(Curve).apply(this, arguments));
  }

  _createClass(Curve, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.canvas && this.props.canvasId) {
        // need to wait to render onto canvas until after parent has finished rendering
        this.renderCanvas();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.canvas && this.props.canvasId) {
        // need to wait to render onto canvas until after parent has finished rendering
        this.renderCanvas();
      }
    }
    /**
     * Calculate the line function
     * @return {Object} lineFunction
     */

  }, {
    key: "getLineFunction",
    value: function getLineFunction() {
      var _this$props = this.props,
          type = _this$props.type,
          baseLine = _this$props.baseLine,
          layout = _this$props.layout;
      var curveFactory = getCurveFactory(type, layout);
      var lineFunction;

      if (_isArray(baseLine)) {
        if (layout === 'vertical') {
          lineFunction = shapeArea().y(getY).x1(getX).x0(function (d) {
            return d.base.x;
          });
        } else {
          lineFunction = shapeArea().x(getX).y1(getY).y0(function (d) {
            return d.base.y;
          });
        }

        lineFunction.defined(defined).curve(curveFactory);
      } else if (layout === 'vertical' && isNumber(baseLine)) {
        lineFunction = shapeArea().y(getY).x1(getX).x0(baseLine);
      } else if (isNumber(baseLine)) {
        lineFunction = shapeArea().x(getX).y1(getY).y0(baseLine);
      } else {
        lineFunction = shapeLine().x(getX).y(getY);
      }

      lineFunction.defined(defined).curve(curveFactory);
      return lineFunction;
    }
    /**
     * Calculate the path of curve
     * @return {String} path
     */

  }, {
    key: "getPath",
    value: function getPath() {
      var _this$props2 = this.props,
          points = _this$props2.points,
          connectNulls = _this$props2.connectNulls,
          baseLine = _this$props2.baseLine;
      var lineFunction = this.getLineFunction();
      var formatPoints = connectNulls ? points.filter(function (entry) {
        return defined(entry);
      }) : points;

      if (_isArray(baseLine)) {
        var formatBaseLine = connectNulls ? baseLine.filter(function (base) {
          return defined(base);
        }) : baseLine;
        var areaPoints = formatPoints.map(function (entry, index) {
          return _objectSpread({}, entry, {
            base: formatBaseLine[index]
          });
        });
        return lineFunction(areaPoints);
      }

      return lineFunction(formatPoints);
    }
  }, {
    key: "renderCanvas",
    value: function renderCanvas() {
      var _this$props3 = this.props,
          points = _this$props3.points,
          connectNulls = _this$props3.connectNulls,
          baseLine = _this$props3.baseLine,
          canvasId = _this$props3.canvasId;
      var lineFunction = this.getLineFunction();
      var canvas = select("canvas#".concat(canvasId));
      var formatPoints = connectNulls ? points.filter(function (entry) {
        return defined(entry);
      }) : points;

      if (_isArray(baseLine)) {
        var formatBaseLine = connectNulls ? baseLine.filter(function (base) {
          return defined(base);
        }) : baseLine;
        formatPoints = formatPoints.map(function (entry, index) {
          return _objectSpread({}, entry, {
            base: formatBaseLine[index]
          });
        });
        this.renderFillToCanvas(canvas, lineFunction, formatPoints);
      } else {
        this.renderStrokeToCanvas(canvas, lineFunction, formatPoints);
      }
    }
  }, {
    key: "renderStrokeToCanvas",
    value: function renderStrokeToCanvas(canvas, lineFunction, formatPoints) {
      var _this$props4 = this.props,
          stroke = _this$props4.stroke,
          strokeWidth = _this$props4.strokeWidth,
          strokeDasharray = _this$props4.strokeDasharray;

      if (canvas && canvas.node() && lineFunction.context) {
        var context = canvas.node().getContext('2d');
        lineFunction.context(context);
        context.save();
        context.strokeStyle = stroke;
        context.lineWidth = strokeWidth;

        if (strokeDasharray && strokeDasharray !== "0px 0px") {
          context.setLineDash(strokeDasharray.split(' ').map(function (s) {
            return Number(s);
          }));
        }

        context.imageSmoothingQuality = 'high';
        context.beginPath();
        lineFunction(formatPoints);
        context.stroke();
        context.restore();
      }
    }
  }, {
    key: "renderFillToCanvas",
    value: function renderFillToCanvas(canvas, lineFunction, formatPoints) {
      var _this$props5 = this.props,
          fill = _this$props5.fill,
          fillOpacity = _this$props5.fillOpacity;

      if (canvas.node() && lineFunction.context) {
        var context = canvas.node().getContext('2d');
        lineFunction.context(context);
        context.save();
        context.fillStyle = fill;
        context.globalAlpha = fillOpacity;
        context.imageSmoothingQuality = 'high';
        context.beginPath();
        lineFunction(formatPoints);
        context.fill();
        context.restore();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          className = _this$props6.className,
          points = _this$props6.points,
          path = _this$props6.path,
          pathRef = _this$props6.pathRef,
          canvas = _this$props6.canvas,
          canvasId = _this$props6.canvasId;

      if ((!points || !points.length) && !path) {
        return null;
      }

      if (!canvas || !canvasId) {
        var realPath = points && points.length ? this.getPath() : path;
        return React.createElement("path", _extends({}, filterSvgAttributes(getPresentationAttributes(this.props)), filterEventAttributes(this.props, null, true), {
          className: classNames('recharts-curve', className),
          d: realPath,
          ref: pathRef
        }));
      } // canvas line is drawn in lifecycle hooks


      return null;
    }
  }]);

  return Curve;
}(Component), _class2.displayName = 'Curve', _class2.propTypes = _objectSpread({}, PRESENTATION_ATTRIBUTES, {
  className: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.oneOf(['basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter']), PropTypes.func]),
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  baseLine: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  points: PropTypes.arrayOf(PropTypes.object),
  connectNulls: PropTypes.bool,
  path: PropTypes.string,
  pathRef: PropTypes.func
}), _class2.defaultProps = {
  type: 'linear',
  points: [],
  connectNulls: false
}, _temp)) || _class;

export default Curve;