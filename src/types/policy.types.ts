export type PolicyStatus =
  | 'pending'
  | 'under-review'
  | 'approved'
  | 'rectified'
  | 'awaiting-admin'
  | 'rejected';

export interface PolicyReview {
  id: number;
  remarks: string;
  reviewedAt: string;
  reviewedBy: string;
}

export interface Policy {
  id: number;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  priority: number;
  status: PolicyStatus;
  submittedBy: string;
  submittedAt: string;
  review?: PolicyReview;
}

export interface Limitation {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}
