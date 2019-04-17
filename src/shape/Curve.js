/**
 * @fileOverview Curve
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { line as shapeLine, area as shapeArea, curveBasisClosed, curveBasisOpen,
  curveBasis, curveLinearClosed, curveLinear, curveMonotoneX, curveMonotoneY,
  curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape';
import { select } from 'd3-selection';
import classNames from 'classnames';
import _ from 'lodash';
import pureRender from '../util/PureRender';
import { PRESENTATION_ATTRIBUTES, getPresentationAttributes,
  filterEventAttributes, filterSvgAttributes } from '../util/ReactUtils';
import { isNumber } from '../util/DataUtils';

const CURVE_FACTORIES = {
  curveBasisClosed, curveBasisOpen, curveBasis, curveLinearClosed, curveLinear,
  curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter,
  curveStepBefore,
};

const defined = p => p.x === +p.x && p.y === +p.y;
const getX = p => p.x;
const getY = p => p.y;

const getCurveFactory = (type, layout) => {
  if (_.isFunction(type)) { return type; }

  const name = `curve${type.slice(0, 1).toUpperCase()}${type.slice(1)}`;

  if (name === 'curveMonotone' && layout) {
    return CURVE_FACTORIES[`${name}${layout === 'vertical' ? 'Y' : 'X'}`];
  }
  return CURVE_FACTORIES[name] || curveLinear;
};

@pureRender
class Curve extends Component {

  static displayName = 'Curve';

  static propTypes = {
    ...PRESENTATION_ATTRIBUTES,
    className: PropTypes.string,
    type: PropTypes.oneOfType([PropTypes.oneOf([
      'basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural',
      'monotoneX', 'monotoneY', 'monotone', 'step', 'stepBefore', 'stepAfter',
    ]), PropTypes.func]),
    layout: PropTypes.oneOf(['horizontal', 'vertical']),
    baseLine: PropTypes.oneOfType([
      PropTypes.number, PropTypes.array,
    ]),
    points: PropTypes.arrayOf(PropTypes.object),
    connectNulls: PropTypes.bool,
    path: PropTypes.string,
    pathRef: PropTypes.func,
  };

  static defaultProps = {
    type: 'linear',
    points: [],
    connectNulls: false,
  };

  componentDidMount() {
    if (this.props.canvas && this.props.canvasId) {
      // need to wait to render onto canvas until after parent has finished rendering
      this.renderCanvas();
    }
  }

  componentDidUpdate() {
    if (this.props.canvas && this.props.canvasId) {
      // need to wait to render onto canvas until after parent has finished rendering
      this.renderCanvas();
    }
  }

  /**
   * Calculate the line function
   * @return {Object} lineFunction
   */
  getLineFunction() {
    const { type, baseLine, layout } = this.props;
    const curveFactory = getCurveFactory(type, layout);
    let lineFunction;

    if (_.isArray(baseLine)) {
      if (layout === 'vertical') {
        lineFunction = shapeArea().y(getY).x1(getX).x0(d => d.base.x);
      } else {
        lineFunction = shapeArea().x(getX).y1(getY).y0(d => d.base.y);
      }
      lineFunction.defined(defined).curve(curveFactory);
    } else if (layout === 'vertical' && isNumber(baseLine)) {
      lineFunction = shapeArea().y(getY).x1(getX).x0(baseLine);
    } else if (isNumber(baseLine)) {
      lineFunction = shapeArea().x(getX).y1(getY).y0(baseLine);
    } else {
      lineFunction = shapeLine().x(getX).y(getY);
    }

    lineFunction.defined(defined)
      .curve(curveFactory);

    return lineFunction;
  }

  /**
   * Calculate the path of curve
   * @return {String} path
   */
  getPath() {
    const { points, connectNulls, baseLine } = this.props;
    const lineFunction = this.getLineFunction();
    const formatPoints = connectNulls ? points.filter(entry => defined(entry)) : points;
    if (_.isArray(baseLine)) {
      const formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
      const areaPoints = formatPoints.map((entry, index) => (
        { ...entry, base: formatBaseLine[index] }
      ));
      return lineFunction(areaPoints);
    }
    return lineFunction(formatPoints);
  }

  renderCanvas() {
    const { points, connectNulls, baseLine, canvasId } = this.props;
    const lineFunction = this.getLineFunction();
    const canvas = select(`canvas#${canvasId}`);

    let formatPoints = connectNulls ? points.filter(entry => defined(entry)) : points;
    if (_.isArray(baseLine) || isNumber(baseLine)) {
      const formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
      formatPoints = formatPoints.map((entry, index) => (
        { ...entry, base: formatBaseLine[index] }
      ));
      this.renderFillToCanvas(canvas, lineFunction, formatPoints);
    } else {
      this.renderStrokeToCanvas(canvas, lineFunction, formatPoints);
    }
  }

  renderStrokeToCanvas(canvas, lineFunction, formatPoints) {
    const { stroke, strokeWidth, strokeDasharray } = this.props;
    if (canvas && canvas.node() && lineFunction.context) {
      const context = canvas.node().getContext('2d');
      lineFunction.context(context);

      context.save();
      context.strokeStyle = stroke;
      context.lineWidth = strokeWidth;
      if (strokeDasharray && strokeDasharray !== "0px 0px") {
        context.setLineDash(strokeDasharray.split(' ').map((s) => Number(s)));
      }
      context.imageSmoothingQuality = 'high';
      context.beginPath();
      lineFunction(formatPoints);
      context.stroke();
      context.restore();
    }
  }

  renderFillToCanvas(canvas, lineFunction, formatPoints) {
    const { fill, fillOpacity } = this.props;
    if (canvas.node() && lineFunction.context) {
      const context = canvas.node().getContext('2d');
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

  render() {
    const { className, points, path, pathRef, canvas, canvasId } = this.props;

    if ((!points || !points.length) && !path) { return null; }

    if (!canvas || !canvasId) {
      const realPath = (points && points.length) ?
        this.getPath() : path;

      return (
        <path
          {...filterSvgAttributes(getPresentationAttributes(this.props))}
          {...filterEventAttributes(this.props, null, true)}
          className={classNames('recharts-curve', className)}
          d={realPath}
          ref={pathRef}
        />
      );
    }
    // canvas line is drawn in lifecycle hooks
    return null;
  }
}

export default Curve;
