import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveVertical, setSearchQuery } from '@/redux/slices/uiSlice';

type Vertical = 'LD' | 'IE' | 'RE' | 'VC';

export function useVerticalFilter() {
  const dispatch = useAppDispatch();
  const activeVertical = useAppSelector((state) => state.ui.activeVertical);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);

  const setActiveVerticalHandler = useCallback(
    (v: Vertical) => dispatch(setActiveVertical(v)),
    [dispatch]
  );

  const setSearchQueryHandler = useCallback(
    (q: string) => dispatch(setSearchQuery(q)),
    [dispatch]
  );

  return {
    activeVertical,
    setActiveVertical: setActiveVerticalHandler,
    searchQuery,
    setSearchQuery: setSearchQueryHandler,
  };
}
