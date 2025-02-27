'use client';

import { ICarFrontend } from "@/lib/definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  cars: ICarFrontend[];
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
      console.log("getCarsStart called");
      state.loading = true;
      state.error = null;
    },
    getCarsSuccess: (state, action: PayloadAction<ICarFrontend[]>) => {
      console.log("getCarsSuccess called");
      state.loading = false;
      state.cars = action.payload;
    },
    getCarsFailure: (state, action: PayloadAction<string>) => {
      console.log("getCarsFailure called");
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getCarsStart, getCarsSuccess, getCarsFailure } =
  carSlice.actions;
export default carSlice.reducer;
