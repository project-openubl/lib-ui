import { SortByDirection } from '@patternfly/react-table';
import { renderHook, act } from '@testing-library/react-hooks';
import { useTableControls } from './useTableControls';

describe('useTableControls', () => {
  it('Update pagination correctly', () => {
    const { result } = renderHook(() => useTableControls());

    //
    const { changePage: handlePaginationChange } = result.current;
    act(() => handlePaginationChange({ page: 2, perPage: 50 }));
    expect(result.current.page).toMatchObject({
      page: 2,
      perPage: 50,
    });
  });

  it('Update state sortBy correctly', () => {
    const COLUMN_INDEX = 2;

    const { result } = renderHook(() => useTableControls());

    //
    const { changeSortBy: handleSortChange } = result.current;
    act(() =>
      handleSortChange(jest.fn() as any, COLUMN_INDEX, SortByDirection.desc, jest.fn() as any)
    );

    expect(result.current.sortBy).toMatchObject({
      index: COLUMN_INDEX,
      direction: SortByDirection.desc,
    });
  });

  it('Start with default pagination', () => {
    const { result } = renderHook(() => useTableControls({ page: { page: 2, perPage: 50 } }));

    //
    const { page: paginationQuery } = result.current;

    expect(paginationQuery.page).toBe(2);
    expect(paginationQuery.perPage).toBe(50);
  });

  it('Start with default sortBy', () => {
    const { result } = renderHook(() =>
      useTableControls({
        page: {
          page: 3,
          perPage: 100,
        },
        sortBy: { index: 2, direction: 'desc' },
      })
    );

    //
    const { sortBy: sortByQuery } = result.current;

    expect(sortByQuery?.index).toBe(2);
    expect(sortByQuery?.direction).toBe('desc');
  });

  it("Doesn't allow Zero or negative page values", () => {
    const { result } = renderHook(() => useTableControls());

    const { changePage: handlePaginationChange } = result.current;

    // Zero
    act(() => handlePaginationChange({ page: 0, perPage: 50 }));
    expect(result.current.page).toMatchObject({
      page: 1,
      perPage: 50,
    });

    // Negative
    act(() => handlePaginationChange({ page: -1, perPage: 50 }));
    expect(result.current.page).toMatchObject({
      page: 1,
      perPage: 50,
    });
  });
});
