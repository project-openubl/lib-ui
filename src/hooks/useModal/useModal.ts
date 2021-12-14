import { useCallback, useReducer } from 'react';
import { ActionType, createAction, getType } from 'typesafe-actions';

interface IOpenAction {
  data: any;
  actionKey: string;
}

const openModal = createAction('useModal/action/openModalWithData')<IOpenAction>();
const closeModal = createAction('useModal/action/startClose')();

// State
type State = Readonly<{
  data: any;
  isOpen: boolean;
  actionKey?: string;
}>;

const defaultState: State = {
  data: undefined,
  isOpen: false,
  actionKey: undefined,
};

// Reducer

type Action = ActionType<typeof openModal | typeof closeModal>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(openModal):
      return {
        ...state,
        data: action.payload.data,
        isOpen: true,
        actionKey: action.payload.actionKey,
      };
    case getType(closeModal):
      return {
        ...state,
        data: undefined,
        isOpen: false,
        actionKey: undefined,
      };
    default:
      return state;
  }
};

// Hook

interface HookState<T> {
  data?: T;
  isOpen: boolean;
  actionKey?: string;
  open: (actionKey: string, data?: T) => void;
  close: () => void;
}

export const useModal = <T>(): HookState<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
  });

  const openHandler = useCallback((actionKey: string, entity?: T) => {
    dispatch(openModal({ actionKey, data: entity }));
  }, []);

  const closeHandler = useCallback(() => {
    dispatch(closeModal());
  }, []);

  return {
    data: state.data,
    isOpen: state.isOpen,
    actionKey: state.actionKey,
    open: openHandler,
    close: closeHandler,
  };
};

export default useModal;
