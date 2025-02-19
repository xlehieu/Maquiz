import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    isAdmin: false,
    access_token: '',
};
export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name, email, phone, address, avatar, isAdmin, access_token } = action.payload;
            //state này dựa trên thằng initstate
            state.name = name ? name : email;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.isAdmin = isAdmin;
            state.access_token = access_token;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.isAdmin = false;
            state.access_token = '';
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userReducer.actions;

export default userReducer.reducer;
