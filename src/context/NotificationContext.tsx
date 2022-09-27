import * as React from 'react';
import { Alert, AlertActionCloseButton, AlertGroup } from '@patternfly/react-core';

// Notifications Component

export type notificationType = 'success' | 'info' | 'warning' | 'danger' | 'default';

export interface INotification {
  title: string;
  message: string | JSX.Element;
  variant: notificationType;
  key: string;
  actionClose?: boolean;
  timeout?: number | boolean;
}

export const Notifications: React.FunctionComponent = () => {
  const appContext = React.useContext(NotificationContext);
  return (
    <AlertGroup isToast aria-live="polite">
      {appContext.notifications.map((notification) => {
        return (
          <Alert
            title={notification.title}
            variant={notification.variant}
            key={notification.key}
            {...(notification.actionClose && {
              actionClose: (
                <AlertActionCloseButton
                  onClose={() => {
                    appContext.dismissNotification(notification.key);
                  }}
                />
              ),
            })}
            timeout={notification.timeout}
          >
            {notification.message}
          </Alert>
        );
      })}
    </AlertGroup>
  );
};

// Context

interface INotificationContext {
  pushNotification: (notification: INotification) => void;
  dismissNotification: (key: string) => void;
  notifications: INotification[];
}

const appContextDefaultValue = {} as INotificationContext;
export const NotificationContext =
  React.createContext<INotificationContext>(appContextDefaultValue);

interface INotificationContextProvider {
  children: React.ReactNode;
}

export const NotificationContextProvider: React.FunctionComponent<INotificationContextProvider> = ({
  children,
}: INotificationContextProvider) => {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);

  const pushNotification = (notification: INotification) => {
    setNotifications([...notifications, notification]);
  };

  const dismissNotification = (key: string) => {
    const remainingNotifications = notifications.filter((n) => n.key !== key);
    setNotifications(remainingNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        pushNotification,
        dismissNotification,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
