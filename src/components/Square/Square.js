import React, { Component } from 'react';

import './Square.css';

class Square extends Component {

    componentDidMount() {
        const { row, col, player, value } = this.props;
        this.setState({ row, col, player, value });
    }

    componentDidUpdate(prevProps) { // to make sure each dot has the latest props updated in its state
        if (prevProps.player !== this.props.player) { // prevent unnecessary renders
            const { row, col, player, value } = this.props;
            this.setState({ row, col, player, value });
        }
    }

    onSquareClick = () => {
        this.props.onSquareClick({ ...this.state });
    }

    render() {
        const { color, player } = this.props;

        return (
            <td
                className="square"
                style={{ backgroundColor: color }}
                onClick={this.onSquareClick}
            >
                {
                    player && color === "navajowhite" && <span
                        className="playerCircle"
                        style={{ backgroundColor: player }}>
                    </span>
                }
            </td>
        );
    }
}

export default Square;