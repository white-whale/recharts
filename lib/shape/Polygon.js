"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _d3Selection = require("d3-selection");

var _PureRender = _interopRequireDefault(require("../util/PureRender"));

var _ReactUtils = require("../util/ReactUtils");

var _class, _class2, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var getPolygonPoints = function getPolygonPoints(points) {
  return points.reduce(function (result, entry) {
    if (entry.x === +entry.x && entry.y === +entry.y) {
      result.push([entry.x, entry.y]);
    }

    return result;
  }, []).join(' ');
};

var Polygon = (0, _PureRender.default)(_class = (_temp = _class2 =
/*#__PURE__*/
function (_Component) {
  _inherits(Polygon, _Component);

  function Polygon() {
    _classCallCheck(this, Polygon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Polygon).apply(this, arguments));
  }

  _createClass(Polygon, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.canvas && this.props.canvasId) {
        // need to wait to render onto canvas until after parent has finished rendering
        this.renderPolygonToCanvas();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.canvas && this.props.canvasId) {
        // need to wait to render onto canvas until after parent has finished rendering
        this.renderPolygonToCanvas();
      }
    }
  }, {
    key: "renderPolygonToCanvas",
    value: function renderPolygonToCanvas() {
      var _this$props = this.props,
          canvasId = _this$props.canvasId,
          fill = _this$props.fill,
          fillOpacity = _this$props.fillOpacity,
          stroke = _this$props.stroke,
          points = _this$props.points;
      var canvas = (0, _d3Selection.select)("canvas#".concat(canvasId));

      if (canvas && canvas.node() && points.length > 1) {
        var context = canvas.node().getContext('2d');
        context.save();
        context.fillStyle = fill;
        context.globalAlpha = fillOpacity;
        context.strokeStyle = stroke || fill;
        context.imageSmoothingQuality = 'high';
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
          context.lineTo(points[i].x, points[i].y);
        }

        context.lineTo(points[0].x, points[0].y);
        context.fill();
        context.stroke();
        context.restore();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          points = _this$props2.points,
          className = _this$props2.className,
          canvas = _this$props2.canvas,
          canvasId = _this$props2.canvasId;

      if (!points || !points.length) {
        return null;
      }

      var layerClass = (0, _classnames.default)('recharts-polygon', className);

      if (!canvas || !canvasId) {
        return _react.default.createElement("polygon", _extends({}, (0, _ReactUtils.filterSvgAttributes)((0, _ReactUtils.getPresentationAttributes)(this.props)), (0, _ReactUtils.filterEventAttributes)(this.props), {
          className: layerClass,
          points: getPolygonPoints(points)
        }));
      }

      return null;
    }
  }]);

  return Polygon;
}(_react.Component), _class2.displayName = 'Polygon', _class2.propTypes = _objectSpread({}, _ReactUtils.PRESENTATION_ATTRIBUTES, {
  className: _propTypes.default.string,
  points: _propTypes.default.arrayOf(_propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }))
}), _temp)) || _class;

var _default = Polygon;
exports.default = _default;