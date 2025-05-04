import { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  ConfigProvider,
  Modal,
  Form,
  Input,
  Select,
  message,
  TabsProps,
  Tabs,
  DatePicker,
  InputNumber,
} from "antd";
import { ListProduct } from "../../pages/ProductManagement/Components/ListProduct.Component";
import { PlusOutlined } from "@ant-design/icons";
import { useButtonStyles } from "../../../src/hooks/useButtonStyles";
import { saveProductByDapper } from "../../services/ProductManagement/Product.Service/productService";
import { Product } from "../../types/ProductManagement/Product/Product";
import { getAllBrands } from "../../services/ProductClassification/Brand.Service/brandService";
import { getAllProductCategories } from "../../../src/services/ProductClassification/Category.Service/productCategoryService";
import { getAllUnitsOfMeasure } from "../../services/ProductClassification/UnitOfMeasure.Service/unitOfMeasureService";
import { ProductImage } from "../../types/ProductManagement/ProductImage/ProductImage";
import ProductImageUpload from './Components/ProductImageUpload';
import { createPrice,Price } from "../../services/ProductManagement/Price.Service/priceService";
import moment from "moment";

const { Option } = Select;

type FieldType = {
  productCode: string;
  productName: string;
  description?: string;
  categoryCode?: string;
  brandCode?: string;
  brandName?: string;
  uoMCode?: string;
  image?: ProductImage[];
  priceCost?: number;
  priceSale?: number;
  priceVAT?: number;
  totalAmount?: number;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  applyDate?: moment.Moment;
};

