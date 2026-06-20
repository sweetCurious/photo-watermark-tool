import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Home } from './pages/Home';

function getErrorMessage(error: unknown) {
  const messages: Record<string, string> = {
    'Export Failed': '导出失败',
    'Image Load Failed': '图片读取失败',
    'Invalid Logo': '品牌标识无效',
    'Memory Limit Exceeded': '内存不足',
    'Processing Canceled': '已取消处理',
    'Processing Failed': '处理失败',
  };

  if (error instanceof Error && error.message) {
    return messages[error.message] ?? error.message;
  }

  if (typeof error === 'string' && error) {
    return messages[error] ?? error;
  }

  return '导出失败';
}

export function App() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      console.error(event.message, event.error);
      toast.error(getErrorMessage(event.error ?? event.message));
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      console.error(getErrorMessage(event.reason), event.reason);
      toast.error(getErrorMessage(event.reason));
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <>
      <Home />
      <Toaster richColors />
    </>
  );
}
