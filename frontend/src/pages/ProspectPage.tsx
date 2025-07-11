import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Tag, Spin, Result, message, Modal, Row, Col, Typography, Space } from 'antd';
import { ArrowLeftOutlined, SwapOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, PhoneOutlined, HomeOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prospectApi } from '../services/api';
import type { AxiosError } from 'axios';

const { Title, Text } = Typography;

const ProspectPage: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: status, isLoading, error } = useQuery({
    queryKey: ['prospect-status', key],
    queryFn: () => prospectApi.getStatus(key!),
    enabled: !!key,
  });

  const transferMutation = useMutation({
    mutationFn: () => prospectApi.transfer(key!),
    onSuccess: (result) => {
      if (result.transferred) {
        message.success('Prospect transferred successfully!');
        queryClient.invalidateQueries({ queryKey: ['prospect-status', key] });
      } else {
        message.error(result.message || 'Transfer failed');
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errMsg = error.response?.data?.message ?? 'An error occurred during transfer';
      message.error(errMsg);
    },
  });

  const [isConfirmVisible, setConfirmVisible] = React.useState(false);

  const handleTransfer = () => {
    setConfirmVisible(true);
  };

  const handleConfirmOk = () => {
    setConfirmVisible(false);
    transferMutation.mutate();
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" style={{ color: '#5d4037' }} />
        <Text style={{ marginTop: 16, color: '#8d5a49' }}>Loading prospect information...</Text>
      </div>
    );
  }

  if (error || !status) {
    return (
      <Result
        status="error"
        title="Error Loading Prospect"
        subTitle="Unable to load prospect information. Please try again."
        extra={
          <Button onClick={() => navigate('/')}>
            Back to Search
          </Button>
        }
      />
    );
  }

  const { existsInTfclive, existsInSr, data } = status;

  if (!existsInTfclive) {
    return (
      <Result
        status="warning"
        title="Prospect Not Found"
        subTitle={`Prospect ${key} was not found in the BME database.`}
        extra={
          <Button onClick={() => navigate('/')}>
            Back to Search
          </Button>
        }
      />
    );
  }

  return (
    <>
    <div className="prospect-page">
      {/* Header Section */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          size="large"
          style={{ 
            marginBottom: 16,
            borderColor: '#5d4037',
            color: '#5d4037'
          }}
          className="hover:bg-brown-50"
        >
          Back to Search
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <Title level={1} style={{ color: '#5d4037', margin: 0 }}>
            Prospect Details: {key}
          </Title>
          {!existsInSr && (
            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={handleTransfer}
              loading={transferMutation.isPending}
              size="large"
              style={{ 
                backgroundColor: '#5d4037',
                borderColor: '#5d4037',
                height: 'auto',
                padding: '12px 24px'
              }}
            >
              Transfer to SR Database
            </Button>
          )}
        </div>
      </div>

      {/* Status Dashboard */}
      <div className="mb-8">
        <Card 
          className="prospect-card"
          style={{ 
            borderRadius: '12px',
            border: '1px solid #ead9d0',
            backgroundColor: '#faf7f5'
          }}
        >
          <Title level={3} style={{ color: '#5d4037', marginBottom: 24 }}>
            Database Status
          </Title>
          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <div className="text-center p-6 rounded-lg" style={{ 
                backgroundColor: existsInTfclive ? '#dcfce7' : '#fee2e2',
                border: `2px solid ${existsInTfclive ? '#bbf7d0' : '#fecaca'}`
              }}>
                <div className="mb-4">
                  {existsInTfclive ? 
                    <CheckCircleOutlined style={{ fontSize: '2rem', color: '#15803d' }} /> :
                    <CloseCircleOutlined style={{ fontSize: '2rem', color: '#dc2626' }} />
                  }
                </div>
                <Title level={4} style={{ color: existsInTfclive ? '#15803d' : '#dc2626' }}>
                  BME Database
                </Title>
                <Text style={{ color: existsInTfclive ? '#15803d' : '#dc2626' }}>
                  {existsInTfclive ? 'Found' : 'Not Found'}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="text-center p-6 rounded-lg" style={{ 
                backgroundColor: existsInSr ? '#dcfce7' : '#fef3c7',
                border: `2px solid ${existsInSr ? '#bbf7d0' : '#fde68a'}`
              }}>
                <div className="mb-4">
                  {existsInSr ? 
                    <CheckCircleOutlined style={{ fontSize: '2rem', color: '#15803d' }} /> :
                    <CloseCircleOutlined style={{ fontSize: '2rem', color: '#d97706' }} />
                  }
                </div>
                <Title level={4} style={{ color: existsInSr ? '#15803d' : '#d97706' }}>
                  SR Database
                </Title>
                <Text style={{ color: existsInSr ? '#15803d' : '#d97706' }}>
                  {existsInSr ? 'Already Transferred' : 'Not Transferred'}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Prospect Information */}
      {data && (
        <Row gutter={[24, 24]}>
          {/* Basic Information */}
          <Col xs={24} lg={12}>
            <Card 
              className="prospect-card h-full"
              style={{ 
                borderRadius: '12px',
                border: '1px solid #ead9d0'
              }}
              title={
                <div className="flex items-center">
                  <UserOutlined style={{ marginRight: 8, color: '#5d4037' }} />
                  <span style={{ color: '#5d4037' }}>Basic Information</span>
                </div>
              }
            >
              <Space direction="vertical" size={16} className="w-full">
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Prospect Key:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.prospect_Key}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Customer Name:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.customer_Name || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Contact Name:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.contact_Name || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Customer Status:</Text>
                  <br />
                  <Tag color={data.custStatus ? 'success' : 'default'} style={{ fontSize: '0.875rem' }}>
                    {data.custStatus || 'Unknown'}
                  </Tag>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={12}>
            <Card 
              className="prospect-card h-full"
              style={{ 
                borderRadius: '12px',
                border: '1px solid #ead9d0'
              }}
              title={
                <div className="flex items-center">
                  <PhoneOutlined style={{ marginRight: 8, color: '#5d4037' }} />
                  <span style={{ color: '#5d4037' }}>Contact Information</span>
                </div>
              }
            >
              <Space direction="vertical" size={16} className="w-full">
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Email:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.email || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Phone 1:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.phone_1 || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Phone 2:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.phone_2 || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Tax ID:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.tax_Id || '-'}</Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Address Information */}
          <Col xs={24} lg={12}>
            <Card 
              className="prospect-card h-full"
              style={{ 
                borderRadius: '12px',
                border: '1px solid #ead9d0'
              }}
              title={
                <div className="flex items-center">
                  <HomeOutlined style={{ marginRight: 8, color: '#5d4037' }} />
                  <span style={{ color: '#5d4037' }}>Address Information</span>
                </div>
              }
            >
              <Space direction="vertical" size={16} className="w-full">
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Address:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>
                    {[data.address_1, data.address_2, data.address_3].filter(Boolean).join(', ') || '-'}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>City:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.city || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>State:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.state || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Zip Code:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.zip_Code || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Country:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.country || '-'}</Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Financial Information */}
          <Col xs={24} lg={12}>
            <Card 
              className="prospect-card h-full"
              style={{ 
                borderRadius: '12px',
                border: '1px solid #ead9d0'
              }}
              title={
                <div className="flex items-center">
                  <DollarOutlined style={{ marginRight: 8, color: '#5d4037' }} />
                  <span style={{ color: '#5d4037' }}>Financial Information</span>
                </div>
              }
            >
              <Space direction="vertical" size={16} className="w-full">
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Credit Limit:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037', fontWeight: 600 }}>
                    {data.cr_Limit_Amt ? `$${data.cr_Limit_Amt.toLocaleString()}` : '-'}
                  </Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Terms Code:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.terms_Code || '-'}</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#8d5a49' }}>Customer Class:</Text>
                  <br />
                  <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.cust_Class_Ky || '-'}</Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Business Information */}
          <Col xs={24}>
            <Card 
              className="prospect-card"
              style={{ 
                borderRadius: '12px',
                border: '1px solid #ead9d0'
              }}
              title={
                <div className="flex items-center">
                  <FileTextOutlined style={{ marginRight: 8, color: '#5d4037' }} />
                  <span style={{ color: '#5d4037' }}>Business Information</span>
                </div>
              }
            >
              <Row gutter={[32, 16]}>
                <Col xs={24} md={8}>
                  <div>
                    <Text strong style={{ color: '#8d5a49' }}>Territory:</Text>
                    <br />
                    <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.territory_Ky || '-'}</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text strong style={{ color: '#8d5a49' }}>Salesperson:</Text>
                    <br />
                    <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.salespersn_Ky || '-'}</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text strong style={{ color: '#8d5a49' }}>Location:</Text>
                    <br />
                    <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.location || '-'}</Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text strong style={{ color: '#8d5a49' }}>Record Date:</Text>
                    <br />
                    <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>
                      {data.recDate ? new Date(data.recDate).toLocaleDateString() : '-'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text strong style={{ color: '#8d5a49' }}>Record User:</Text>
                    <br />
                    <Text style={{ fontSize: '1.1rem', color: '#5d4037' }}>{data.recUserID || '-'}</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Success Message */}
      {existsInSr && (
        <div className="mt-8">
          <Card 
            className="prospect-card"
            style={{ 
              borderRadius: '12px',
              border: '2px solid #bbf7d0',
              backgroundColor: '#dcfce7'
            }}
          >
            <div className="text-center">
              <CheckCircleOutlined style={{ fontSize: '2rem', color: '#15803d', marginBottom: 16 }} />
              <Title level={3} style={{ color: '#15803d', marginBottom: 8 }}>
                Transfer Complete
              </Title>
              <Text style={{ color: '#15803d', fontSize: '1.1rem' }}>
                This prospect has been successfully transferred to the SR database
              </Text>
            </div>
          </Card>
        </div>
      )}
    </div>
    {/* Confirmation Modal */}
    <Modal
      open={isConfirmVisible}
      title="Confirm Transfer"
      onOk={handleConfirmOk}
      onCancel={handleConfirmCancel}
      okText="Yes, Transfer"
      cancelText="Cancel"
      confirmLoading={transferMutation.isPending}
    >
      <p>{`Are you sure you want to transfer prospect ${key} from BME to SR database?`}</p>
    </Modal>
    </>
    );
};

export default ProspectPage; 