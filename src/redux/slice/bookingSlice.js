import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callAllBookings } from '../../config/api.appointment';

export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async ({ page = 0, size = 10 } = {}) => {
    // eslint-disable-next-line no-console
    console.log('[fetchBooking] Requesting page:', page, 'size:', size);
    const response = await callAllBookings(page, size);
    // eslint-disable-next-line no-console
    console.log('[fetchBooking] Response:', response);
    return response;
  }
);

const initialState = {
  isFetching: true,
  meta: {
    page: 0, // Backend uses 0-based pagination
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
        // eslint-disable-next-line no-console
        console.log('[BookingSlice] Response:', action.payload);
        if (action.payload) {
          state.isFetching = false;
          // Backend returns { result, meta } in response body
          // Axios interceptor already unwraps res.data, so action.payload = { result, meta }
          state.meta = action.payload.meta || {
            page: 0,
            pageSize: 10,
            pages: 0,
            total: 0,
          };
          state.result = action.payload.result || [];
          // eslint-disable-next-line no-console
          console.log('[BookingSlice] Updated state:', {
            meta: state.meta,
            result: state.result,
          });
        } else {
          state.isFetching = false;
        }
      });
  },
});

export default bookingSlice.reducer;
