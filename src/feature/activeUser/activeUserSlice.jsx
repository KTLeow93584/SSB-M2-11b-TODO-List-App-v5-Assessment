import { createSlice } from '@reduxjs/toolkit';

const activeUserSlice = createSlice({
    name: 'activeUser',
    initialState: {
        user: null,
        lastLogActivity: null,
        token: null
    },
    reducers: {
        login: (state, action) => {
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            return {
                user: action.payload.user,
                lastLogActivity: action.payload.lastLogActivity,
                token: action.payload.token,
            };
        },
        logout: () => {
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            return {
                user: null,
                lastLogActivity: null,
                token: null
            };
        },
        updateUserProfileData: (state, action) => {
            return {
                user: {
                    email: state.user.email,
                    firstName: action.payload.type.toLowerCase() === "first-name" ? action.payload.data : state.user.firstName,
                    lastName: action.payload.type.toLowerCase() === "last-name" ? action.payload.data : state.user.lastName,
                    image: action.payload.type.toLowerCase() === "image" ? action.payload.data : state.user.image,
                    tasks: action.payload.type.toLowerCase() === "tasks" ? action.payload.data : state.user.tasks
                },
                lastLogActivity: state.lastLogActivity,
                token: state.token,
            };
        },
    }
});

export const { login, logout, updateUserProfileData } = activeUserSlice.actions;

export default activeUserSlice.reducer;