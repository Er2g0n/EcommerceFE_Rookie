import { message } from 'antd';
import { useCallback } from 'react';

interface NotificationOptions {
  successMessage?: string;
  errorMessage?: string;
  warningMessage?: string;
}

const useNotification = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const notifySuccess = useCallback((customMessage?: string) => {
    messageApi.open({
      type: 'success',
      content: customMessage || 'Operation completed successfully',
    });
  }, [messageApi]);

  const notifyError = useCallback((customMessage?: string) => {
    messageApi.open({
      type: 'error',
      content: customMessage || 'Operation failed',
    });
  }, [messageApi]);

  const notifyWarning = useCallback((customMessage?: string) => {
    messageApi.open({
      type: 'warning',
      content: customMessage || 'Warning: Something went wrong',
    });
  }, [messageApi]);

  const notify = useCallback(
    (result: { code: string; message?: string }, options: NotificationOptions = {}) => {
      const { successMessage, errorMessage, warningMessage } = options;

      if (result.code === '0') {
        notifySuccess(successMessage);
      } else if (result.message?.includes('unauthorized')) {
        notifyWarning(warningMessage || 'UnAuthorized');
      } else {
        notifyError(errorMessage || result.message || 'Operation failed');
      }
    },
    [notifySuccess, notifyError, notifyWarning]
  );

  

  return { notify, notifySuccess, notifyError, notifyWarning, contextHolder };
};

export default useNotification;