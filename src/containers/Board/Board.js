import React, { Component } from 'react';

import Square from '../../components/Square/Square';

import './Board.css';

const ROWS = 8;
const COLS = 8;

class Board extends Component {

    state = {
        checkerMove: false,
        prevBoard: []
    }

    componentDidMount() {
        this.initBoard();
    }

    initBoard = () => {
        const board = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            board[i] = new Array(COLS);
            for (let j = 0; j < COLS; j++) {
                board[i][j] = {};
                let player = "";
                if (i <= 2)
                    player = "white";
                else if (i >= 5)
                    player = "red";
                board[i][j].player = player;
                board[i][j].key = `${i}_${j}`;
                board[i][j].row = i;
                board[i][j].col = j;
                board[i][j].value = i + j;
                board[i][j].color = (i + j) % 2 === 0 ? "black" : "navajowhite";
            }
        }
        this.setState({ board });
    }

    onSquareClick = square => {
        if (this.state.checkerMove) {
            const oldSquare = this.state.squareToMove;
            const newSquare = square;
            const prevBoard = JSON.parse(JSON.stringify(this.state.board)); // short way to clone nested object/array (there are more efficient ways)
            const updatedBoard = [...this.state.board];

            const move = this.validMove(oldSquare, newSquare);
            if (!move.legal) {
                this.setState({ checkerMove: false, squareToMove: null });
                alert("Illegal move: " + move.message);
                return;
            }

            updatedBoard[oldSquare.row][oldSquare.col].player = "";                 // change old square
            updatedBoard[newSquare.row][newSquare.col].player = oldSquare.player;   // set new square

            this.setState({ checkerMove: false, squareToMove: null, board: updatedBoard, prevBoard });
        }

        else {
            this.setState({ checkerMove: true, squareToMove: square });
        }

    }

    validMove = (oldSquare, newSquare) => {
        if ((newSquare.row + newSquare.col) % 2 === 0) {
            return { legal: false, message: "You can't move to a black square!" };
        } else if (oldSquare.row === newSquare.row && oldSquare.col === newSquare.col) {
            return { legal: false, message: "You choose the same square!" };
        } else if (Math.abs(oldSquare.col - newSquare.col) > 1) {
            return { legal: false, message: "You can jump only one column ahead!" };
        } else if (Math.abs(oldSquare.row - newSquare.row) > 1) {
            return { legal: false, message: "You can jump only one row ahead!" };
        } else if (oldSquare.player === newSquare.player) {
            return { legal: false, message: "You can't jump to square which is already occupied!" };
        }

        if (oldSquare.player === "white") {
            if (oldSquare.row > newSquare.row) {
                return { legal: false, message: "You can't move backwards!" };
            }
        } else if (oldSquare.player === "red") {
            if (oldSquare.row < newSquare.row) {
                return { legal: false, message: "You can't move backwards!" };
            }
        }
        return { legal: true, message: "" };
    }

    undoOneMove = () => {
        this.setState(state => ({ board: state.prevBoard, prevBoard: state.board }));
    }

    render() {
        const { board, prevBoard } = this.state;

        return (
            <>
                <h3>THIS IS THE BOARD</h3>

                <button onClick={this.initBoard}>Start / Reset Game</button>
                {
                    prevBoard.length > 0 && board != prevBoard && <div>
                        <button onClick={this.undoOneMove}>
                            Undo one move
                        </button>
                    </div>
                }

                {
                    board && <div id="board">
                        <table>
                            <tbody>
                                {
                                    board.map((row, index) => {
                                        return <tr key={index} className="row">
                                            {
                                                row.map(col => {
                                                    return <Square
                                                        {...col}
                                                        className="col"
                                                        onSquareClick={this.onSquareClick}
                                                    />
                                                })
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </>
        );
    }
}

export default Board;