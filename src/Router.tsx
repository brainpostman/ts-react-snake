import { Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import Snake from './components/Snake';
import { useAppSelector } from './hooks/ReduxHooks';

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='setup' replace />}></Route>
            <Route path='setup' element={<App />} />
            <Route path='game' element={<Snake />} />
        </Routes>
    );
};

export default AppRouter;
