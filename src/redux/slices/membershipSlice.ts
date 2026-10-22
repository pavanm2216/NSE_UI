import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MyMembership, SelectedPlan } from '@/types/membership.types';
import { SELECTED_PLAN_KEY } from '@/constants/membership.constants';

interface MembershipState {
  selectedPlan: SelectedPlan | null;
  membership: MyMembership | null;
}

const loadSelectedPlan = (): SelectedPlan | null => {
  try {
    const raw = localStorage.getItem(SELECTED_PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const membershipSlice = createSlice({
  name: 'membership',
  initialState: {
    selectedPlan: loadSelectedPlan(),
    membership: null,
  } satisfies MembershipState,
  reducers: {
    setSelectedPlan(state, action: PayloadAction<SelectedPlan | null>) {
      state.selectedPlan = action.payload;
      if (action.payload) {
        localStorage.setItem(SELECTED_PLAN_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(SELECTED_PLAN_KEY);
      }
    },
    setMembership(state, action: PayloadAction<MyMembership | null>) {
      state.membership = action.payload;
    },
    clearMembershipCheckout(state) {
      state.selectedPlan = null;
      localStorage.removeItem(SELECTED_PLAN_KEY);
    },
  },
});

export const { setSelectedPlan, setMembership, clearMembershipCheckout } =
  membershipSlice.actions;

export default membershipSlice.reducer;
