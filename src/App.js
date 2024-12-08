import React, { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, currentPlayer }) {
  function handleClick(x, y) {
    if (squares[x][y] || calculateWinner(squares, x, y)) {
      return;
    }
    const nextSquares = squares.map(row => row.slice());
    nextSquares[x][y] = currentPlayer;
    onPlay(nextSquares, x, y);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + currentPlayer;
  }

  return (
    <div>
      <div className="status">{status}</div>
      {squares.map((row, x) => (
        <div key={x} className="board-row">
          {row.map((square, y) => (
            <Square key={y} value={square} onSquareClick={() => handleClick(x, y)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(19).fill(null).map(() => Array(19).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const currentPlayer = currentMove % 2 === 0 ? 'X' : 'O';

  function handlePlay(nextSquares, x, y) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} currentPlayer={currentPlayer} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const directions = [
    [1, 0], // 水平
    [0, 1], // 垂直
    [1, 1], // 斜对角（左上到右下）
    [1, -1] // 斜对角（右上到左下）
  ];

  for (let x = 0; x < squares.length; x++) {
    for (let y = 0; y < squares[x].length; y++) {
      const player = squares[x][y];
      if (!player) continue;

      for (let [dx, dy] of directions) {
        let count = 1;

        // 向一个方向检查
        for (let step = 1; step < 5; step++) {
          const nx = x + dx * step;
          const ny = y + dy * step;
          if (nx >= 0 && nx < squares.length && ny >= 0 && ny < squares[0].length && squares[nx][ny] === player) {
            count++;
          } else {
            break;
          }
        }

        // 向相反方向检查
        for (let step = 1; step < 5; step++) {
          const nx = x - dx * step;
          const ny = y - dy * step;
          if (nx >= 0 && nx < squares.length && ny >= 0 && ny < squares[0].length && squares[nx][ny] === player) {
            count++;
          } else {
            break;
          }
        }

        if (count >= 5) {
          return player;
        }
      }
    }
  }

  return null;
}

export default Game;