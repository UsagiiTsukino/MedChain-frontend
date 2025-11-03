import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchCenter } from '../../config/api.center';

export const fetchCenter = createAsyncThunk(
  'center/fetchCenter',
  async ({ query }) => {
    const response = await callFetchCenter(query);
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

export const centerSlice = createSlice({
  name: 'center',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenter.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchCenter.rejected, (state, action) => {
        state.isFetching = false;
        console.error('[CenterSlice] Fetch error:', action.error);
      })
      .addCase(fetchCenter.fulfilled, (state, action) => {
        state.isFetching = false;
        console.log('[CenterSlice] Full response:', action.payload);
        // Handle response format: { result, meta } or { data: { result, meta } }
        const payload = action.payload?.data || action.payload;
        console.log('[CenterSlice] Parsed payload:', payload);
        if (payload && payload.result) {
          state.meta = payload.meta;
          state.result = payload.result;
          console.log(
            '[CenterSlice] Updated state - meta:',
            payload.meta,
            'result count:',
            payload.result.length
          );
        } else {
          console.warn(
            '[CenterSlice] Invalid response format:',
            action.payload,
            'Payload keys:',
            payload ? Object.keys(payload) : 'no payload'
          );
        }
      });
  },
});

export default centerSlice.reducer;
