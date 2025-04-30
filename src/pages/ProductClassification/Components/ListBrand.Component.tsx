import { useEffect, useState } from "react";
import { getAllBrands, deleteBrandByDapper } from "../../../services/ProductClassification/Brand.Service/brandService";
import { Brand } from "../../../types/ProductClassification/Brand/Brand";
import { ResultService } from "../../../types/Base/ResultService";
import { TableColumnsType, Table, TableProps, Button, Space, ConfigProvider, Popconfirm } from "antd";
import { useButtonStyles } from "../../../hooks/useButtonStyles";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface ListBrandProps {
  refreshTrigger: number;
  onEdit: (brand: Brand) => void;
}

const ListBrand: React.FC<ListBrandProps> = ({ refreshTrigger, onEdit }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { styles } = useButtonStyles();

  const handleDelete = async (record: Brand) => {
    try {
      if (!record.brandCode) {
        console.error("Missing brandCode for delete");
        return;
      }

      const result = await deleteBrandByDapper(record.brandCode);

      if (result.code === "0") {
        setBrands((prev) => prev.filter((b) => b.brandCode !== record.brandCode));
        console.log(`Deleted brand: ${record.brandCode}`);
      } else {
        console.error(`Delete failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const columns: TableColumnsType<Brand> = [
    {
      title: "Brand Code",
      dataIndex: "brandCode",
      width: "15%",
      filters: brands.map((brand) => ({
        text: brand.brandCode,
        value: brand.brandCode,
      })),
      onFilter: (value, record) => record.brandCode === value,
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      width: "55%",
      filterSearch: true,
      filters: brands.map((brand) => ({
        text: brand.brandName,
        value: brand.brandName,
      })),
      onFilter: (value, record) => record.brandName === value,
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
              title="Delete the brand"
              description={`Are you sure to delete the brand "${record.brandName}"?`}
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
    const getBrands = async () => {
      try {
        const result: ResultService<Brand[]> = await getAllBrands({ cache: false });
        setBrands(result.data ?? []);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải sản phẩm";
        setError(errorMessage);
        setLoading(false);
      }
    };

    getBrands();
  }, [refreshTrigger]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onChange: TableProps<Brand>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("Table params", pagination, filters, sorter, extra);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Brand[]) => {
      console.log("Selected Row Keys:", selectedRowKeys);
      console.log("Selected Rows Data:", selectedRows);
    },
  };

  return (
    <Table<Brand>
      columns={columns}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      dataSource={brands}
      onChange={onChange}
      rowKey="id"
    />
  );
};

export default ListBrand;