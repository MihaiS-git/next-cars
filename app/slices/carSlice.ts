import { Car } from "@/lib/definitions";
import { createSlice } from "@reduxjs/toolkit";

interface CarState {
  cars: Car[];
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
    getCarsSuccess: (state, action) => {
      console.log("getCarsSuccess called");
      state.loading = false;
      state.cars = action.payload;
    },
    getCarsFailure: (state, action) => {
      console.log("getCarsFailure called");
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getCarsStart, getCarsSuccess, getCarsFailure } = carSlice.actions;
export default carSlice.reducer;
