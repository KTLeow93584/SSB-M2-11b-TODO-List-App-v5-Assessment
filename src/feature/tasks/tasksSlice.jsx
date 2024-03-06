import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        createTask: (state, action) => {
            // Debug
            //console.log("[Create New Task] Payload.", action.payload);

            const newTask = {
                id: action.payload.id,
                gameID: action.payload.gameID,
                regionName: action.payload.regionName,
                description: action.payload.description,
                deadline: action.payload.deadline,
                alarmSound: action.payload.alarmSound
            };
            state.push(newTask);
        },
        modifyTask: (state, action) => {
            // Debug
            //console.log("[Modify Task] Payload.", action.payload);

            state[action.payload.taskIndex] = action.payload.modifiedTaskData;
        },
        removeTask: (state, action) => {
            // Debug
            //console.log("[Delete Task, PRE] State Value.", state);
            //console.log("[Delete Task, PRE] State Value.", action.payload);

            const taskId = action.payload.taskId;
            const taskIndex = state.findIndex((task) => task.id === taskId);
            state.splice(taskIndex, 1);

            // Debug
            //console.log("[Delete Task, POST] State Value.", state);
        }
    }
});

export const { createTask, modifyTask, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;