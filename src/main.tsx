import { createRoot } from 'react-dom/client';

import '../public/css/fonts.css';
import '../public/css/index.css';
import App from './App';
import { ConfigProvider, Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';

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
    <Layout
      style={{ textAlign: 'center', minHeight: '100vh', display: 'flex' }}
    >
      <App />
      <Footer>
        <Paragraph style={{ fontSize: '0.9rem' }}>
          &copy; 2025 "Найди пару". Все права защищены.
        </Paragraph>
      </Footer>
    </Layout>
  </ConfigProvider>
);
