import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Home } from './pages/Home';

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error) {
    return error;
  }

  return 'Export Failed';
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
