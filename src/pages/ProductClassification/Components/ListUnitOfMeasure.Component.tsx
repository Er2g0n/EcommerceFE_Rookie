import { useEffect, useState } from "react";
import { getAllUnitsOfMeasure, deleteUnitOfMeasureByDapper } from "../../../services/ProductClassification/UnitOfMeasure.Service/unitOfMeasureService";
import { UnitOfMeasure } from "../../../types/ProductClassification/UnitOfMeasure/UnitOfMeasure";
import { TableColumnsType, Table, TableProps, Button, Space, ConfigProvider, Popconfirm } from "antd";
import { useButtonStyles } from "../../../hooks/useButtonStyles";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface ListUnitOfMeasureProps {
  refreshTrigger: number;
  onEdit: (unit: UnitOfMeasure) => void;
}

const ListUnitOfMeasure: React.FC<ListUnitOfMeasureProps> = ({ refreshTrigger, onEdit }) => {
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { styles } = useButtonStyles();

  const handleDelete = async (record: UnitOfMeasure) => {
    try {
      if (!record.uoMCode) {
        console.error("Missing uoMCode for delete");
        return;
      }

      const result = await deleteUnitOfMeasureByDapper(record.uoMCode);

      if (result.code === "0") {
        setUnits((prev) => prev.filter((u) => u.uoMCode !== record.uoMCode));
        console.log(`Deleted unit of measure: ${record.uoMCode}`);
      } else {
        console.error(`Delete failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting unit of measure:", error);
    }
  };

  const columns: TableColumnsType<UnitOfMeasure> = [
    {
      title: "Unit Code",
      dataIndex: "uoMCode",
      width: "15%",
      filters: units.map((unit) => ({
        text: unit.uoMCode,
        value: unit.uoMCode,
      })),
      onFilter: (value, record) => record.uoMCode === value,
    },
    {
      title: "Unit Name",
      dataIndex: "uoMName",
      width: "20%",
      filterSearch: true,
      filters: units.map((unit) => ({
        text: unit.uoMName,
        value: unit.uoMName,
      })),
      onFilter: (value, record) => record.uoMName === value,
    },
    {
      title: "UoM Description",
      dataIndex: "uoMDescription",
      width: "55%",
      filterSearch: true,
      filters: units.map(unit => ({
        text: unit.uoMDescription || '',
        value: unit.uoMDescription || '',
      })),
      
      onFilter: (value, record) => record.uoMName === value,
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
              title="Delete the unit of measure"
              description={`Are you sure to delete the unit "${record.uoMName}"?`}
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
    const getUnits = async () => {
      try {
        const result = await getAllUnitsOfMeasure({ cache: false });
        setUnits(result.data ?? []);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải đơn vị tính";
        setError(errorMessage);
        setLoading(false);
      }
    };

    getUnits();
  }, [refreshTrigger]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const onChange: TableProps<UnitOfMeasure>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("Table params", pagination, filters, sorter, extra);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: UnitOfMeasure[]) => {
      console.log("Selected Row Keys:", selectedRowKeys);
      console.log("Selected Rows Data:", selectedRows);
    },
  };

  return (
    <Table<UnitOfMeasure>
      columns={columns}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      dataSource={units}
      onChange={onChange}
      rowKey="id"
    />
  );
};

export default ListUnitOfMeasure;