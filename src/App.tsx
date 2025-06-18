import { RouterProvider } from 'react-router-dom';
import router from './router';

import ToastContainer from './components/toast/ToastContainer';

import './styles/global.css';

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};

export default App;
