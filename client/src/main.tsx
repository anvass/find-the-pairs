import { createRoot } from 'react-dom/client';

import '../public/css/fonts.css';
import '../public/css/index.css';
import App from './App';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        colorTextBase: '#222222',
      },

      components: {
        Typography: {
          lineHeight: 1.5,
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
);
