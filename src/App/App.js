import React from 'react';
import './App.css';

import AppRouter from './AppRouter';

export const App = () => {
    return (
        <div className='block relative pb-10 min-w-1280 min-h-screen overflow-hidden'>
            <div className='flex flex-grow h-full justify-start min-w-1280'>
                <AppRouter />
            </div>
        </div>
    );
};
