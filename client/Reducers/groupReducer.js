import { createSlice } from "@reduxjs/toolkit";
import {
    fetchGroups,
    createGroup,
    deleteGroup,
    addMemberToGroup,
    removeMemberFromGroup,
} from "../actions/groupActions";

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
            .addCase(deleteGroup.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(
                    (group) => group._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(addMemberToGroup.pending, (state) => {
                state.error = null;
            })
            .addCase(addMemberToGroup.fulfilled, (state, action) => {
                const { groupId, userId } = action.payload;
                const groupIndex = state.groups.findIndex(
                    (group) => group._id === groupId
                );
                if (groupIndex !== -1) {
                    const updatedGroup = {
                        ...state.groups[groupIndex],
                        members: [...state.groups[groupIndex].members, userId],
                        seatVacant: state.groups[groupIndex].seatVacant - 1 > 0 ? state.groups[groupIndex].seatVacant - 1 : 0
                    };
                    state.groups[groupIndex] = updatedGroup;
                }
                state.error = null;
            })
            .addCase(addMemberToGroup.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeMemberFromGroup.pending, (state) => {
                state.error = null;
            })
            .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
                const { groupId, userId } = action.payload;
                const groupIndex = state.groups.findIndex(
                    (group) => group._id === groupId
                );
                if (groupIndex !== -1) {
                    const updatedGroup = {
                        ...state.groups[groupIndex],
                        members: state.groups[groupIndex].members.filter(
                            (member) => member !== userId
                        ),
                        seatVacant: state.groups[groupIndex].seatVacant + 1
                    };
                    state.groups[groupIndex] = updatedGroup;
                }
                state.error = null;
            })
            .addCase(removeMemberFromGroup.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default groupSlice.reducer;
