// src/features/brtSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBrts, createBrt, updateBrt, deleteBrt } from '../services/brtService';

// Async Thunks
export const getBrts = createAsyncThunk('brts/getBrts', async () => {
  const response = await fetchBrts();
  return response;
});

export const addBrt = createAsyncThunk('brts/addBrt', async (brtData) => {
  const response = await createBrt(brtData);
  return response;
});

export const editBrt = createAsyncThunk('brts/editBrt', async ({ id, brtData }) => {
  const response = await updateBrt(id, brtData);
  return response;
});

export const removeBrt = createAsyncThunk('brts/removeBrt', async (id) => {
  const response = await deleteBrt(id);
  return response;
});

// Slice
const brtSlice = createSlice({
  name: 'brts',
  initialState: {
    brts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch BRTs
    builder.addCase(getBrts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBrts.fulfilled, (state, action) => {
      state.loading = false;
      state.brts = action.payload;
    });
    builder.addCase(getBrts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create BRT
    builder.addCase(addBrt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBrt.fulfilled, (state, action) => {
      state.loading = false;
      state.brts.unshift(action.payload); // Add new BRT to the top of the list
    });
    builder.addCase(addBrt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Update BRT
    builder.addCase(editBrt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editBrt.fulfilled, (state, action) => {
      state.loading = false;
      state.brts = state.brts.map((brt) =>
        brt.id === action.payload.id ? action.payload : brt
      );
    });
    builder.addCase(editBrt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete BRT
    builder.addCase(removeBrt.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeBrt.fulfilled, (state, action) => {
      state.loading = false;
      state.brts = state.brts.filter((brt) => brt.id !== action.payload.id);
    });
    builder.addCase(removeBrt.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default brtSlice.reducer;