import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { iUser } from "../../types/user";

const initialState: iUser = {
  email: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    create: (state, { payload }: PayloadAction<iUser>) => {
      state.email = payload.email;
      state.token = payload.token;
    },
  },
});

export const { create: loginAction } = userSlice.actions;
export default userSlice;
