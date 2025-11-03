import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchRole } from '../../config/api.role';

export const fetchRole = createAsyncThunk(
  'role/fetchRole',
  async ({ query }) => {
    const response = await callFetchRole(query);
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

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRole.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchRole.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.isFetching = false;
        console.log('[RoleSlice] Full response:', action.payload);
        // Handle response format: { items, total } or { data: { items, total } } or { result, meta }
        const payload = action.payload?.data || action.payload;
        console.log('[RoleSlice] Parsed payload:', payload);
        if (payload) {
          // Backend returns { items, total } format
          if (payload.items) {
            state.result = payload.items;
            state.meta = {
              page: 0,
              pageSize: payload.items.length,
              pages: 1,
              total: payload.total || payload.items.length,
            };
            console.log(
              '[RoleSlice] Updated state - meta:',
              state.meta,
              'result count:',
              payload.items.length
            );
          } else if (payload.result) {
            // Also handle { result, meta } format for consistency
            state.meta = payload.meta;
            state.result = payload.result;
            console.log(
              '[RoleSlice] Updated state - meta:',
              payload.meta,
              'result count:',
              payload.result.length
            );
          } else {
            console.warn(
              '[RoleSlice] Invalid response format:',
              payload,
              'Payload keys:',
              Object.keys(payload)
            );
          }
        }
      });
  },
});

export default roleSlice.reducer;
