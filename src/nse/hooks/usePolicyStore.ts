import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addPolicy as addPolicyAction,
  updatePolicy as updatePolicyAction,
  deletePolicy as deletePolicyAction,
  raiseReview as raiseReviewAction,
  rectifyPolicy as rectifyPolicyAction,
  approvePolicy as approvePolicyAction,
  rejectPolicy as rejectPolicyAction,
  addLimitation as addLimitationAction,
  updateLimitation as updateLimitationAction,
  deleteLimitation as deleteLimitationAction,
  toggleLimitation as toggleLimitationAction,
} from '@/redux/slices/policySlice';
import type { Limitation, Policy } from '@/types/policy.types';

export function usePolicyStore() {
  const dispatch = useAppDispatch();
  const policies = useAppSelector((state) => state.policy.policies);
  const limitations = useAppSelector((state) => state.policy.limitations);

  const addPolicy = useCallback(
    (p: Omit<Policy, 'id' | 'status' | 'submittedAt'>) => dispatch(addPolicyAction(p)),
    [dispatch]
  );
  const updatePolicy = useCallback(
    (id: number, updates: Partial<Policy>) => dispatch(updatePolicyAction({ id, updates })),
    [dispatch]
  );
  const deletePolicy = useCallback(
    (id: number) => dispatch(deletePolicyAction(id)),
    [dispatch]
  );
  const raiseReview = useCallback(
    (policyId: number, remarks: string) => dispatch(raiseReviewAction({ policyId, remarks })),
    [dispatch]
  );
  const rectifyPolicy = useCallback(
    (id: number, updates: Pick<Policy, 'name' | 'description' | 'category'>) =>
      dispatch(rectifyPolicyAction({ id, updates })),
    [dispatch]
  );
  const approvePolicy = useCallback(
    (id: number) => dispatch(approvePolicyAction(id)),
    [dispatch]
  );
  const rejectPolicy = useCallback(
    (id: number) => dispatch(rejectPolicyAction(id)),
    [dispatch]
  );
  const addLimitation = useCallback(
    (l: Omit<Limitation, 'id'>) => dispatch(addLimitationAction(l)),
    [dispatch]
  );
  const updateLimitation = useCallback(
    (id: number, updates: Partial<Limitation>) =>
      dispatch(updateLimitationAction({ id, updates })),
    [dispatch]
  );
  const deleteLimitation = useCallback(
    (id: number) => dispatch(deleteLimitationAction(id)),
    [dispatch]
  );
  const toggleLimitation = useCallback(
    (id: number) => dispatch(toggleLimitationAction(id)),
    [dispatch]
  );

  return {
    policies,
    limitations,
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
  };
}

export type { PolicyStatus, Policy, Limitation } from '@/types/policy.types';
