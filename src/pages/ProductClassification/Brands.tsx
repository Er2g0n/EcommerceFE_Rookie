import { useState } from 'react';
import { Card, Col, Row, Button, ConfigProvider, Modal, Form, Input, message } from 'antd';
import ListBrand from '../ProductClassification/Components/ListBrand.Component';
import { PlusOutlined } from '@ant-design/icons';
import { useButtonStyles } from '../../../src/hooks/useButtonStyles';
import { saveBrandByDapper } from '../../services/ProductClassification/Brand.Service/brandService';
import { Brand } from '../../types/ProductClassification/Brand/Brand';

type FieldType = {
  brandCode: string;
  brandName: string;
};

const Brands: React.FC = () => {
  const { styles } = useButtonStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);

  const handleAddBrand = () => {
    setIsEditing(false);
    setCurrentBrand(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setIsEditing(true);
    setCurrentBrand(brand);
    form.setFieldsValue({
      brandCode: brand.brandCode,
      brandName: brand.brandName,
      description: brand.description,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentBrand(null);
    form.resetFields();
  };

  const onFinish = async (values: FieldType) => {
    try {
      const brand: Brand = {
        id: isEditing && currentBrand ? currentBrand.id : undefined,
        brandCode: isEditing ? values.brandCode : '', // Send empty string for new brand
        brandName: values.brandName,
        createdBy: 'admin', // Adjust based on your auth system
        updatedBy: isEditing ? 'admin' : undefined,
      };

      const result = await saveBrandByDapper(brand);

      if (result.code === "0") {
        message.success(isEditing ? 'Brand updated successfully' : 'Brand added successfully');
        setRefreshTrigger((prev) => prev + 1);
        setIsModalOpen(false);
        setCurrentBrand(null);
        form.resetFields();
      } else {
        message.error(`Failed to ${isEditing ? 'update' : 'add'} brand: ${result.message}`);
      }
    } catch (error) {
      message.error('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };



  
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };
  
  

  

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card
            title="Brands Management"
            extra={
              <ConfigProvider
                button={{
                  className: styles.gradientButtonGreen,
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddBrand}
                >
                  Add Brand
                </Button>
              </ConfigProvider>
            }
            variant="borderless"
          >
            <ListBrand refreshTrigger={refreshTrigger} onEdit={handleEditBrand} />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? "Edit Brand" : "Add New Brand"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="brand_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {isEditing && (
            <Form.Item<FieldType>
              label="Brand Code"
              name="brandCode"
              rules={[{ required: true, message: 'Brand code is required!' }]}
            >
              <Input readOnly />
            </Form.Item>
          )}

          <Form.Item<FieldType>
            label="Brand Name"
            name="brandName"
            rules={[{ required: true, message: 'Please input the brand name!' }]}
          >
            <Input placeholder="e.g., Nike" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button danger style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Brands;