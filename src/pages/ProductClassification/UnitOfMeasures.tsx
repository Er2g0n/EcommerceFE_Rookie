import { useState } from 'react';
import { Card, Col, Row, Button, ConfigProvider, Modal, Form, Input } from 'antd';
import ListUnitOfMeasure from './Components/ListUnitOfMeasure.Component';
import { PlusOutlined } from '@ant-design/icons';
import { useButtonStyles } from '../../../src/hooks/useButtonStyles';
import { saveUnitOfMeasureByDapper } from '../../services/ProductClassification/UnitOfMeasure.Service/unitOfMeasureService';
import { UnitOfMeasure } from '../../types/ProductClassification/UnitOfMeasure/UnitOfMeasure';
import useNotification from '../../../src/hooks/useNotification'; // Import the new hook

type FieldType = {
  uoMCode: string;
  uoMName: string;
  uoMDescription?: string;
};

const UnitOfMeasures: React.FC = () => {
  const { styles } = useButtonStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<UnitOfMeasure | null>(null);
  const { notify,notifyError, contextHolder } = useNotification(); // Use the notification hook

  const handleAddUnit = () => {
    setIsEditing(false);
    setCurrentUnit(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditUnit = (unit: UnitOfMeasure) => {
    setIsEditing(true);
    setCurrentUnit(unit);
    form.setFieldsValue({
      uoMCode: unit.uoMCode,
      uoMName: unit.uoMName,
      uoMDescription: unit.uoMDescription,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentUnit(null);
    form.resetFields();
  };

  const onFinish = async (values: FieldType) => {
    try {
      const unit: UnitOfMeasure = {
        id: isEditing && currentUnit ? currentUnit.id : undefined,
        uoMCode: isEditing ? values.uoMCode : '', // Send empty string for new unit
        uoMName: values.uoMName,
        uoMDescription: values.uoMDescription || null,
        createdBy: 'admin', // Adjust based on your auth system
        updatedBy: isEditing ? 'admin' : undefined,
      };

      const result = await saveUnitOfMeasureByDapper(unit);

      notify(result, {
        successMessage: isEditing ? 'Unit of measure updated successfully' : 'Unit of measure added successfully',
        errorMessage: `Failed to ${isEditing ? 'update' : 'add'} unit of measure`,
      });

      if (result.code === "0") {
        setRefreshTrigger((prev) => prev + 1);
        setIsModalOpen(false);
        setCurrentUnit(null);
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
            title="Units of Measure Management"
            extra={
              <ConfigProvider
                button={{
                  className: styles.gradientButtonGreen,
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddUnit}
                >
                  Add Unit
                </Button>
              </ConfigProvider>
            }
            variant="borderless"
          >
            <ListUnitOfMeasure refreshTrigger={refreshTrigger} onEdit={handleEditUnit} />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? "Edit Unit of Measure" : "Add New Unit of Measure"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="unit_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {isEditing && (
            <Form.Item<FieldType>
              label="Unit Code"
              name="uoMCode"
              rules={[{ required: true, message: 'Unit code is required!' }]}
            >
              <Input readOnly />
            </Form.Item>
          )}

          <Form.Item<FieldType>
            label="Unit Name"
            name="uoMName"
            rules={[{ required: true, message: 'Please input the unit name!' }]}
          >
            <Input placeholder="e.g., Kilogram" />
          </Form.Item>

          <Form.Item<FieldType>
            label="UoM Description"
            name="uoMDescription"
          >
            <Input.TextArea placeholder="Optional description" />
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

export default UnitOfMeasures;