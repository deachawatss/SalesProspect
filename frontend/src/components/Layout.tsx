import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout as AntLayout, Typography } from 'antd';

const { Header, Content } = AntLayout;
const { Text } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="prospect-header" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#5d4037',
        boxShadow: '0 2px 8px rgba(93, 64, 55, 0.15)',
        borderBottom: '1px solid rgba(93, 64, 55, 0.1)',
        height: 'auto',
        padding: '12px 24px'
      }}>
        <div className="prospect-container">
          <div className="prospect-header-content">
            <div className="prospect-header-brand" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px'
            }} onClick={() => navigate('/')}>
              <img 
                src="https://img2.pic.in.th/pic/logo14821dedd19c2ad18.png" 
                alt="TFC Logo" 
                className="h-3 w-auto inline-block align-middle md:h-4"
                style={{ 
                  height: '72px',
                  width: 'auto',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text 
                  strong 
                  style={{ 
                    color: 'white', 
                    fontSize: 18, 
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    lineHeight: '1.2',
                    userSelect: 'none'
                  }}
                >
                  NWFTH - Prospect Transfer
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Header>
      
      <Content className="prospect-main" style={{ 
        padding: '32px 24px',
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div className="prospect-container">
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout; 