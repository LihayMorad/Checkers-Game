import React, { Component } from 'react';

import './Square.css';

class Square extends Component {

    componentDidMount() {
        const { row, col, player } = this.props;
        this.setState({ row, col, player });
    }

    componentDidUpdate(prevProps) { // to make sure each dot has the latest props updated in its state
        if (prevProps.player !== this.props.player) { // prevent unnecessary renders
            const { row, col, player } = this.props;
            this.setState({ row, col, player });
        }
    }

    onSquareClick = () => {
        if (this.props.player || this.props.checkerMove) {
            this.props.onSquareClick({ ...this.state });
        }
    }

    render() {
        const { color, player, movingChecker } = this.props;
        const isPlayerChecker = player && color === "navajowhite";

        return (
            <td
                className={`square ${isPlayerChecker && 'moveable'} ${movingChecker && 'movingChecker'}`}
                style={{ backgroundColor: color }}
                onClick={this.onSquareClick}
            >
                {
                    isPlayerChecker && <span
                        className="playerChecker"
                        style={{ backgroundColor: player }}>
                    </span>
                }
            </td>
        );
    }
}

export default Square;