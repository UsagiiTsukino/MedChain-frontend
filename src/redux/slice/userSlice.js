import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchUser } from '../../config/api.user';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async ({ query }) => {
    const response = await callFetchUser(query);
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isFetching = false;
        console.error('[UserSlice] Fetch error:', action.error);
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetching = false;
        console.log('[UserSlice] Full response:', action.payload);
        // Handle response format: { result, meta } or { data: { result, meta } }
        const payload = action.payload?.data || action.payload;
        console.log('[UserSlice] Parsed payload:', payload);
        if (payload && payload.result) {
          state.meta = payload.meta;
          state.result = payload.result;
          console.log(
            '[UserSlice] Updated state - meta:',
            payload.meta,
            'result count:',
            payload.result.length
          );
        } else {
          console.warn(
            '[UserSlice] Invalid response format:',
            action.payload,
            'Payload keys:',
            payload ? Object.keys(payload) : 'no payload'
          );
        }
      });
  },
});

export default userSlice.reducer;
