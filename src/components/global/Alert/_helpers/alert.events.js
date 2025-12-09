import { $alert } from '@src/signals';

export const handleNotification = (notification, overrides) => {
  try {
    const allNotifications = [...$alert.value.notificationArray] || [];

    if (notification.graphQLErrors?.length) { // handle apollo errors from SDK
      notification.graphQLErrors.forEach(e => {
        console.error(notification);
        const newNotification = {
          ...e,
          variant: overrides?.variant || e.variant || 'warning',
          displayType: overrides?.displayType || e.displayType || 'toast',
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        };
        allNotifications.push(newNotification);
      });
    } else if (notification.networkError && Object.keys(notification.networkError).length) { // handle network errors from SDK
      console.error(notification);
      allNotifications.push({
        variant: 'danger',
        displayType: 'toast',
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      });
    } else { // handle FE validation errors, etc
      const newNotification = {
        variant: notification.variant || overrides?.variant || 'warning',
        displayType: notification.displayType || overrides?.displayType || 'toast',
        displayMessage: notification.message || notification || 'An unknown error occurred - please try again',
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      };
      if (newNotification.variant !== 'success') {
        console.error(notification);
      }
      allNotifications.push(newNotification);
    }
    $alert.update({ notificationArray: allNotifications });
  } catch (error) {
    console.error('Error in handleNotification:', { notification, overrides, error });
  }
};

export const successAlert = (message, type = 'toast') => { // type === 'toast || 'modal'
  const notificationArray = $alert.value.notificationArray || [];
  notificationArray.push({
    id: Date.now(),
    displayMessage: message,
    displayType: type,
    variant: 'success',
  });
  $alert.update({
    notificationArray,
  });
};

export const dangerAlert = (message, type = 'toast') => { // type === 'toast || 'modal'
  const notificationArray = $alert.value.notificationArray || [];
  console.error(message);
  notificationArray.push({
    id: Date.now(),
    displayMessage: message,
    displayType: type,
    variant: 'danger',
  });
  $alert.update({
    notificationArray,
  });
};

export const infoAlert = (message, type = 'toast') => { // type === 'toast || 'modal'
  const notificationArray = $alert.value.notificationArray || [];
  notificationArray.push({
    id: Date.now(),
    displayMessage: message,
    displayType: type,
    variant: 'info',
  });
  $alert.update({
    notificationArray,
  });
};
