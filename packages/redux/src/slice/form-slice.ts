import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface FormState {
  id: string;
  name: string;
  date: string;
}

const initialState: FormState[] = [];

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormState>) => {
      state.push(action.payload)
    }
  },
});

export const { addForm } = formSlice.actions;

export const allForms = (state: RootState) => state.form;

export default formSlice.reducer;
