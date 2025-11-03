import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  callFetchAppointmentOfCenter,
  callMySchedule,
} from '../../config/api.appointment';

export const fetchAppointmentOfCenter = createAsyncThunk(
  'appointment/fetchAppointmentOfCenter',
  async ({ query }) => {
    const response = await callFetchAppointmentOfCenter(query);
    return response;
  }
);

export const fetchAppointmentOfDoctor = createAsyncThunk(
  'appointment/fetchAppointmentOfDoctor',
  async ({ query }) => {
    const response = await callMySchedule(query);
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

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentOfCenter.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchAppointmentOfCenter.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchAppointmentOfCenter.fulfilled, (state, action) => {
        state.isFetching = false;
        // Handle response format: { result, meta } or { data: { result, meta } }
        const payload = action.payload?.data || action.payload;
        if (payload && payload.result) {
          state.meta = payload.meta;
          state.result = payload.result;
        }
      });

    builder
      .addCase(fetchAppointmentOfDoctor.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchAppointmentOfDoctor.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchAppointmentOfDoctor.fulfilled, (state, action) => {
        state.isFetching = false;
        // Handle response format: { result, meta } or { data: { result, meta } }
        const payload = action.payload?.data || action.payload;
        if (payload && payload.result) {
          state.meta = payload.meta;
          state.result = payload.result;
        }
      });
  },
});

export default appointmentSlice.reducer;
