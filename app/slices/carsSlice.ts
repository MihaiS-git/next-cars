'use client';

import { ICar } from "@/lib/definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  cars: ICar[];
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    getCarsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCarsSuccess: (state, action: PayloadAction<ICar[]>) => {
      state.loading = false;
      state.cars = action.payload;
    },
    getCarsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getCarsStart, getCarsSuccess, getCarsFailure } =
  carSlice.actions;
export default carSlice.reducer;
