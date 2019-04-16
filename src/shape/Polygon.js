/**
 * @fileOverview Polygon
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { select } from 'd3-selection';
import pureRender from '../util/PureRender';
import { PRESENTATION_ATTRIBUTES, getPresentationAttributes,
  filterEventAttributes } from '../util/ReactUtils';

const getPolygonPoints = points => (
  points.reduce((result, entry) => {
    if (entry.x === +entry.x && entry.y === +entry.y) {
      result.push([entry.x, entry.y]);
    }

    return result;
  }, []).join(' ')
);

@pureRender
class Polygon extends Component {

  static displayName = 'Polygon';

  static propTypes = {
    ...PRESENTATION_ATTRIBUTES,
    className: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    })),
  };

  componentDidMount() {
    if (this.props.canvas && this.props.canvasId) {
      // need to wait to render onto canvas until after parent has finished rendering
      this.renderPolygonToCanvas();
    }
  }

  componentDidUpdate() {
    if (this.props.canvas && this.props.canvasId) {
      // need to wait to render onto canvas until after parent has finished rendering
      this.renderPolygonToCanvas();
    }
  }

  renderPolygonToCanvas() {
    const { canvasId, fill, fillOpacity, stroke, points } = this.props;
    const canvas = select(`canvas#${canvasId}`);
    if (canvas && canvas.node() && points.length > 1) {
      const context = canvas.node().getContext('2d');
      context.save();
      context.fillStyle = fill;
      context.globalAlpha = fillOpacity;
      context.strokeStyle = stroke || fill;
      context.imageSmoothingQuality = 'high';
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      context.lineTo(points[0].x, points[0].y);
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  render() {
    const { points, className, canvas, canvasId } = this.props;

    if (!points || !points.length) { return null; }

    const layerClass = classNames('recharts-polygon', className);

    if (!canvas || !canvasId) {
      return (
        <polygon
          {...getPresentationAttributes(this.props)}
          {...filterEventAttributes(this.props)}
          className={layerClass}
          points={getPolygonPoints(points)}
        />
      );
    }

    return null;
  }
}

export default Polygon;
