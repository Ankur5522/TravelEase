import { createSlice } from "@reduxjs/toolkit";
import { fetchGroups, createGroup } from "../actions/groupActions";

const initialState = {
    groups: [],
    error: null,
};

const groupSlice = createSlice({
    name: "Group",
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchGroups.pending, (state) => {
            state.error = null;
        })
        .addCase(fetchGroups.fulfilled, (state, action) => {
            state.groups = action.payload;
            state.error = null;
        })
        .addCase(fetchGroups.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(createGroup.pending, (state) => {
            state.error = null;
        })
        .addCase(createGroup.fulfilled, (state, action) => {
            state.groups.push(action.payload);
            state.error = null;
        })
        .addCase(createGroup.rejected, (state, action) => {
            state.error = action.payload;
        })
    },
});

export default groupSlice.reducer;
