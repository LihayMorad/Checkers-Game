import React, { Component } from 'react';

import Square from '../../components/Square/Square';

import './Board.css';

class Board extends Component {

    state = {
        boardRows: 8,
        boardCols: 8,
        checkerMove: false,
        status: "init",
        prevBoard: []
    }

    updateBoardSizeValues = event => { this.setState({ [event.target.name]: event.target.value }) }

    initBoard = () => {
        const { boardRows, boardCols } = this.state;
        const board = new Array(boardRows);
        for (let i = 0; i < boardRows; i++) {
            board[i] = new Array(boardCols);
            for (let j = 0; j < boardCols; j++) {
                board[i][j] = {};
                const isBlackSquare = (i + j) % 2 === 0;
                let player = "";
                if (i <= 2 && !isBlackSquare)
                    player = "white";
                else if (i >= boardRows - 3 && !isBlackSquare)
                    player = "red";
                board[i][j].player = player;
                board[i][j].key = `${i}_${j}`;
                board[i][j].row = i;
                board[i][j].col = j;
                board[i][j].color = isBlackSquare ? "black" : "navajowhite";
                board[i][j].movingChecker = false;
            }
        }
        this.setState({ board, status: "init" });
    }

    onSquareClick = square => {

        if (this.state.checkerMove) {
            const oldSquare = this.state.squareToMove;
            const newSquare = square;
            const prevBoard = JSON.parse(JSON.stringify(this.state.board)); // short way to clone nested object/array (there are more efficient ways)
            const updatedBoard = [...this.state.board];

            updatedBoard[oldSquare.row][oldSquare.col].movingChecker = false;
            const move = this.validMove(oldSquare, newSquare);
            if (!move.legal) {
                this.setState({ board: updatedBoard, checkerMove: false, squareToMove: null });
                alert("Illegal move: " + move.message);
                return;
            } else {
                // change old square
                updatedBoard[oldSquare.row][oldSquare.col].player = "";

                // set new square
                updatedBoard[newSquare.row][newSquare.col].player = oldSquare.player;

                // capture opponent square
                if (move.message === "capture") {
                    updatedBoard[move.squareToCapture.row][move.squareToCapture.col].player = "";
                }

                this.setState({ checkerMove: false, squareToMove: null, board: updatedBoard, prevBoard, status: "playing" });
            }
        }

        else {
            square.movingChecker = true;
            const updatedBoard = [...this.state.board];
            updatedBoard[square.row][square.col].movingChecker = true;
            this.setState({ board: updatedBoard, checkerMove: true, squareToMove: square });
        }

    }

    validMove = (oldSquare, newSquare) => {

        if ((newSquare.row + newSquare.col) % 2 === 0) {
            return { legal: false, message: "You can't move to a black square!" };
        } else if (oldSquare.row === newSquare.row && oldSquare.col === newSquare.col) {
            return { legal: false, message: "You choose the same square!" };
        } else if (oldSquare.player === newSquare.player) {
            return { legal: false, message: "You can't jump to square which already occupied by you!" };
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

        const capture = this.captureSquare(oldSquare, newSquare);
        if (capture.able === true) {
            return { legal: true, message: "capture", squareToCapture: capture.squareToCapture };
        } else if (Math.abs(oldSquare.col - newSquare.col) > 1) {
            return { legal: false, message: "You can jump only one column ahead!" };
        } else if (Math.abs(oldSquare.row - newSquare.row) > 1) {
            return { legal: false, message: "You can jump only one row ahead!" };
        } else if (newSquare.player) {
            return { legal: false, message: "You can't jump to square which already occupied by the opponent!" };
        }

        return { legal: true, message: "move" };
    }

    captureSquare = (oldSquare, newSquare) => {
        const { board } = this.state;

        if (Math.abs(oldSquare.row - newSquare.row) === 2 &&
            Math.abs(oldSquare.col - newSquare.col) === 2) { // if player wants to capture

            if (oldSquare.player === "white") {

                if (board[oldSquare.row + 1][oldSquare.col + 1] &&
                    board[oldSquare.row + 1][oldSquare.col + 1].player === "red" &&
                    newSquare.player === "") {
                    return { able: true, squareToCapture: { row: oldSquare.row + 1, col: oldSquare.col + 1 } };
                }
                if (board[oldSquare.row + 1][oldSquare.col - 1] &&
                    board[oldSquare.row + 1][oldSquare.col - 1].player === "red" &&
                    newSquare.player === "") {
                    return { able: true, squareToCapture: { row: oldSquare.row + 1, col: oldSquare.col - 1 } };
                }

            }

            else if (oldSquare.player === "red") {

                if (board[oldSquare.row - 1][oldSquare.col + 1] &&
                    board[oldSquare.row - 1][oldSquare.col + 1].player === "white" &&
                    newSquare.player === "") {
                    return { able: true, squareToCapture: { row: oldSquare.row - 1, col: oldSquare.col + 1 } };
                }
                if (board[oldSquare.row - 1][oldSquare.col - 1] &&
                    board[oldSquare.row - 1][oldSquare.col - 1].player === "white" &&
                    newSquare.player === "") {
                    return { able: true, squareToCapture: { row: oldSquare.row - 1, col: oldSquare.col - 1 } };
                }

            }

        }

        return { able: false };
    }

    undoOneMove = () => { this.setState(state => ({ board: state.prevBoard, prevBoard: state.board })); }

    render() {
        const { boardRows, boardCols, board, status, checkerMove } = this.state;

        return (
            <>

                <div id="boardSizeInputs">
                    <input type="text" name="boardRows" value={boardRows} onChange={this.updateBoardSizeValues} />
                    <input type="text" name="boardCols" value={boardCols} onChange={this.updateBoardSizeValues} />
                    <button onClick={this.initBoard}>Apply</button>
                </div>

                <button onClick={this.initBoard}>Start / Reset Game</button>
                {
                    status === "playing" && <button onClick={this.undoOneMove}>
                        Undo / Redo
                        </button>
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
                                                        checkerMove={checkerMove}
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