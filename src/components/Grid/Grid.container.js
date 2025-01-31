import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sizeMe from 'react-sizeme';
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import './Grid.css';
import { GRID_BREAKPOINTS } from './Grid.constants';
import MessageBus from '@restore/messagebus';

const colsRowsShape = PropTypes.shape({
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
  xxs: PropTypes.number
});

export class GridContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.messageBus = new MessageBus();
  }

  static propTypes = {
    cols: colsRowsShape,
    rows: colsRowsShape,
    breakpoints: colsRowsShape,
    gap: PropTypes.number,
    children: PropTypes.node,
    edit: PropTypes.bool,
    onLayoutChange: PropTypes.func
  };

  static defaultProps = {
    cols: { lg: 6, md: 6, sm: 5, xs: 4, xxs: 3 },
    rows: { lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 },
    breakpoints: GRID_BREAKPOINTS,
    gap: 30,
    edit: false
  };

  state = {
    dragging: false
  };

  grid = null;

  calcRowHeight(height) {
    // todo: rewrite this with variable caching
    const breakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'];
    let rowHeight;

    for (let i = 0; i < breakpoints.length; i += 1) {
      const breakpoint = breakpoints[i];

      if (
        window.matchMedia(
          `(min-width: ${this.props.breakpoints[breakpoint]}px)`
        ).matches
      ) {
        const rows = this.props.rows[breakpoint];
        const padding = this.props.gap * (rows - 1);
        const margin = this.props.gap * 2;
        const spaceBetween = margin + padding;
        const gridHeight = this.props.size.height;
        rowHeight = (gridHeight - spaceBetween) / rows;
        break;
      }
    }
    return rowHeight < 80 ? 80 : rowHeight;
  }

  generateLayout(cols) {
    const layout = React.Children.map(this.props.children, (child, index) => {
      return {
        x: index % cols,
        y: Math.floor(index / cols),
        w: 1,
        h: 1,
        i: child.key
      };
    });
    return layout;
  }

  generateLayouts() {
    const { breakpoints, cols } = this.props;
    const layouts = {};

    Object.keys(breakpoints).forEach(bp => {
      layouts[bp] = this.generateLayout(cols[bp]);
    });
    return layouts;
  }

  handleDragStart = (layout, oldItem, newItem, placeholder, event, element) => {
    this.setState({ dragging: true });
  };

  handleDragStop = (layout, oldItem, newItem, placeholder, event, element) => {
    this.setState({ dragging: false });
  };

  render() {
    const {
      size,
      cols,
      gap,
      edit,
      breakpoints,
      children,
      onLayoutChange
    } = this.props;

    return (
      <div
        className={classNames('Grid', { dragging: this.state.dragging })}
        onClick={() =>
          this.messageBus.publish('keepalive', window.cboardSessionId)
        }
      >
        <ResponsiveReactGridLayout
          breakpoints={breakpoints}
          cols={cols}
          layouts={this.generateLayouts()}
          width={size.width}
          rowHeight={this.calcRowHeight(size.height)}
          containerPadding={[gap, gap]}
          margin={[gap, gap]}
          isDraggable={edit}
          isResizable={false}
          onLayoutChange={onLayoutChange}
          onDragStart={this.handleDragStart}
          onDragStop={this.handleDragStop}
        >
          {children}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: true })(GridContainer);
