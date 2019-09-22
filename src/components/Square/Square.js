import React, { Component } from 'react';

import './Square.css';

class Square extends Component {

    componentDidMount() {
        this.updateState();
    }

    componentDidUpdate(prevProps) {
        if (this.props.player !== prevProps.player) {
            this.updateState();
        }
    }

    updateState = () => {
        const { row, col, player } = this.props;
        this.setState({ row, col, player });
    }

    onSquareClick = () => {
        if (this.props.player || this.props.checkerMove) {
            this.props.onSquareClick({ ...this.state });
        }
    }

    render() {
        const { color, player, movingChecker, canMoveTo } = this.props;
        const isPlayerChecker = !!player;

        return (
            <td
                className={`square 
                    ${isPlayerChecker && 'moveable'} 
                    ${movingChecker && 'movingChecker'} 
                    ${canMoveTo && 'canMoveTo'}`
                }
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