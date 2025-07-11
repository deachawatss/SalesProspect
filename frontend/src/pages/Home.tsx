import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProspectSearch from '../components/ProspectSearch';

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-50 to-brown-100">
      {/* Hero Section */}
      <div className="prospect-section">

        {/* Search Section */}
        <div className="my-16">
          <Card 
            className="prospect-card shadow-lg mx-auto"
            style={{ 
              maxWidth: 700,
              borderRadius: '16px',
              border: '1px solid #ead9d0'
            }}
            styles={{ body: { padding: '32px' } }}
          >
            <div className="text-center mb-8">
              <div className="mb-6">
                <SearchOutlined style={{ 
                  fontSize: '3rem', 
                  color: '#5d4037',
                  backgroundColor: '#f5ede8',
                  padding: '16px',
                  borderRadius: '50%',
                  border: '2px solid #ead9d0'
                }} />
              </div>
              <Title level={2} className="prospect-main-title" style={{ color: '#5d4037', marginBottom: '12px' }}>
                Prospect Search
              </Title>
              <Paragraph style={{ color: '#8d5a49', fontSize: '1rem', marginBottom: '24px' }}>
                Search for prospects in BME and manage transfers to SR system
              </Paragraph>
            </div>
            
            <div className="mb-6 flex justify-center">
              <ProspectSearch />
            </div>
            

          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-16 prospect-section-spacing">
          <Card 
            className="prospect-card"
            style={{ 
              borderRadius: '12px',
              border: '1px solid #ead9d0',
              backgroundColor: '#faf7f5'
            }}
            styles={{ body: { padding: '40px 32px' } }}
          >
            <Title level={2} className="prospect-section-title text-center mb-8" style={{ color: '#5d4037' }}>
              How It Works
            </Title>
            
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={6}>
                <div className="how-it-works-step">
                  <div className="number-container">
                    <div className="how-it-works-number" style={{
                      backgroundColor: '#5d4037'
                    }}>
                      1
                    </div>
                  </div>
                  <Title level={4} style={{ color: '#5d4037', marginBottom: '8px' }}>Search</Title>
                  <Text style={{ color: '#8d5a49' }}>
                    Enter prospect key to search BME
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} md={6}>
                <div className="how-it-works-step">
                  <div className="number-container">
                    <div className="how-it-works-number" style={{
                      backgroundColor: '#744c3f'
                    }}>
                      2
                    </div>
                  </div>
                  <Title level={4} style={{ color: '#5d4037', marginBottom: '8px' }}>Review</Title>
                  <Text style={{ color: '#8d5a49' }}>
                    View detailed prospect information and status
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} md={6}>
                <div className="how-it-works-step">
                  <div className="number-container">
                    <div className="how-it-works-number" style={{
                      backgroundColor: '#8d5a49'
                    }}>
                      3
                    </div>
                  </div>
                  <Title level={4} style={{ color: '#5d4037', marginBottom: '8px' }}>Transfer</Title>
                  <Text style={{ color: '#8d5a49' }}>
                    Transfer prospect data to SR reporting system
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} md={6}>
                <div className="how-it-works-step">
                  <div className="number-container">
                    <div className="how-it-works-number" style={{
                      backgroundColor: '#a66b56'
                    }}>
                      4
                    </div>
                  </div>
                  <Title level={4} style={{ color: '#5d4037', marginBottom: '8px' }}>Verify</Title>
                  <Text style={{ color: '#8d5a49' }}>
                    Confirm successful transfer and data integrity
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; 