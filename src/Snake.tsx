import { useState, useEffect, useRef } from 'react';
import styles from './Snake.module.scss';
import { useAppSelector } from './hooks/ReduxHooks';
import { useNavigate } from 'react-router-dom';
import { deepCopy } from './utils/game/deepCopy';

export default function Snake() {
    const { foodInitial, headInitial, tailInitial, gridInitial, wallThickness, difficulty } =
        useAppSelector((state) => state.initialGameState);
    const tickRate = difficulty;
    const navigate = useNavigate();
    const gridWidth = gridInitial[0]?.length;
    const gridHeight = gridInitial?.length;

    const [gridState, setGridState] = useState(gridInitial);
    const [head, setHead] = useState(headInitial);
    const [tail, setTail] = useState(tailInitial);
    const [food, setFood] = useState(foodInitial);

    const [direction, setDirection] = useState('up');
    const [keyPress, setKeyPress] = useState('ArrowUp');
    const [start, setStart] = useState(false);
    const [loss, setLoss] = useState(false);
    const [score, setScore] = useState(0);
    const [ticks, setTicks] = useState(0);

    const timeoutRef = useRef<number>(0);

    useEffect(() => {
        if (gridInitial.length === 0) navigate('/setup');
    }, []);

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            switch (event.key) {
                case 'ArrowUp':
                    setKeyPress('ArrowUp');
                    break;
                case 'ArrowDown':
                    setKeyPress('ArrowDown');
                    break;
                case 'ArrowLeft':
                    setKeyPress('ArrowLeft');
                    break;
                case 'ArrowRight':
                    setKeyPress('ArrowRight');
                    break;
                default:
                    break;
            }
        }
        document.addEventListener('keyup', handleKeyPress);
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keyup', handleKeyPress);
            document.addEventListener('keydown', handleKeyPress);
        };
    }, []);

    const gateRapidDirectionChange = (prevDirection: string, arrow: string) => {
        let newDirection = prevDirection;
        switch (arrow) {
            case 'ArrowUp': {
                newDirection = prevDirection !== 'down' ? 'up' : 'down';
                break;
            }
            case 'ArrowDown': {
                newDirection = prevDirection !== 'up' ? 'down' : 'up';
                break;
            }
            case 'ArrowLeft': {
                newDirection = prevDirection !== 'right' ? 'left' : 'right';
                break;
            }
            case 'ArrowRight': {
                newDirection = prevDirection !== 'left' ? 'right' : 'left';
                break;
            }
            default:
                break;
        }
        setDirection(newDirection);
        return newDirection;
    };

    useEffect(() => {
        if (start) {
            if (checkSnakeContact(head, tail) || checkWallContact(head)) {
                setLoss(true);
                setStart(false);
                return () => {
                    window.clearTimeout(timeoutRef.current);
                };
            }
            const newDirection = gateRapidDirectionChange(direction, keyPress);
            const newState = generateNextState(gridState, head, tail, newDirection, food);
            setHead(newState.newHead);
            setTail(newState.newTail);
            setFood(newState.newFood);
            setGridState(newState.newGrid);
            timeoutRef.current = window.setTimeout(() => {
                setTicks((prev) => prev + 1);
            }, tickRate);
        }
        return () => {
            window.clearTimeout(timeoutRef.current);
        };
    }, [ticks, start]);

    const generateNextState = (
        prevGrid: number[][],
        prevHead: number[],
        prevTail: number[][],
        direction: string,
        prevFood: number[]
    ) => {
        const grid = deepCopy(prevGrid) as number[][];
        const head = prevHead.slice();
        const tail = deepCopy(prevTail) as number[][];
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
                newHead = [head[0] - 1, head[1]];
                break;
        }
        tail.unshift(head);
        let lastCell;
        if (!foodEaten) {
            lastCell = tail.pop() as number[];
        } else {
            setScore((prevScore) => prevScore + 1);
        }
        let newTail = tail;
        grid[newHead[0]][newHead[1]] = 1;
        for (let cell of newTail) {
            grid[cell[0]][cell[1]] = 1;
        }
        if (lastCell) {
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
            newTail,
            newGrid: grid,
            newFood,
        };
    };

    const eatFood = (head: number[], food: number[]) => {
        return head.every((item, index) => {
            return item === food[index];
        });
    };

    const generateNewFood = (grid: number[][]) => {
        let newFood = [] as number[];
        for (;;) {
            let y = wallThickness + Math.floor(Math.random() * (gridHeight - wallThickness * 2));
            let x = wallThickness + Math.floor(Math.random() * (gridWidth - wallThickness * 2));
            if (grid[y][x] === 0) {
                newFood = [y, x];
            } else {
                continue;
            }
            break;
        }
        return newFood;
    };

    const checkWallContact = (head: number[]) => {
        if (
            head[0] === wallThickness - 1 ||
            head[0] === gridHeight - wallThickness ||
            head[1] === wallThickness - 1 ||
            head[1] === gridWidth - wallThickness
        ) {
            return true;
        } else {
            return false;
        }
    };

    const checkSnakeContact = (head: number[], path: number[][]) => {
        let loss = false;
        for (let cell of path) {
            if (cell[0] === head[0] && cell[1] === head[1]) {
                loss = true;
                break;
            }
        }
        return loss;
    };

    return (
        <div className={styles.snakeContainer}>
            {!start && !loss ? (
                <div className={styles.menu}>
                    <p>Press start to begin</p>
                    <button onClick={() => setStart(true)}>Start</button>
                </div>
            ) : (
                <div>
                    {' '}
                    {loss ? (
                        <div className={styles.menu}>
                            <p>GAME OVER</p>
                            <p>Your score:</p>
                            <p>{score}</p>
                            <button onClick={() => navigate('/setup')}>Try again?</button>
                        </div>
                    ) : (
                        <div
                            className={styles.gridContainer}
                            style={{ gridTemplateColumns: `repeat(${gridWidth}, 1fr)` }}>
                            {gridState
                                .map((itemH, indexH) => {
                                    return itemH.map((itemW, indexW) => {
                                        switch (itemW) {
                                            case 1:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className={`${styles.cellRaised} ${styles.snake}`}
                                                        style={{
                                                            transition: `all ${tickRate}ms ease-in-out`,
                                                        }}></div>
                                                );
                                            case 2:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className={`${styles.cellRaised} ${styles.food}`}
                                                        style={{
                                                            transition: `all ${tickRate}ms ease-in-out`,
                                                        }}></div>
                                                );
                                            case 3:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className={`${styles.cellRaised} ${styles.wall}`}
                                                        style={{
                                                            transition: `all ${tickRate}ms ease-in-out`,
                                                        }}></div>
                                                );
                                            default:
                                                return (
                                                    <div
                                                        key={`h${indexH} w${indexW}`}
                                                        className={`${styles.cell} ${styles.empty}`}
                                                        style={{
                                                            transition: `all ${tickRate}ms ease-in-out`,
                                                        }}></div>
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
                <div className={styles.score}>
                    <p>SCORE:</p>
                    <p>{score}</p>
                </div>
            )}
        </div>
    );
}
