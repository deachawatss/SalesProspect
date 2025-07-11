import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProspectPage from './pages/ProspectPage';
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            // BandCI Brown Primary Colors
            colorPrimary: '#5d4037',
            colorPrimaryBg: '#f5ede8',
            colorPrimaryBgHover: '#ead9d0',
            colorPrimaryBorder: '#dcc0b0',
            colorPrimaryBorderHover: '#c89e88',
            colorPrimaryHover: '#744c3f',
            colorPrimaryActive: '#8d5a49',
            colorPrimaryTextHover: '#744c3f',
            colorPrimaryText: '#5d4037',
            colorPrimaryTextActive: '#8d5a49',
            
            // Success Colors
            colorSuccess: '#22c55e',
            colorSuccessBg: '#f0fdf4',
            colorSuccessBorder: '#bbf7d0',
            
            // Warning Colors
            colorWarning: '#f59e0b',
            colorWarningBg: '#fffbeb',
            colorWarningBorder: '#fde68a',
            
            // Error Colors
            colorError: '#ef4444',
            colorErrorBg: '#fef2f2',
            colorErrorBorder: '#fecaca',
            
            // Info Colors
            colorInfo: '#3b82f6',
            colorInfoBg: '#eff6ff',
            colorInfoBorder: '#bfdbfe',
            
            // Text Colors
            colorText: '#3e2723',
            colorTextSecondary: '#5d4037',
            colorTextTertiary: '#8d5a49',
            colorTextQuaternary: '#a66b56',
            
            // Background Colors
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            colorBgLayout: '#f5f5f5',
            colorBgSpotlight: '#faf7f5',
            colorBgMask: 'rgba(93, 64, 55, 0.45)',
            
            // Border Colors
            colorBorder: '#ead9d0',
            colorBorderSecondary: '#f5ede8',
            
            // Component specific
            colorFillAlter: '#faf7f5',
            colorFillContent: '#f5ede8',
            colorFillContentHover: '#ead9d0',
            colorFillSecondary: '#f8f4f1',
            colorFillTertiary: '#f5ede8',
            colorFillQuaternary: '#faf7f5',
            
            // Border Radius
            borderRadius: 6,
            borderRadiusLG: 8,
            borderRadiusSM: 4,
            borderRadiusXS: 2,
            
            // Shadows
            boxShadow: '0 4px 6px -1px rgba(93, 64, 55, 0.1), 0 2px 4px -1px rgba(93, 64, 55, 0.06)',
            boxShadowSecondary: '0 1px 2px 0 rgba(93, 64, 55, 0.05)',
            
            // Font
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: 14,
            fontSizeHeading1: 38,
            fontSizeHeading2: 30,
            fontSizeHeading3: 24,
            fontSizeHeading4: 20,
            fontSizeHeading5: 16,
            fontSizeLG: 16,
            fontSizeSM: 12,
            fontSizeXL: 20,
            
            // Line Height
            lineHeight: 1.5,
            lineHeightHeading1: 1.21,
            lineHeightHeading2: 1.27,
            lineHeightHeading3: 1.33,
            lineHeightHeading4: 1.4,
            lineHeightHeading5: 1.5,
            lineHeightLG: 1.5,
            lineHeightSM: 1.66,
            
            // Motion
            motionDurationFast: '0.1s',
            motionDurationMid: '0.2s',
            motionDurationSlow: '0.3s',
            
            // Size
            sizeStep: 4,
            sizeUnit: 4,
            
            // Control Heights
            controlHeight: 32,
            controlHeightLG: 40,
            controlHeightSM: 24,
            controlHeightXS: 16,
            
            // Padding
            paddingContentHorizontal: 16,
            paddingContentVertical: 8,
            paddingXS: 8,
            paddingSM: 12,
            padding: 16,
            paddingLG: 24,
            paddingXL: 32,
            
            // Margin
            marginXS: 8,
            marginSM: 12,
            margin: 16,
            marginLG: 24,
            marginXL: 32,
            marginXXL: 48,
            
            // Z-Index
            zIndexBase: 0,
            zIndexPopupBase: 1000,
          },
          components: {
            Layout: {
              headerBg: '#5d4037',
              headerColor: '#ffffff',
              headerHeight: 64,
              headerPadding: '0 24px',
              bodyBg: '#f5f5f5',
              siderBg: '#ffffff',
            },
            Button: {
              colorPrimary: '#5d4037',
              colorPrimaryHover: '#744c3f',
              colorPrimaryActive: '#8d5a49',
              primaryShadow: '0 2px 0 rgba(93, 64, 55, 0.1)',
            },
            Input: {
              colorBorder: '#ead9d0',
              activeBorderColor: '#8d5a49',
              hoverBorderColor: '#dcc0b0',
            },
            Select: {
              colorBorder: '#ead9d0',
              activeBorderColor: '#8d5a49',
              hoverBorderColor: '#dcc0b0',
            },
            Typography: {
              colorText: '#3e2723',
              colorTextSecondary: '#5d4037',
              colorTextTertiary: '#8d5a49',
              colorTextQuaternary: '#a66b56',
            },
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="prospect/:key" element={<ProspectPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
