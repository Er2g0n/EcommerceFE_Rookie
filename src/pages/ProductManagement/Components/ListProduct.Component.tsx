import { useEffect, useState } from "react";
import { TableColumnsType, Table, TableProps, Button, Space, ConfigProvider, Popconfirm, Image } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useButtonStyles } from "../../../hooks/useButtonStyles";
import { getAllProducts, deleteProductByDapper } from "../../../services/ProductManagement/Product.Service/productService";
import { Product } from "../../../types/ProductManagement/Product/Product";
import { getAllBrands } from "../../../services/ProductClassification/Brand.Service/brandService";
import { getAllProductCategories } from "../../../services/ProductClassification/Category.Service/productCategoryService";
import { getAllUnitsOfMeasure } from "../../../services/ProductClassification/UnitOfMeasure.Service/unitOfMeasureService";

interface ListProductProps {
  refreshTrigger: number;
  onEdit: (product: Product) => void;
}

const ListProduct: React.FC<ListProductProps> = ({ refreshTrigger, onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { styles } = useButtonStyles();
  const [brands, setBrands] = useState<{ brandCode: string; brandName: string }[]>([]);
  const [categories, setCategories] = useState<{ categoryCode: string; categoryName: string }[]>([]);
  const [uoMs, setUoMs] = useState<{ uoMCode: string; uoMName: string }[]>([]);


  const handleDelete = async (record: Product) => {
    try {
      if (!record.productCode) {
        console.error("Missing productCode for delete");
        return;
      }

      const result = await deleteProductByDapper(record.productCode);

      if (result.code === "0") {
        setProducts((prev) => prev.filter((p) => p.productCode !== record.productCode));
        console.log(`Deleted product: ${record.productCode}`);
      } else {
        console.error(`Delete failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const columns: TableColumnsType<Product> = [
    {
      title: "Product Code",
      dataIndex: "productCode",
      width: "10%",
      filters: products.map((product) => ({
        text: product.productCode,
        value: product.productCode,
      })),
      onFilter: (value, record) => record.productCode === value,
    },
    {
      title: "Image",
      dataIndex: "productImageUrl",
      width: "20%",
      render: (_, record) => (
        <Image
          width={120}
          // src={record.productImageUrl || "https://via.placeholder.com/120x120.png?text=No+Image"}
          alt={record.productName}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      width: "20%",
      filters: products.map((product) => ({
        text: product.productName,
        value: product.productName,
      })),
      onFilter: (value, record) => record.productName === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "20%",
      filters: products.map((product) => ({
        text: product.productName,
        value: product.productName,
      })),
      onFilter: (value, record) => record.productName === value,
    },
    {
      title: "Category",
      dataIndex: "categoryCode",
      width: "10%",
      render: (categoryCode: string) => {
        const category = categories.find((b) => b.categoryCode === categoryCode);
        return category ? category.categoryName : categoryCode;
      },
    },
    {
      title: "Brand",
      dataIndex: "brandCode",
      width: "10%",
      render: (brandCode: string) => {
        const brand = brands.find((b) => b.brandCode === brandCode);
        return brand ? brand.brandName : brandCode;
      },
    },
    
    {
      title: "Unit of Measure",
      dataIndex: "uoMCode",
      width: "10%",
      render: (uoMCode: string) => {
        const unit = uoMs.find((u) => u.uoMCode === uoMCode);
        return unit ? unit.uoMName : uoMCode;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (_, record) => (
        <ConfigProvider button={{ className: styles.gradientButtonBlue }}>
          <Space>
            <Button
              type="primary"
              size="middle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the product"
              description={`Are you sure to delete the product "${record.productName}"?`}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                size="middle"
                icon={<DeleteOutlined />}
                className={styles.gradientButtonRed}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </ConfigProvider>
      ),
    },
  ];

  useEffect(() => {
    const getProducts = async () => {
      try {
        const [productResult, brandResult, categoryResult, unitOfMeasureResult] = await Promise.all([
          getAllProducts(),
          getAllBrands(),
          getAllProductCategories(),
          getAllUnitsOfMeasure({ cache: false }), // nếu hàm cần tham số
        ]);
  
        setProducts(productResult.data ?? []);
        setBrands(brandResult.data ?? []);
        setCategories(categoryResult.data ?? []);
        setUoMs(unitOfMeasureResult.data ?? []);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
        setLoading(false);
      }
    };
  
    getProducts();
  }, [refreshTrigger]);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onChange: TableProps<Product>["onChange"] = (pagination, filters, sorter, extra) => {
    console.log("Table params", pagination, filters, sorter, extra);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Product[]) => {
      console.log("Selected Row Keys:", selectedRowKeys);
      console.log("Selected Rows Data:", selectedRows);
    },
  };


  return (
    <Table<Product>
      columns={columns}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      dataSource={products}
      onChange={onChange}
      rowKey="id"
    />
  );
};

export { ListProduct };



