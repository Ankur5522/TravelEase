import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groups: [],
    error: null,
};

const groupSlice = createSlice({
    name: "Group",
    initialState,
    extraReducers: (builder) => {
    },
});

export default groupSlice.reducer;
