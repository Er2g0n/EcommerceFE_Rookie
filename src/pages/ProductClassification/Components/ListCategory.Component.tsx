import { useEffect, useState } from "react";
import { getAllProductCategories, deleteProductCategoryByDapper } from "../../../services/ProductClassification/Category.Service/productCategoryService";
import { ProductCategory } from "../../../types/ProductClassification/Category/ProductCategory";
import { TableColumnsType, Table, TableProps, Button, Space, ConfigProvider, Popconfirm } from "antd";
import { useButtonStyles } from "../../../hooks/useButtonStyles";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface ListCategoryProps {
  refreshTrigger: number;
  onEdit: (category: ProductCategory) => void;
}

const ListCategory: React.FC<ListCategoryProps> = ({ refreshTrigger, onEdit }) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { styles } = useButtonStyles();

  const handleDelete = async (record: ProductCategory) => {
    try {
      if (!record.categoryCode) {
        console.error("Missing categoryCode for delete");
        return;
      }

      const result = await deleteProductCategoryByDapper(record.categoryCode);

      if (result.code === "0") {
        setCategories((prev) => prev.filter((c) => c.categoryCode !== record.categoryCode));
        console.log(`Deleted category: ${record.categoryCode}`);
      } else {
        console.error(`Delete failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const columns: TableColumnsType<ProductCategory> = [
    {
      title: "Category Code",
      dataIndex: "categoryCode",
      width: "15%",
      filters: categories.map((category) => ({
        text: category.categoryCode,
        value: category.categoryCode,
      })),
      onFilter: (value, record) => record.categoryCode === value,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      width: "55%",
      filterSearch: true,
      filters: categories.map((category) => ({
        text: category.categoryName,
        value: category.categoryName,
      })),
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (_, record) => (
        <ConfigProvider
          button={{
            className: styles.gradientButtonBlue,
          }}
        >
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
              title="Delete the category"
              description={`Are you sure to delete the category "${record.categoryName}"?`}
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
    const getCategories = async () => {
      try {
        const result = await getAllProductCategories({ cache: false });
        setCategories(result.data ?? []);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải danh mục sản phẩm";
        setError(errorMessage);
        setLoading(false);
      }
    };

    getCategories();
  }, [refreshTrigger]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onChange: TableProps<ProductCategory>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("Table params", pagination, filters, sorter, extra);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductCategory[]) => {
      console.log("Selected Row Keys:", selectedRowKeys);
      console.log("Selected Rows Data:", selectedRows);
    },
  };

  return (
    <Table<ProductCategory>
      columns={columns}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      dataSource={categories}
      onChange={onChange}
      rowKey="id"
    />
  );
};

export default ListCategory;