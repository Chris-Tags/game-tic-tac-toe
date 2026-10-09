import { useState } from "react";
import Confetti from "react-confetti";
import "./styles/app.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick} data-player={value}>
      {value}
    </button>
  );
}

function Board({ onPlay, squares, xIsNext, isBoardFull }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = (
      <>
        <div className="victoryStatus">
          <span className="status-emoji">👏👏 </span>
          Victoire des <span data-player={winner}>{winner}</span>
          <span className="status-emoji"> 👏👏</span>
        </div>
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      </>
    );
  } else if (isBoardFull) {
    status = (
      <div className="victoryStatus">
        <span className="status-emoji">⚖️⚖️ </span>
        Match nul
        <span className="status-emoji"> ⚖️⚖️</span>
      </div>
    );
  } else {
    status = (
      <>
        Au tour de :{" "}
        <span data-player={xIsNext ? "X" : "O"}>{xIsNext ? "X" : "O"}</span>
      </>
    );
  }

  const handleClick = (index) => {
    if (squares[index] || winner) return;

    const nextSquares = [...squares];
    nextSquares[index] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  };

  return (
    <>
      <div className="status">{status}</div>

      <div className="board">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let index = 0; index < lines.length; index++) {
    const [a, b, c] = lines[index];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const isBoardFull = !currentSquares.includes(null);

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((_, move) => {
    const description =
      move > 0 ? `Aller au coup #${move}` : "Revenir au début";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          isBoardFull={isBoardFull}
        />
      </div>

      <div className="game-info">
        <h2>&dArr; Historique &dArr;</h2>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <h1>
        Tic <span>X</span> Tac <span>O</span> Toe
      </h1>

      <Game />
    </>
  );
}

export default App;
