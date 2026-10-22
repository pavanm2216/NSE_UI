import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Limitation, Policy, PolicyStatus } from '@/types/policy.types';

interface PolicyState {
  policies: Policy[];
  limitations: Limitation[];
}

const initialState: PolicyState = {
  policies: [],
  limitations: [],
};

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    addPolicy(state, action: PayloadAction<Omit<Policy, 'id' | 'status' | 'submittedAt'>>) {
      const p = action.payload;
      const isCompliance = p.submittedBy !== "Angel & VC's";
      const status: PolicyStatus = isCompliance ? 'awaiting-admin' : 'pending';
      state.policies.push({
        ...p,
        id: Date.now(),
        status,
        submittedAt: new Date().toISOString().split('T')[0],
      });
    },
    updatePolicy(state, action: PayloadAction<{ id: number; updates: Partial<Policy> }>) {
      const { id, updates } = action.payload;
      const index = state.policies.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.policies[index] = { ...state.policies[index], ...updates };
      }
    },
    deletePolicy(state, action: PayloadAction<number>) {
      state.policies = state.policies.filter((p) => p.id !== action.payload);
    },
    raiseReview(state, action: PayloadAction<{ policyId: number; remarks: string }>) {
      const { policyId, remarks } = action.payload;
      const policy = state.policies.find((p) => p.id === policyId);
      if (policy) {
        policy.status = 'under-review';
        policy.review = {
          id: Date.now(),
          remarks,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'Compliance Team',
        };
      }
    },
    rectifyPolicy(
      state,
      action: PayloadAction<{
        id: number;
        updates: Pick<Policy, 'name' | 'description' | 'category'>;
      }>
    ) {
      const { id, updates } = action.payload;
      const policy = state.policies.find((p) => p.id === id);
      if (policy) {
        Object.assign(policy, updates, { status: 'rectified' as PolicyStatus, review: undefined });
      }
    },
    approvePolicy(state, action: PayloadAction<number>) {
      const policy = state.policies.find((p) => p.id === action.payload);
      if (policy) {
        policy.status = 'approved';
        policy.review = undefined;
      }
    },
    rejectPolicy(state, action: PayloadAction<number>) {
      const policy = state.policies.find((p) => p.id === action.payload);
      if (policy) {
        policy.status = 'rejected';
      }
    },
    addLimitation(state, action: PayloadAction<Omit<Limitation, 'id'>>) {
      state.limitations.push({ ...action.payload, id: Date.now() });
    },
    updateLimitation(state, action: PayloadAction<{ id: number; updates: Partial<Limitation> }>) {
      const { id, updates } = action.payload;
      const index = state.limitations.findIndex((l) => l.id === id);
      if (index !== -1) {
        state.limitations[index] = { ...state.limitations[index], ...updates };
      }
    },
    deleteLimitation(state, action: PayloadAction<number>) {
      state.limitations = state.limitations.filter((l) => l.id !== action.payload);
    },
    toggleLimitation(state, action: PayloadAction<number>) {
      const limitation = state.limitations.find((l) => l.id === action.payload);
      if (limitation) {
        limitation.enabled = !limitation.enabled;
      }
    },
  },
});

export const {
  addPolicy,
  updatePolicy,
  deletePolicy,
  raiseReview,
  rectifyPolicy,
  approvePolicy,
  rejectPolicy,
  addLimitation,
  updateLimitation,
  deleteLimitation,
  toggleLimitation,
} = policySlice.actions;

export default policySlice.reducer;
