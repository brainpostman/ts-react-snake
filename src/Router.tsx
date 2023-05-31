import { Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import Snake from './components/Snake';
import { useAppSelector } from './hooks/ReduxHooks';

const AppRouter = () => {
    const initialGameState = useAppSelector((state) => state.initialGameState);

    return (
        <Routes>
            <Route path='/' element={<Navigate to='setup' replace />}></Route>
            <Route path='setup' element={<App />} />
            <Route
                path='game'
                element={
                    initialGameState.gridInitial.length !== 0 ? (
                        <Snake />
                    ) : (
                        <Navigate to='setup' replace />
                    )
                }
            />
        </Routes>
    );
};

export default AppRouter;
