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

    initBoard = () => {
        const { boardRows, boardCols } = this.state;

        if (!this.isValidBoardSize(boardRows, boardCols)) {
            alert("Allowed board sizes: 8*8 - 16*16");
            return;
        }

        const board = new Array(boardRows);
        for (let i = 0; i < boardRows; i++) {
            board[i] = new Array(boardCols);
            for (let j = 0; j < boardCols; j++) {
                board[i][j] = {};
                const isBlackSquare = (i + j) % 2 === 0;

                let color = "black";
                let player = "";
                if (!isBlackSquare) {
                    color = "navajowhite";
                    if (i <= 2) {
                        player = "white";
                    } else if (i >= boardRows - 3) {
                        player = "red";
                    }
                }

                board[i][j].player = player;
                board[i][j].key = `${i}_${j}`;
                board[i][j].row = i;
                board[i][j].col = j;
                board[i][j].color = color;
                board[i][j].movingChecker = false;
                board[i][j].canMoveTo = false;
            }
        }
        this.setState({ board, status: "init" });
    }

    isValidBoardSize = (rows, cols) => !(rows < 8 || rows > 16 || cols < 8 || cols > 16);

    onBoardSizeChange = event => { this.setState({ [event.target.name]: event.target.value }) }

    onSquareClick = square => {
        const prevBoard = JSON.parse(JSON.stringify(this.state.board)); // short way to clone nested object/array (there are more efficient ways)

        if (this.state.checkerMove) {
            const oldSquare = this.state.squareToMove;
            const newSquare = square;
            const updatedBoard = [...this.state.board];
            updatedBoard[oldSquare.row][oldSquare.col].movingChecker = false;

            const move = this.state.board[newSquare.row][newSquare.col].canMoveTo;
            if (!move) {
                this.setState(state => ({ board: state.prevBoard, prevBoard: state.board, checkerMove: false, squareToMove: null }));
                alert("Illegal move");
                return;
            }

            // change old square
            updatedBoard[oldSquare.row][oldSquare.col].player = "";

            // set new square
            updatedBoard[newSquare.row][newSquare.col].player = oldSquare.player;

            // capture opponent square
            if (move.type === "capture") {
                updatedBoard[move.capture.row][move.capture.col].player = "";
            }

            this.clearMarks(updatedBoard);
            this.setState({ checkerMove: false, board: updatedBoard, prevBoard, status: "playing" });
        }

        else {
            this.markPossibleMoves(square);
            this.setState({ checkerMove: true, squareToMove: square, prevBoard });
        }

    }

    markPossibleMoves = square => {
        const board = this.state.board;
        const updatedBoard = [...this.state.board];
        updatedBoard[square.row][square.col].movingChecker = true;

        if (square.player === "white") {

            if (square.row + 1 < this.state.boardRows) {

                // one step (move right)
                if (square.col + 1 < this.state.boardCols) {
                    if (board[square.row + 1][square.col + 1].player === "") {
                        updatedBoard[square.row + 1][square.col + 1].canMoveTo = { type: "move" };
                    }
                }

                // one step (move left)
                if (square.col - 1 >= 0) {
                    if (board[square.row + 1][square.col - 1].player === "") {
                        updatedBoard[square.row + 1][square.col - 1].canMoveTo = { type: "move" };
                    }
                }
            }

            // two step (capture right)
            if (square.row + 2 < this.state.boardRows && square.col + 2 < this.state.boardCols) {
                if (board[square.row + 1][square.col + 1].player === "red" &&
                    board[square.row + 2][square.col + 2].player === "") {
                    updatedBoard[square.row + 2][square.col + 2].canMoveTo = { type: "capture", capture: { row: square.row + 1, col: square.col + 1 } };
                }
            }

            // two step (capture left)
            if (square.row + 2 < this.state.boardRows && square.col - 2 >= 0) {
                if (board[square.row + 1][square.col - 1].player === "red" &&
                    board[square.row + 2][square.col - 2].player === "") {
                    updatedBoard[square.row + 2][square.col - 2].canMoveTo = { type: "capture", capture: { row: square.row + 1, col: square.col - 1 } };
                }
            }

        } else if (square.player === "red") {

            // one step (move right)
            if (square.row - 1 >= 0) {
                if (square.col + 1 < this.state.boardCols) {
                    if (board[square.row - 1][square.col + 1].player === "") {
                        updatedBoard[square.row - 1][square.col + 1].canMoveTo = { type: "move" };
                    }
                }

                // one step (move left)
                if (square.col - 1 >= 0) {
                    if (board[square.row - 1][square.col - 1].player === "") {
                        updatedBoard[square.row - 1][square.col - 1].canMoveTo = { type: "move" };
                    }
                }
            }

            // two step (capture right)
            if (square.row - 2 >= 0 && square.col + 2 < this.state.boardCols) {
                if (board[square.row - 1][square.col + 1].player === "white" &&
                    board[square.row - 2][square.col + 2].player === "") {
                    updatedBoard[square.row - 2][square.col + 2].canMoveTo = { type: "capture", capture: { row: square.row - 1, col: square.col + 1 } };
                }
            }

            // two step (capture left)
            if (square.row - 2 >= 0 && square.col - 2 >= 0) {
                if (board[square.row - 1][square.col - 1].player === "white" &&
                    board[square.row - 2][square.col - 2].player === "") {
                    updatedBoard[square.row - 2][square.col - 2].canMoveTo = { type: "capture", capture: { row: square.row - 1, col: square.col - 1 } };
                }
            }
        }

        this.setState({ board: updatedBoard });
    }

    undoOneMove = () => {
        this.setState(state => {
            const updatedPrevBoard = [...state.prevBoard];
            if (state.squareToMove) {
                updatedPrevBoard[state.squareToMove.row][state.squareToMove.col].movingChecker = false;
            }
            this.clearMarks(updatedPrevBoard);
            return { board: updatedPrevBoard, prevBoard: state.board };
        });
    }

    clearMarks = updatedBoard => {
        for (let i = 0; i < this.state.boardRows; i++) {
            for (let j = 0; j < this.state.boardCols; j++) {
                updatedBoard[i][j].canMoveTo = false;
            }
        }
    }

    render() {
        const { boardRows, boardCols, board, status, checkerMove } = this.state;

        return (
            <>

                <div id="boardSizeInputs">
                    Rows: <input type="text" name="boardRows" value={boardRows} placeholder="Enter rows" onChange={this.onBoardSizeChange} />
                    Columns: <input type="text" name="boardCols" value={boardCols} placeholder="Enter cols" onChange={this.onBoardSizeChange} />
                    <button onClick={this.initBoard}>Apply</button>
                </div>

                <button onClick={this.initBoard}>Start / Reset Game</button>
                {
                    status === "playing" && <button onClick={this.undoOneMove}>
                        Undo / Redo Move
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