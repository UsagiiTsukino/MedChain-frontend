import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callAllBookings } from '../../config/api.appointment';

export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async ({ query }) => {
    const response = await callAllBookings(query);
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

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooking.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchBooking.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.isFetching = false;
          state.meta = action.payload.data.meta;
          state.result = action.payload.data.result;
        }
      });
  },
});

export default bookingSlice.reducer;
