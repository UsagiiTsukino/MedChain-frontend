import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { callFetchAccount } from '../../config/api.auth';

export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async () => {
    const response = await callFetchAccount();
    console.log('[fetchAccount] Raw response:', response);
    // Axios interceptor already unwrapped response.data, so response IS the data
    return response;
  }
);

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    id: '',
    fullName: '',
    email: '',
    role: '',
    walletAddress: '',
    centerName: '',
    phoneNumber: '',
    birthday: '',
    address: '',
  },
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;

      state.user.id = action.payload.id;
      state.user.fullName = action.payload.fullName;
      state.user.email = action.payload.email;
      state.user.role = action.payload.role;
      state.user.walletAddress = action.payload.walletAddress;
      state.user.centerName = action.payload.centerName;
      state.user.phoneNumber = action.payload.phoneNumber;
      state.user.birthday = action.payload.birthday;
      state.user.address = action.payload.address;
    },
    setLogoutAction: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = {
        id: '',
        fullName: '',
        email: '',
        role: '',
        walletAddress: '',
        centerName: '',
        phoneNumber: '',
        birthday: '',
        address: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      console.log('[AccountSlice] Fetch account fulfilled:', action.payload);
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user.id = action.payload.id;
        state.user.fullName = action.payload.fullName;
        state.user.email = action.payload.email;
        state.user.role = action.payload.role;
        state.user.walletAddress = action.payload.walletAddress;
        state.user.centerName = action.payload.centerName;
        state.user.phoneNumber = action.payload.phoneNumber;
        state.user.birthday = action.payload.birthday;
        state.user.address = action.payload.address;
        console.log('[AccountSlice] User state updated:', state.user);
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const { setUserLoginInfo, setLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;
