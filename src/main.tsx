import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './Router.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter basename='react-snake'>
            <AppRouter />
        </BrowserRouter>
    </React.StrictMode>
);
