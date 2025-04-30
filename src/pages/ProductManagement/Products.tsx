import { useState, useEffect, useRef } from "react";
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
  Typography,
  TabsProps,
  Tabs,
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
  // Reference to the update function in ListProduct
  const listProductRef = useRef<(productCode: string, images: ProductImage[]) => void>(() => {});

  const handleImagesUpdated = (productCode: string, images: ProductImage[]) => {
    if (listProductRef.current) {
      listProductRef.current(productCode, images);
    }
  };

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

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    form.resetFields();
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

      const result = await saveProductByDapper(product);

      if (result.code === "0") {
        message.success(
          isEditing
            ? "Product updated successfully"
            : "Product added successfully"
        );
        setRefreshTrigger((prev) => prev + 1);
        setIsModalOpen(false);
        setCurrentProduct(null);
        form.resetFields();
      } else {
        message.error(
          `Failed to ${isEditing ? "update" : "add"} product: ${result.message}`
        );
      }
    } catch (error) {
      message.error(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any) => {
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button danger style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
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
          onImagesUpdated={(productCode, images) => handleImagesUpdated(productCode, images)}
        />
      ),
      disabled: (currentProduct?.productCode != "" && currentProduct?.productCode != null && currentProduct?.productCode != undefined) ? false : true,
    },
    {
      key: "3",
      label: "Product Pricing",
      children: "Content of Tab Pane 3",
      disabled: (currentProduct?.productCode != "" && currentProduct?.productCode != null && currentProduct?.productCode != undefined) ? false : true,
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Card
            title="Products Management"
            extra={
              <ConfigProvider
                button={{ className: styles.gradientButtonGreen }}
              >
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
            <ListProduct
              refreshTrigger={refreshTrigger}
              onEdit={handleEditProduct}
              onImagesUpdated={(productCode, images) => handleImagesUpdated(productCode, images)}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={isEditing ? "Edit Product" : "Add New Product"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
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
          <Tabs defaultActiveKey="1" items={items} />;
        </Form>
      </Modal>
    </>
  );
};

export default Products;