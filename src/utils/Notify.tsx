import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', options: any = {}) => {
  const defaultOptions = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,

  };

  toast[type](message, { ...defaultOptions, ...options });
};

export default notify;
