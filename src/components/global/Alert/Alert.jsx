/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import { useCallback, useMemo } from 'react';
import { $alert } from '@src/signals';
import Toast from '@src/components/global/Alert/Toast';
import AlertModal from '@src/components/global/Alert/AlertModal';

const ToastContainer = ({ onRemoveNotification }) => (
  <div className="z-index-9999 container-fliud fixed-top">
    {$alert.value.notificationArray.map(notification => (
      <Toast notification={notification} key={notification.id} onRemoveNotification={onRemoveNotification} />
    ))}
  </div>
);

const Alert = () => {
  const { notificationArray } = $alert.value;
  const handleRemoveAlert = useCallback((id) => {
    const filteredAlerts = $alert.value.notificationArray.filter(alert => alert.id !== id);
    $alert.update({ notificationArray: filteredAlerts });
  }, []);

  const sortedNotifications = useMemo(() => {
    const grouped = {
      modal: [],
      toast: [],
      window: [],
    };
    notificationArray?.forEach(notification => {
      if (grouped[notification.displayType]) {
        grouped[notification.displayType]?.push(notification);
      }
    });
    return grouped;
  }, [notificationArray?.length]);

  const devNotifications = notificationArray?.filter(n => n.displayType === 'dev');
  if (devNotifications?.length) {
    devNotifications?.forEach(n => console.error(n));
  }

  if (sortedNotifications.window.length) {
    window.alert(sortedNotifications.window[0].message);
    $alert.reset();
    return null;
  }

  if (sortedNotifications.modal.length) {
    return <AlertModal notification={sortedNotifications.modal[0]} onRemoveNotification={handleRemoveAlert} />;
  }

  if (sortedNotifications.toast.length) {
    return <ToastContainer notifications={sortedNotifications.toast} onRemoveNotification={handleRemoveAlert} />;
  }

  return <div />;
};

export default Alert;
