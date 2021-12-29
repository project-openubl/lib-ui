import { renderHook, act } from '@testing-library/react-hooks';
import { useModal } from './useModal';

describe('useModal', () => {
  it('onOpen: without data', () => {
    const { result } = renderHook(() => useModal<'edit'>());

    // Open modal
    const { open } = result.current;
    act(() => open('edit'));
    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.action).toEqual('edit');
    expect(result.current.isAction('edit')).toEqual(true);
  });

  it('onOpen: with data', () => {
    const ENTITY = 'hello';

    const { result } = renderHook(() => useModal<'edit'>());

    // Open modal
    const { open } = result.current;
    act(() => open('edit', ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);
    expect(result.current.action).toEqual('edit');
    expect(result.current.isAction('edit')).toEqual(true);
  });

  it('Close modal with data', () => {
    const ENTITY = 'hello';

    const { result } = renderHook(() => useModal<"edit">());
    const { open, close } = result.current;

    // Open modal
    act(() => open('edit', ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);
    expect(result.current.action).toEqual('edit');
    expect(result.current.isAction('edit')).toEqual(true);

    // Close modal
    act(() => close());

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.action).toBeUndefined();
    expect(result.current.isAction('edit')).toEqual(false);
  });
});
