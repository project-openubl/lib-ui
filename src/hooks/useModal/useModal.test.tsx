import { renderHook, act } from '@testing-library/react-hooks';
import { useModal } from './useModal';

describe('useModal', () => {
  it('onOpen: without data', () => {
    const { result } = renderHook(() => useModal());

    // Open modal
    const { open } = result.current;
    act(() => open('edit'));
    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.actionKey).toEqual('edit');
  });

  it('onOpen: with data', () => {
    const ENTITY = 'hello';

    const { result } = renderHook(() => useModal<string>());

    // Open modal
    const { open } = result.current;
    act(() => open('edit', ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);
    expect(result.current.actionKey).toEqual('edit');
  });

  it('Close modal with data', () => {
    const ENTITY = 'hello';

    const { result } = renderHook(() => useModal<string>());
    const { open, close } = result.current;

    // Open modal
    act(() => open('edit', ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);
    expect(result.current.actionKey).toEqual('edit');

    // Close modal
    act(() => close());

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.actionKey).toBeUndefined();
  });
});