const Products: React.FC = () => {
  const { styles } = useButtonStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [categories, setCategories] = useState<
    { categoryCode: string; categoryName: string }[]
  >([]);
  const [brands, setBrands] = useState<
    { brandCode: string; brandName: string }[]
  >([]);
  const [units, setUnits] = useState<{ uoMCode: string; uoMName: string }[]>([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const catResult = await getAllProductCategories();
        const brandResult = await getAllBrands();
        const unitResult = await getAllUnitsOfMeasure({ cache: false });

        setCategories(catResult.data ?? []);
        setBrands(brandResult.data ?? []);
        setUnits(unitResult.data ?? []);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };
    loadDropdownData();
  }, []);


  // useEffect(() => {
  //   const fetchPrice = async () => {
  //     if (isEditing && currentProduct?.productCode) {
  //       try {
  //         const priceResult = await getPriceByProductCode(currentProduct.productCode);
  //         if (priceResult.code === "0" && priceResult.data) {
  //           const price = priceResult.data;
  //           form.setFieldsValue({
  //             priceCost: price.priceCost,
  //             priceSale: price.priceSale,
  //             priceVAT: price.priceVAT,
  //             totalAmount: price.totalAmount,
  //             startDate: price.startDate ? moment(price.startDate) : null,
  //             endDate: price.endDate ? moment(price.endDate) : null,
  //             applyDate: price.applyDate ? moment(price.applyDate) : null,
  //           });
  //           setCurrentProduct((prev) => prev ? { ...prev, price } : null);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching price:", error);
  //       }
  //     } else {
  //       // Clear price fields when not editing
  //       form.setFieldsValue({
  //         priceCost: undefined,
  //         priceSale: undefined,
  //         priceVAT: undefined,
  //         totalAmount: undefined,
  //         startDate: null,
  //         endDate: null,
  //         applyDate: null,
  //       });
  //     }
  //   };

  //   fetchPrice();
  // }, [isEditing, currentProduct, form]);

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    form.resetFields();
    // Explicitly clear price fields when adding a new product
    form.setFieldsValue({
      priceCost: undefined,
      priceSale: undefined,
      priceVAT: undefined,
      totalAmount: undefined,
      startDate: null,
      endDate: null,
      applyDate: null,
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    form.setFieldsValue({
      productCode: product.productCode,
      productName: product.productName,
      description: product.description,
      categoryCode: product.categoryCode,
      brandCode: product.brandCode,
      uoMCode: product.uoMCode,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    form.resetFields();
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const onFinish = async (values: FieldType) => {
    try {
      const product: Product = {
        id: isEditing && currentProduct ? currentProduct.id : undefined,
        productCode: isEditing ? values.productCode : "",
        productName: values.productName,
        description: values.description,
        categoryCode: values.categoryCode,
        brandCode: values.brandCode,
        uoMCode: values.uoMCode,
        createdBy: "admin",
        updatedBy: isEditing ? "admin" : undefined,
      };

      const productResult = await saveProductByDapper(product);

      if (productResult.code === "0") {
        const savedProduct = productResult.data;
        message.success(
          isEditing
            ? "Product updated successfully"
            : "Product added successfully"
        );

        if (
          values.priceCost ||
          values.priceSale ||
          values.priceVAT ||
          values.totalAmount ||
          values.startDate ||
          values.endDate ||
          values.applyDate
        ) {
          const price: Price = {
            productCode: savedProduct?.productCode || values.productCode,
            priceCost: values.priceCost,
            priceSale: values.priceSale,
            priceVAT: values.priceVAT,
            totalAmount: values.totalAmount,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : undefined,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
            applyDate: values.applyDate ? values.applyDate.format("YYYY-MM-DD") : undefined,
            createdBy: "admin",
            updatedBy: isEditing ? "admin" : undefined,
            priceCode: ""
          };

          const priceResult = await createPrice(price);
          if (priceResult.code === "0") {
            message.success("Price saved successfully");
          } else {
            message.error(`Failed to save price: ${priceResult.message}`);
          }
        }

        setRefreshTrigger((prev) => prev + 1);
        setIsModalOpen(false);
        setCurrentProduct(null);
        form.resetFields();
      } else {
        message.error(
          `Failed to ${isEditing ? "update" : "add"} product: ${productResult.message}`
        );
      }
    } catch (error) {
      message.error(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Product Information",
      children: (
        <>
          {isEditing && (
            <Form.Item<FieldType>
              label="Product Code"
              name="productCode"
              rules={[{ required: true, message: "Product code is required!" }]}
            >
              <Input readOnly />
            </Form.Item>
          )}
          <Form.Item<FieldType>
            label="Product Name"
            name="productName"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input placeholder="e.g., Samsung Galaxy S21" />
          </Form.Item>
          <Form.Item<FieldType> label="Category" name="categoryCode">
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Option key={cat.categoryCode} value={cat.categoryCode}>
                  {cat.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<FieldType> label="Brand" name="brandCode">
            <Select placeholder="Select brand">
              {brands.map((brand) => (
                <Option key={brand.brandCode} value={brand.brandCode}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<FieldType> label="UoM" name="uoMCode">
            <Select placeholder="Select unit of measure">
              {units.map((unit) => (
                <Option key={unit.uoMCode} value={unit.uoMCode}>
                  {unit.uoMName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<FieldType> label="Description" name="description">
            <Input.TextArea placeholder="Optional description" />
          </Form.Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Product Images",
      children: (
        <ProductImageUpload
          currentProduct={currentProduct}
          onUploadSuccess={(images) => {
            if (currentProduct) {
              setCurrentProduct({
                ...currentProduct,
                images: images,
              });
            }
          }}
          onRefresh={handleRefresh}
        />
      ),
      disabled: !(
        currentProduct?.productCode &&
        currentProduct?.productCode !== "" &&
        currentProduct?.productCode !== null &&
        currentProduct?.productCode !== undefined
      ),
    },
    {
      key: "3",
      label: "Product Pricing",
      children: (
        <>
          <Form.Item<FieldType>
            label="Price Cost"
            name="priceCost"
            rules={[{ type: "number", min: 0, message: "Price Cost must be a positive number!" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter cost price" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Price Sale"
            name="priceSale"
            rules={[{ type: "number", min: 0, message: "Price Sale must be a positive number!" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter sale price" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Price VAT"
            name="priceVAT"
            rules={[{ type: "number", min: 0, message: "Price VAT must be a positive number!" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter VAT price" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Total Amount"
            name="totalAmount"
            rules={[{ type: "number", min: 0, message: "Total Amount must be a positive number!" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter total amount" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Start Date"
            name="startDate"
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
          </Form.Item>
          <Form.Item<FieldType>
            label="End Date"
            name="endDate"
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Apply Date"
            name="applyDate"
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select date" />
          </Form.Item>
        </>
      ),
      disabled: !(
        currentProduct?.productCode &&
        currentProduct?.productCode !== "" &&
        currentProduct?.productCode !== null &&
        currentProduct?.productCode !== undefined
      ),
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card
            title="Products Management"
            extra={
              <ConfigProvider button={{ className: styles.gradientButtonGreen }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </ConfigProvider>
            }
            variant="borderless"
          >
            <ListProduct refreshTrigger={refreshTrigger} onEdit={handleEditProduct} />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? "Edit Product" : "Add New Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" danger onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {isEditing ? "Update Product" : "Add Product"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="product_form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Tabs defaultActiveKey="1" items={items} />
        </Form>
      </Modal>
    </>
  );
};

export default Products;