import React from 'react';
import { useState } from 'react';
import { board } from './common/consts/ExamInput';
import styles from './App.module.scss';

function App() {
  let buttonDisabled = false;

  let gameBoardUpdate = () => {
    return board.map((indexTable) => (
      <div>
        {indexTable.map((element) => {
          if (element === 'X') {
            return <div className={styles.Wall}>C</div>; // g, C
          } else if (element === '1') {
            if (buttonDisabled === false) {
              return (
                <div id="ball" className={styles.Ball}>
                  y
                </div>
              );
            } else {
              return (
                <div id="ballRunning" className={styles.BallRunning}>
                  y
                </div>
              );
            }
          } else if (element === '0') {
            return <div className={styles.Air}>c</div>;
          } else if (element === 'Y') {
            return <div className={styles.y}>s</div>;
          }
        })}
      </div>
    ));
  };

  let [gameBoardDisplay, setGameBoardDisplay] = useState(gameBoardUpdate());

  class BallGenerator {
    constructor(board) {
      this.board = board;
    }
    generateBall() {
      let y;
      let x;
      for (let i = 0; i < board.length; i++) {
        let tempX = board[i].indexOf('1');
        if (tempX > -1) {
          y = i;
          x = tempX;
        }
      }
      return { y: y, x: x };
    }
  }

  class Vector {
    constructor(y, x) {
      this.x = x * this.randomVector();
      this.y = y * this.randomVector();
    }
    randomVector() {
      if (Math.random() < 0.5) {
        return -1;
      } else {
        return 1;
      }
    }
  }
  class Ball {
    constructor(y, x, vector) {
      this.x = x;
      this.y = y;
      this.vector = vector;
    }
    move() {
      this.x += this.vector.x;
      this.y += this.vector.y;
    }
  }
  //move ball, board pole =
  class Game {
    constructor(ball, board) {
      this.ball = ball;
      this.board = board;
      this.startingX = Number(ball.x);
      this.startingY = Number(ball.y);
    }

    randomVector = () => {
      if (Math.random() < 0.5) {
        return (this.ball.vector.x *= -1);
      } else {
        return (this.ball.vector.y *= -1);
      }
    };

    checkForYCollision = () => {
      this.moveBall();
      this.randomVector();
    };

    checkForXCollision = () => {
      // corner X collision
      if (
        this.board[this.ball.y][this.ball.x + this.ball.vector.x] !== 'X' &&
        this.board[this.ball.y + this.ball.vector.y][this.ball.x] !== 'X'
      ) {
        this.randomVector();
      }
      // horizontal and vertical X collision
      if (this.board[this.ball.y][this.ball.x + this.ball.vector.x] === 'X') {
        this.ball.vector.x *= -1;
      }
      if (this.board[this.ball.y + this.ball.vector.y][this.ball.x] === 'X') {
        this.ball.vector.y *= -1;
      }
      this.moveBall();
    };

    moveBall = () => {
      this.board[this.ball.y][this.ball.x] = '0';
      this.board[this.ball.y + this.ball.vector.y][
        this.ball.x + this.ball.vector.x
      ] = '1';
      this.ball.move();
    };

    start() {
      // interval
      const play = setInterval(() => {
        if (
          this.board[this.ball.y + this.ball.vector.y][
            this.ball.x + this.ball.vector.x
          ] === 'Y'
        ) {
          this.checkForYCollision();
        } else if (
          this.board[this.ball.y + this.ball.vector.y][
            this.ball.x + this.ball.vector.x
          ] === 'X'
        ) {
          this.checkForXCollision();
        } else {
          this.moveBall();
        }

        setGameBoardDisplay(gameBoardUpdate());
        if (this.ball.x === this.startingX && this.ball.y === this.startingY) {
          clearInterval(play);
          alert('Game done!');
          console.log('Game over');
          // buttonDisabled = false;
          window.location.reload();
        }
      }, 1000);
    }
  }

  let startBall = new BallGenerator(board).generateBall();
  let myVector = new Vector(1, 1);
  let movingBall = new Ball(startBall.y, startBall.x, myVector);

  function gameStart() {
    console.log(document.getElementById('ball').className);
    let game = new Game(movingBall, board).start();
    buttonDisabled = true;
  }

  // entry.target.classList.add('show'); // Add a class.

  return (
    <>
      <div className={styles.Backgroud}>
        <div className={styles.button}>
          <button id="myBtn" disabled={buttonDisabled} onClick={gameStart}>
            {' Start! '}
          </button>
        </div>
        <div className={styles.board}>{gameBoardDisplay}</div>
      </div>
    </>
  );
}

export default App;
