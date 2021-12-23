import React, { useReducer } from 'react';
import { ActionType, createAction, getType } from 'typesafe-actions';
import { Button, ButtonVariant, Modal, ModalVariant } from '@patternfly/react-core';

interface Options {
  title: string;
  titleIconVariant?:
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'default'
    | React.ComponentType<any>;
  message: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  confirmBtnVariant: ButtonVariant;
  onConfirm: () => void;
}

const openAction = createAction('open')<Options>();
const enableProcessingAction = createAction('enableProcessing')();
const closeAction = createAction('close')();

interface IConfirmmationContext {
  open: (options: Options) => void;
  enableProcessing: () => void;
  close: () => void;
}

const ConfirmationContext = React.createContext<IConfirmmationContext>({
  open: () => undefined,
  enableProcessing: () => undefined,
  close: () => undefined,
});

//

export type Action = ActionType<
  typeof openAction | typeof enableProcessingAction | typeof closeAction
>;

export type State = Readonly<{
  isOpen: boolean;
  isProcessing: boolean;

  title: string;
  titleIconVariant?:
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'default'
    | React.ComponentType<any>;
  message: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  confirmBtnVariant: ButtonVariant;

  hideCancelBtn: boolean;

  onConfirm: () => void;
}>;

export const defaultState: State = {
  isOpen: false,
  isProcessing: false,

  title: '',
  titleIconVariant: undefined,
  message: '',
  confirmBtnLabel: 'Confirm',
  cancelBtnLabel: 'Cancel',
  confirmBtnVariant: ButtonVariant.primary,

  hideCancelBtn: false,

  onConfirm: () => undefined,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(openAction):
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    case getType(enableProcessingAction):
      return {
        ...state,
        isProcessing: true,
      };
    case getType(closeAction):
      return defaultState;
    default:
      return state;
  }
};

//

interface IConfirmationContextProviderProps {
  children: React.ReactNode;
}

export const ConfirmationContextProvider: React.FunctionComponent<IConfirmationContextProviderProps> =
  ({ children }: IConfirmationContextProviderProps) => {
    const [state, dispatch] = useReducer(reducer, { ...defaultState });

    const onOpen = (options: Options) => dispatch(openAction(options));
    const onProcessing = () => dispatch(enableProcessingAction());
    const onCancel = () => {
      dispatch(closeAction());
    };

    const confirmBtn = (
      <Button
        key="confirm"
        aria-label="confirm"
        variant={state.confirmBtnVariant}
        isDisabled={state.isProcessing}
        onClick={state.onConfirm}
      >
        {state.confirmBtnLabel}
      </Button>
    );

    const cancelBtn = !state.hideCancelBtn ? (
      <Button
        key="cancel"
        aria-label="cancel"
        variant={ButtonVariant.link}
        isDisabled={state.isProcessing}
        onClick={onCancel}
      >
        {state.cancelBtnLabel}
      </Button>
    ) : undefined;

    return (
      <ConfirmationContext.Provider
        value={{
          open: onOpen,
          enableProcessing: onProcessing,
          close: onCancel,
        }}
      >
        {children}
        <Modal
          variant={ModalVariant.small}
          title={state.title}
          titleIconVariant={state.titleIconVariant}
          isOpen={state.isOpen}
          onClose={onCancel}
          aria-label="confirm-dialog"
          actions={!state.hideCancelBtn ? [confirmBtn, cancelBtn] : [confirmBtn]}
        >
          {state.message}
        </Modal>
      </ConfirmationContext.Provider>
    );
  };

export const useConfirmationContext = (): IConfirmmationContext =>
  React.useContext(ConfirmationContext);
