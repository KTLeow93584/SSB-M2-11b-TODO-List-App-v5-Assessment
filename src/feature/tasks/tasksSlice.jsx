import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        createTask: (state, action) => {
            // Debug
            //console.log("[Create New Task] Payload.", action.payload);

            const newTask = {
                id: new Date().toISOString(),
                title: action.payload.title,
                description: action.payload.description,
                deadline: action.payload.deadline,
                alarmSound: action.payload.alarmSound
            };
            state.value.push(newTask);
        },
        modifyTask: (state, action) => {
            // Debug
            //console.log("[Modify Task] Payload.", action.payload);

            const taskId = action.payload.taskId;
            const taskIndex = state.findIndex((task) => task.id === taskId);

            state[taskIndex] = action.payload.taskData;
        },
        removeTask: (state, action) => {
            // Debug
            //console.log("[Delete Task, PRE] State Value.", state.value);
            //console.log("[Delete Task, PRE] State Value.", action.payload);

            const taskId = action.payload.taskId;
            const taskIndex = state.findIndex((task) => task.id === taskId);
            state.value.splice(taskIndex, 1);

            // Debug
            //console.log("[Delete Task, POST] State Value.", state.value);
        }
    }
});

export const { addTask, modifyTask, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;