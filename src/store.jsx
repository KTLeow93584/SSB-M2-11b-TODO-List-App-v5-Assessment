import { configureStore } from '@reduxjs/toolkit';

import tasksReducer from './feature/tasks/tasksSlice.jsx';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer
    }
});