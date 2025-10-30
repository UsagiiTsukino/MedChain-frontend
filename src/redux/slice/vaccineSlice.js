import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchVaccine } from '../../config/api.vaccine';

export const fetchVaccine = createAsyncThunk(
  'vaccine/fetchVaccine',
  async ({ query }) => {
    const response = await callFetchVaccine(query);
    return response;
  }
);

const initialState = {
  isFetching: true,
  meta: {
    page: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
};

export const vaccineSlice = createSlice({
  name: 'vaccine',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaccine.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchVaccine.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchVaccine.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.isFetching = false;
          state.meta = action.payload.data.meta;
          state.result = action.payload.data.result;
        }
      });
  },
});

export default vaccineSlice.reducer;

