import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './Router.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename='ts-react-snake'>
                <AppRouter />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
