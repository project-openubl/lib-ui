import { useCallback, useReducer } from 'react';
import { ActionType, createAction, getType } from 'typesafe-actions';

const openModal = createAction('useModal/action/openModalWithData')<any>();
const closeModal = createAction('useModal/action/startClose')();

// State
type State = Readonly<{
  data: any;
  isOpen: boolean;
}>;

const defaultState: State = {
  data: undefined,
  isOpen: false,
};

// Reducer

type Action = ActionType<typeof openModal | typeof closeModal>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(openModal):
      return {
        ...state,
        data: action.payload,
        isOpen: true,
      };
    case getType(closeModal):
      return {
        ...state,
        data: undefined,
        isOpen: false,
      };
    default:
      return state;
  }
};

// Hook

interface HookState<T> {
  data?: T;
  isOpen: boolean;
  open: (data?: T) => void;
  close: () => void;
}

export const useModal = <T>(): HookState<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
  });

  const openHandler = useCallback((entity?: T) => {
    dispatch(openModal(entity));
  }, []);

  const closeHandler = useCallback(() => {
    dispatch(closeModal());
  }, []);

  return {
    data: state.data,
    isOpen: state.isOpen,
    open: openHandler,
    close: closeHandler,
  };
};

export default useModal;
