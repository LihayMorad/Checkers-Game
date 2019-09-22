import React, { Component } from 'react';

import Square from '../../components/Square/Square';

import './Board.css';

class Board extends Component {

    state = {
        boardRows: 8,
        boardCols: 8,
        playerTurn: "red",
        checkerMove: false,
        status: "init",
        possibleMoves: []
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
                const isBlackSquare = (i + j) % 2 === 0;

                let color = "navajowhite";
                let player = "";
                if (isBlackSquare) {
                    color = "black";
                    if (i <= 2) {
                        player = "white";
                    } else if (i >= boardRows - 3) {
                        player = "red";
                    }
                }

                board[i][j] = {
                    key: `${i}_${j}`,
                    row: i,
                    col: j,
                    player,
                    color,
                    movingChecker: false,
                    canMoveTo: false
                };
            }
        }
        this.setState({ board, status: "init" });
    }

    isValidBoardSize = (rows, cols) => !(rows < 8 || rows > 16 || cols < 8 || cols > 16);

    onBoardSizeChange = event => { this.setState({ [event.target.name]: event.target.value }) }

    onSquareClick = square => {
        const { board, checkerMove, playerTurn, squareToMove } = this.state;

        if (checkerMove || square.player === playerTurn) {

            if (checkerMove) {
                const oldSquare = squareToMove;
                const newSquare = square;
                const updatedBoard = [...board];
                updatedBoard[oldSquare.row][oldSquare.col].movingChecker = false;

                const move = board[newSquare.row][newSquare.col].canMoveTo;
                if (!move) {
                    this.clearMarks(updatedBoard);
                    this.setState(state => ({
                        checkerMove: false,
                        squareToMove: null,
                        possibleMoves: []
                    }));
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
                this.setState({
                    checkerMove: false,
                    board: updatedBoard,
                    status: "playing",
                    playerTurn: playerTurn === "red" ? "white" : "red",
                });
            }

            else {
                this.markPossibleMoves(square, "all");
                this.setState({ checkerMove: true, squareToMove: square });
            }
        }

        else {
            alert(`Wait for ${playerTurn} player to finish its turn!`);
        }

    }

    markPossibleMoves = (square, typeToMark) => {
        const { board, boardRows, boardCols, possibleMoves } = this.state;
        const updatedBoard = [...board];
        updatedBoard[square.row][square.col].movingChecker = true;

        if (square.player === "white") {

            if (typeToMark === "all") {
                if (square.row + 1 < boardRows) {

                    // one step (move right)
                    if (square.col + 1 < boardCols) {
                        if (board[square.row + 1][square.col + 1].player === "") {
                            updatedBoard[square.row + 1][square.col + 1].canMoveTo = { type: "move" };
                            possibleMoves.push({
                                type: "move",
                                from: { row: square.row, col: square.col },
                                to: { row: square.row + 1, col: square.col + 1 }
                            });
                        }
                    }

                    // one step (move left)
                    if (square.col - 1 >= 0) {
                        if (board[square.row + 1][square.col - 1].player === "") {
                            updatedBoard[square.row + 1][square.col - 1].canMoveTo = { type: "move" };
                            possibleMoves.push({
                                type: "move",
                                from: { row: square.row, col: square.col },
                                to: { row: square.row + 1, col: square.col - 1 }
                            });
                        }
                    }
                }
            }

            // two step (capture right)
            if (square.row + 2 < boardRows && square.col + 2 < boardCols) {
                if (board[square.row + 1][square.col + 1].player === "red" &&
                    board[square.row + 2][square.col + 2].player === "") {
                    updatedBoard[square.row + 2][square.col + 2].canMoveTo = { type: "capture", capture: { row: square.row + 1, col: square.col + 1 } };
                    possibleMoves.push({
                        type: "capture",
                        from: { row: square.row, col: square.col },
                        to: { row: square.row + 2, col: square.col + 2 },
                        capture: { row: square.row + 1, col: square.col + 1 }
                    });
                }
            }

            // two step (capture left)
            if (square.row + 2 < boardRows && square.col - 2 >= 0) {
                if (board[square.row + 1][square.col - 1].player === "red" &&
                    board[square.row + 2][square.col - 2].player === "") {
                    updatedBoard[square.row + 2][square.col - 2].canMoveTo = { type: "capture", capture: { row: square.row + 1, col: square.col - 1 } };
                    possibleMoves.push({
                        type: "capture",
                        from: { row: square.row, col: square.col },
                        to: { row: square.row + 2, col: square.col - 2 },
                        capture: { row: square.row + 1, col: square.col - 1 }
                    });
                }
            }

        } else if (square.player === "red") {

            if (typeToMark === "all") {
                // one step (move right)
                if (square.row - 1 >= 0) {
                    if (square.col + 1 < boardCols) {
                        if (board[square.row - 1][square.col + 1].player === "") {
                            updatedBoard[square.row - 1][square.col + 1].canMoveTo = { type: "move" };
                            possibleMoves.push({
                                type: "move",
                                from: { row: square.row, col: square.col },
                                to: { row: square.row - 1, col: square.col + 1 }
                            });
                        }
                    }

                    // one step (move left)
                    if (square.col - 1 >= 0) {
                        if (board[square.row - 1][square.col - 1].player === "") {
                            updatedBoard[square.row - 1][square.col - 1].canMoveTo = { type: "move" };
                            possibleMoves.push({
                                type: "move",
                                from: { row: square.row, col: square.col },
                                to: { row: square.row - 1, col: square.col - 1 }
                            });
                        }
                    }
                }
            }

            // two step (capture right)
            if (square.row - 2 >= 0 && square.col + 2 < boardCols) {
                if (board[square.row - 1][square.col + 1].player === "white" &&
                    board[square.row - 2][square.col + 2].player === "") {
                    updatedBoard[square.row - 2][square.col + 2].canMoveTo = { type: "capture", capture: { row: square.row - 1, col: square.col + 1 } };
                    possibleMoves.push({
                        type: "capture",
                        from: { row: square.row, col: square.col },
                        to: { row: square.row - 2, col: square.col + 2 },
                        capture: { row: square.row - 1, col: square.col + 1 }
                    });
                }
            }

            // two step (capture left)
            if (square.row - 2 >= 0 && square.col - 2 >= 0) {
                if (board[square.row - 1][square.col - 1].player === "white" &&
                    board[square.row - 2][square.col - 2].player === "") {
                    updatedBoard[square.row - 2][square.col - 2].canMoveTo = { type: "capture", capture: { row: square.row - 1, col: square.col - 1 } };
                    possibleMoves.push({
                        type: "capture",
                        from: { row: square.row, col: square.col },
                        to: { row: square.row - 2, col: square.col - 2 },
                        capture: { row: square.row - 1, col: square.col - 1 }
                    });
                }
            }
        }

        this.setState({ board: updatedBoard, possibleMoves });
    }

    clearMarks = updatedBoard => {
        this.state.possibleMoves.forEach(move => {
            updatedBoard[move.to.row][move.to.col].canMoveTo = false;
        });
    }

    render() {
        const { boardRows, boardCols, board, checkerMove, playerTurn } = this.state;

        return (
            <>

                <div id="boardSizeInputs">
                    Rows: <input type="text" name="boardRows" value={boardRows} placeholder="Enter rows" onChange={this.onBoardSizeChange} />
                    Columns: <input type="text" name="boardCols" value={boardCols} placeholder="Enter cols" onChange={this.onBoardSizeChange} />
                    <button onClick={this.initBoard}>Apply</button>
                </div>

                <button onClick={this.initBoard}>Start / Reset Game</button>

                {
                    board && <div id="board">
                        <h3>Player turn: <span style={{ color: playerTurn }}>{playerTurn}</span></h3>
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