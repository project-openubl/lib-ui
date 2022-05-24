import { ToolbarChip } from '@patternfly/react-core';
import { renderHook, act } from '@testing-library/react-hooks';
import { useToolbar } from './useToolbar';

describe('useToolbar', () => {
  it('initialValue', () => {
    type KeyType = 'key1' | 'key2';

    const initialValue = new Map<KeyType, string[]>([['key1', ['value1', 'value2']]]);
    const { result } = renderHook(() => useToolbar<KeyType, string>(initialValue));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.filters.get('key1')).toEqual(['value1', 'value2']);
  });

  it('clearAllFilters', () => {
    type KeyType = 'key1' | 'key2';

    const initialValue = new Map<KeyType, string[]>([
      ['key1', ['value1', 'value2']],
      ['key2', ['value3', 'value4']],
    ]);
    const { result } = renderHook(() => useToolbar<KeyType, string>(initialValue));

    const { clearAllFilters } = result.current;
    act(() => clearAllFilters());

    expect(result.current.isPresent).toBe(false);
    expect(result.current.filters.get('key1')).toEqual([]);
    expect(result.current.filters.get('key2')).toEqual([]);
  });

  it("addFilter: 'string'", () => {
    type KeyType = 'key1' | 'key2';

    const { result } = renderHook(() => useToolbar<KeyType, string>());

    const { addFilter } = result.current;
    expect(result.current.isPresent).toBe(false);

    act(() => addFilter('key1', 'value1'));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.filters.get('key1')).toEqual(['value1']);
  });

  it("addFilter: 'ToolbarChip'", () => {
    type KeyType = 'key1' | 'key2';

    const { result } = renderHook(() => useToolbar<KeyType, ToolbarChip>());

    const { addFilter } = result.current;
    expect(result.current.isPresent).toBe(false);

    const chip: ToolbarChip = { key: 'value1', node: 'VALUE1' };
    act(() => addFilter('key1', chip));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.filters.get('key1')).toEqual([chip]);
  });

  it("setFilter: 'string'", () => {
    type KeyType = 'key1' | 'key2';

    const { result } = renderHook(() => useToolbar<KeyType, string>());

    const { setFilter } = result.current;
    expect(result.current.isPresent).toBe(false);

    act(() => setFilter('key1', ['value1', 'value2']));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.filters.get('key1')).toEqual(['value1', 'value2']);
  });

  it("setFilter: 'ToolbarChip'", () => {
    type KeyType = 'key1' | 'key2';

    const { result } = renderHook(() => useToolbar<KeyType, ToolbarChip>());

    const { setFilter } = result.current;
    expect(result.current.isPresent).toBe(false);

    const chip1: ToolbarChip = { key: 'value1', node: 'VALUE2' };
    const chip2: ToolbarChip = { key: 'value2', node: 'VALUE2' };
    act(() => setFilter('key1', [chip1, chip2]));

    expect(result.current.isPresent).toBe(true);
    expect(result.current.filters.get('key1')).toEqual([chip1, chip2]);
  });

  it('removeFilter: single value', () => {
    type KeyType = 'key1' | 'key2';

    const initialValue = new Map<KeyType, string[]>([
      ['key1', ['value1', 'value11']],
      ['key2', ['value2', 'value22']],
    ]);
    const { result } = renderHook(() => useToolbar<KeyType, string>(initialValue));

    const { removeFilter } = result.current;
    act(() => removeFilter('key1', 'value11'));

    expect(result.current.filters.get('key1')).toEqual(['value1']);
    expect(result.current.filters.get('key2')).toEqual(['value2', 'value22']);
  });

  it('removeFilter: single value', () => {
    type KeyType = 'key1' | 'key2';

    const initialValue = new Map<KeyType, ToolbarChip[]>([
      [
        'key1',
        [
          { key: 'value1', node: 'VALUE1' },
          { key: 'value11', node: 'VALUE11' },
        ],
      ],
      [
        'key2',
        [
          { key: 'value2', node: 'VALUE2' },
          { key: 'value22', node: 'VALUE22' },
        ],
      ],
    ]);
    const { result } = renderHook(() => useToolbar<KeyType, ToolbarChip>(initialValue));

    const { removeFilter } = result.current;
    act(() => removeFilter('key1', { key: 'value11', node: 'VALUE11' }));

    expect(result.current.filters.get('key1')).toEqual([{ key: 'value1', node: 'VALUE1' }]);
  });

  it('removeFilter: array', () => {
    type KeyType = 'key1' | 'key2';

    const initialValue = new Map<KeyType, string[]>([
      ['key1', ['value1', 'value11', 'value111']],
      ['key2', ['value2', 'value22', 'value222']],
    ]);
    const { result } = renderHook(() => useToolbar<KeyType, string>(initialValue));

    const { removeFilter } = result.current;
    act(() => removeFilter('key1', ['value1', 'value111']));

    expect(result.current.filters.get('key1')).toEqual(['value11']);
    expect(result.current.filters.get('key2')).toEqual(['value2', 'value22', 'value222']);
  });
});
