import { useState, useEffect, useRef } from 'react';
import './snake.css';

//deep copy arrays, suitable for primitives like in the grid


export default function Snake(props) {
    const [gridWidth, setGridWidth] = useState(props.gridWidth);
    const [gridHeight, setGridHeight] = useState(props.gridHeight);
    const [gridState, setGridState] = useState(deepCopy(props.grid));
    const [snakeHead, setSnakeHead] = useState(props.head.slice());
    const [snakePath, setSnakePath] = useState(deepCopy(props.path));
    const [keyPress, setKeyPress] = useState('keyUp');
    const [snakeDirection, setSnakeDirection] = useState('up');
    const [food, setFood] = useState(props.food.slice());
    const [start, setStart] = useState(false);
    const [loss, setLoss] = useState(false);
    const [score, setScore] = useState(0);

    const timeoutRef = useRef(null);
    const prevKeyRef = useRef('keyUp');

    const handleStart = () => {
        setStart(true);
    };

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === 'ArrowUp' && prevKeyRef.current !== 'keyDown') {
                setKeyPress('keyUp');
                prevKeyRef.current = 'keyUp';
            } else if (event.key === 'ArrowDown' && prevKeyRef.current !== 'keyUp') {
                setKeyPress('keyDown');
                prevKeyRef.current = 'keyDown';
            } else if (event.key === 'ArrowLeft' && prevKeyRef.current !== 'keyRight') {
                setKeyPress('keyLeft');
                prevKeyRef.current = 'keyLeft';
            } else if (event.key === 'ArrowRight' && prevKeyRef.current !== 'keyLeft') {
                setKeyPress('keyRight');
                prevKeyRef.current = 'keyRight';
            }
        }

        document.addEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        checkSnakeContact(snakeHead, snakePath);
        checkWallContact(snakeHead);
        let newDirection = chooseDirection(snakeDirection, keyPress);
        let newState = null;
        if (!loss && start) {
            newState = generateNextState(gridState, snakeHead, snakePath, newDirection, food);

            timeoutRef.current = setTimeout(() => {
                setSnakeDirection(newDirection);
                setSnakeHead(newState.newHead);
                setSnakePath(newState.newPath);
                setFood(newState.newFood);
                setGridState(newState.grid);
            }, 350);
        }

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [gridState, start]);

    const generateNextState = (prevGrid, prevHead, prevPath, direction, prevFood) => {
        const grid = deepCopy(prevGrid);
        const head = prevHead.slice();
        const path = deepCopy(prevPath);
        const food = prevFood.slice();
        const foodEaten = eatFood(head, food);
        let newHead;
        switch (direction) {
            case 'up': {
                newHead = [head[0] - 1, head[1]];
                break;
            }
            case 'down': {
                newHead = [head[0] + 1, head[1]];
                break;
            }
            case 'left': {
                newHead = [head[0], head[1] - 1];
                break;
            }
            case 'right': {
                newHead = [head[0], head[1] + 1];
                break;
            }
            default:
                break;
        }
        path.unshift(head);
        let lastCell = null;
        if (!foodEaten) {
            lastCell = path.pop();
        } else {
            setScore((prevScore) => prevScore + 1);
        }
        let newPath = path;
        grid[newHead[0]][newHead[1]] = 1;
        for (let cell of newPath) {
            grid[cell[0]][cell[1]] = 1;
        }
        if (lastCell !== null) {
            grid[lastCell[0]][lastCell[1]] = 0;
        }
        let newFood;
        if (foodEaten) {
            newFood = generateNewFood(grid);
            grid[newFood[0]][newFood[1]] = 2;
        } else {
            newFood = food;
        }
        return {
            newHead,
            newPath,
            grid,
            newFood,
        };
    };

    const chooseDirection = (prevDirection, arrow) => {
        let newDirection;
        switch (arrow) {
            case 'keyUp': {
                newDirection = prevDirection !== 'down' ? 'up' : 'down';
                break;
            }
            case 'keyDown': {
                newDirection = prevDirection !== 'up' ? 'down' : 'up';
                break;
            }
            case 'keyLeft': {
                newDirection = prevDirection !== 'right' ? 'left' : 'right';
                break;
            }
            case 'keyRight': {
                newDirection = prevDirection !== 'left' ? 'right' : 'left';
                break;
            }
            default:
                break;
        }
        return newDirection;
    };

    const eatFood = (head, food) => {
        return head.every((item, index) => {
            return item === food[index];
        });
    };

    const generateNewFood = (grid) => {
        let newFood;
        while (true) {
            let y = 1 + Math.floor(Math.random() * (gridHeight - 2));
            let x = 1 + Math.floor(Math.random() * (gridWidth - 2));
            if (grid[y][x] === 0) {
                newFood = [y, x];
            } else {
                continue;
            }
            break;
        }
        return newFood;
    };

    const checkWallContact = (head) => {
        if (
            head[0] === 1 ||
            head[0] === gridHeight - 2 ||
            head[1] === 1 ||
            head[1] === gridWidth - 2
        ) {
            setLoss(true);
        }
    };

    const checkSnakeContact = (head, path) => {
        path.forEach((cell) => {
            if (cell[0] === head[0] && cell[1] === head[1]) {
                setLoss(true);
            }
        });
    };

    const handleRestart = () => {
        setStart(false);
        setLoss(false);
        props.gameRestart(false);
    };

    return (
        <div className='snake-container'>
            {!start ? (
                <div className='menu'>
                    <p>Press start to begin</p>
                    <button onClick={handleStart}>Start</button>
                </div>
            ) : (
                <div>
                    {' '}
                    {loss ? (
                        <div className='menu'>
                            <p>GAME OVER</p>
                            <p>Your score:</p>
                            <p>{score}</p>
                            <button onClick={handleRestart}>Try again?</button>
                        </div>
                    ) : (
                        <div
                            className={'grid-container'}
                            style={{ gridTemplateColumns: `repeat(${gridWidth}, 1fr)` }}>
                            {gridState
                                .map((itemH, indexH) => {
                                    return itemH.map((itemW, indexW) => {
                                        switch (itemW) {
                                            case 1:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className='cell-raised snake'></div>
                                                );
                                            case 2:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className='cell-raised food'></div>
                                                );
                                            case 3:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className='cell-raised wall'></div>
                                                );
                                            default:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className='cell empty'></div>
                                                );
                                        }
                                    });
                                })
                                .flatMap((item) => {
                                    return item;
                                })}
                        </div>
                    )}
                </div>
            )}
            {start && !loss && (
                <div className='score'>
                    <p>SCORE:</p>
                    <p>{score}</p>
                </div>
            )}
        </div>
    );
}
