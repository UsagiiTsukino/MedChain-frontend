import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchPermission } from '../../config/api.permission';

export const fetchPermission = createAsyncThunk(
  'permission/fetchPermission',
  async ({ query }) => {
    const response = await callFetchPermission(query);
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

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermission.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchPermission.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchPermission.fulfilled, (state, action) => {
        state.isFetching = false;
        console.log('[PermissionSlice] Full response:', action.payload);
        // Handle response format: { items, total } or { data: { items, total } } or { result, meta }
        const payload = action.payload?.data || action.payload;
        console.log('[PermissionSlice] Parsed payload:', payload);
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
              '[PermissionSlice] Updated state - meta:',
              state.meta,
              'result count:',
              payload.items.length
            );
          } else if (payload.result) {
            // Also handle { result, meta } format for consistency
            state.meta = payload.meta;
            state.result = payload.result;
            console.log(
              '[PermissionSlice] Updated state - meta:',
              payload.meta,
              'result count:',
              payload.result.length
            );
          } else {
            console.warn(
              '[PermissionSlice] Invalid response format:',
              payload,
              'Payload keys:',
              Object.keys(payload)
            );
          }
        }
      });
  },
});

export default permissionSlice.reducer;
