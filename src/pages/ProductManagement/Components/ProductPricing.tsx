import { useState, useEffect } from "react";
import { Form, InputNumber, DatePicker, Button, message, Space } from "antd";
import moment from "moment";
import { Price } from "../../../types/ProductManagement/Price/Price";
import { Product } from "../../../types/ProductManagement/Product/Product";
import {  getPriceByProductCode, deletePrice, createPrice } from "../../../services/ProductManagement/Price.Service/priceService";

interface ProductPricingProps {
  currentProduct: Product | null;
  onRefresh: () => void;
}
interface PriceFormValues {
  priceCost: number;
  priceSale: number;
  priceVAT: number;
  totalAmount: number;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  applyDate?: moment.Moment;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ currentProduct, onRefresh }) => {
  const [form] = Form.useForm();
  const [price, setPrice] = useState<Price | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (currentProduct?.productCode) {
        const result = await getPriceByProductCode(currentProduct.productCode);
        if (result.code === "0" && result.data) {
          setPrice(result.data);
          form.setFieldsValue({
            priceCost: result.data.priceCost,
            priceSale: result.data.priceSale,
            priceVAT: result.data.priceVAT,
            totalAmount: result.data.totalAmount,
            startDate: result.data.startDate ? moment(result.data.startDate) : null,
            endDate: result.data.endDate ? moment(result.data.endDate) : null,
            applyDate: result.data.applyDate ? moment(result.data.applyDate) : null,
          });
        } else {
          setPrice(null);
          form.resetFields();
        }
      }
    };
    fetchPrice();
  }, [currentProduct, form]);

  const onFinish = async (values: PriceFormValues) => {
    if (!currentProduct?.productCode) {
      message.error("Product code is missing");
      return;
    }

    const priceData: Price = {
      id: price?.id,
      priceCode: price?.priceCode || "",
      productCode: currentProduct.productCode,
      priceCost: values.priceCost,
      priceSale: values.priceSale,
      priceVAT: values.priceVAT,
      totalAmount: values.totalAmount,
      startDate: values.startDate ? values.startDate.toISOString() : undefined,
      endDate: values.endDate ? values.endDate.toISOString() : undefined,
      applyDate: values.applyDate ? values.applyDate.toISOString() : undefined,
      createdBy: price?.createdBy || "admin",
      updatedBy: price ? "admin" : undefined,
    };

    const result = await createPrice(priceData);
    if (result.code === "0") {
      message.success("Price updated successfully");
      setPrice(result.data);
      onRefresh();
    } else {
      message.error(`Failed to update price: ${result.message}`);
    }
  };

  const handleDelete = async () => {
    if (!price?.priceCode) {
      message.error("No price to delete");
      return;
    }

    const result = await deletePrice(price.priceCode);
    if (result.code === "0") {
      message.success("Price deleted successfully");
      setPrice(null);
      form.resetFields();
      onRefresh();
    } else {
      message.error(`Failed to delete price: ${result.message}`);
    }
  };

  const handleCreateNewPrice = () => {
    setPrice(null); // Reset trạng thái price để biểu thị giá mới
    form.resetFields(); // Reset form để người dùng nhập thông tin giá mới
  };

  return (
    <Form
      form={form}
      name="price_form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item label="Price Cost" name="priceCost">
        <InputNumber min={0} placeholder="Enter cost price" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Price Sale" name="priceSale">
        <InputNumber min={0} placeholder="Enter sale price" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Price VAT" name="priceVAT">
        <InputNumber min={0} placeholder="Enter VAT amount" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Total Amount" name="totalAmount">
        <InputNumber min={0} placeholder="Enter total amount" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Start Date" name="startDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="End Date" name="endDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Apply Date" name="applyDate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {price && (
            <Button danger onClick={handleDelete}>
              Delete Price
            </Button>
          )}
          {!price && (
            <Button type="primary" onClick={handleCreateNewPrice}>
              Tạo giá mới
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductPricing;