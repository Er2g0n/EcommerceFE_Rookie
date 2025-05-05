import { useState } from 'react';
import { Card, Col, Row, Button, ConfigProvider, Modal, Form, Input } from 'antd';
import ListCategory from './Components/ListCategory.Component';
import { PlusOutlined } from '@ant-design/icons';
import { useButtonStyles } from '../../../src/hooks/useButtonStyles';
import { saveProductCategoryByDapper } from '../../services/ProductClassification/Category.Service/productCategoryService';
import { ProductCategory } from '../../types/ProductClassification/Category/ProductCategory';
import useNotification from '../../../src/hooks/useNotification'; // Import the new hook

type FieldType = {
  categoryCode: string;
  categoryName: string;
};

const Categories: React.FC = () => {
  const { styles } = useButtonStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const { notify, notifyError, contextHolder } = useNotification(); // Add notifyError to destructuring

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setIsEditing(true);
    setCurrentCategory(category);
    form.setFieldsValue({
      categoryCode: category.categoryCode,
      categoryName: category.categoryName,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    form.resetFields();
  };

  const onFinish = async (values: FieldType) => {
    try {
      const category: ProductCategory = {
        id: isEditing && currentCategory ? currentCategory.id : undefined,
        categoryCode: isEditing ? values.categoryCode : '', // Send empty string for new category
        categoryName: values.categoryName,
        createdBy: 'admin', // Adjust based on your auth system
        updatedBy: isEditing ? 'admin' : undefined,
      };

      const result = await saveProductCategoryByDapper(category);

      notify(result, {
        successMessage: isEditing ? 'Category updated successfully' : 'Category added successfully',
        errorMessage: `Failed to ${isEditing ? 'update' : 'add'} category`,
      });

      if (result.code === "0") {
        setRefreshTrigger((prev) => prev + 1);
        setIsModalOpen(false);
        setCurrentCategory(null);
        form.resetFields();
      }
    } catch (error) {
      notifyError('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder} {/* Add contextHolder to render notifications */}
      <Row gutter={24}>
        <Col span={24}>
          <Card
            title="Categories Management"
            extra={
              <ConfigProvider
                button={{
                  className: styles.gradientButtonGreen,
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddCategory}
                >
                  Add Category
                </Button>
              </ConfigProvider>
            }
            variant="borderless"
          >
            <ListCategory refreshTrigger={refreshTrigger} onEdit={handleEditCategory} />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="category_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {isEditing && (
            <Form.Item<FieldType>
              label="Category Code"
              name="categoryCode"
              rules={[{ required: true, message: 'Category code is required!' }]}
            >
              <Input readOnly />
            </Form.Item>
          )}

          <Form.Item<FieldType>
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input placeholder="e.g., Electronics" />
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

export default Categories;