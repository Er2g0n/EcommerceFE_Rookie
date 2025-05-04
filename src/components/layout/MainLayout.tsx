import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  
  Dropdown,
  Layout,
  Menu,
  Switch,
  theme,
} from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  AppstoreOutlined,
  // CalculatorOutlined,
  CalculatorFilled,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "product-classification",
    icon: <AppstoreOutlined />,
    label: "Product Classification",
    children: [
      {
        key: "/brands",
        icon: <ShopOutlined />,
        label: <Link to="/brands">Brands</Link>,
      },
      {
        key: "/categories",
        icon: <TagsOutlined />,
        label: <Link to="/categories">Categories</Link>,
      },
      {
        key: "/unit-of-measures",
        icon: <CalculatorFilled />,
        label: <Link to="/unitOfMeasures">UnitOfMeasures</Link>,
      },
    ],
  },
  {
    key: "product-management",
    icon: <AppstoreOutlined />,
    label: "Product Management",
    children: [
      {
        key: "/products",
        icon: <ShoppingOutlined />,
        label: <Link to="/products">Products</Link>,
      },

    ],
  },
  {
    key: "/cart",
    icon: <ShoppingCartOutlined />,
    label: <Link to="/cart">Cart</Link>,
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuTheme, setMenuTheme] = useState<"light" | "dark">("dark"); // <- thêm state theme
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleTheme = (checked: boolean) => {
    setMenuTheme(checked ? "dark" : "light");
  };

  // Breadcrumb tự động theo path
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {pathSnippets[index].charAt(0).toUpperCase() +
              pathSnippets[index].slice(1)}
          </Link>
        </Breadcrumb.Item>
      );
    }),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          backgroundColor: menuTheme === "dark" ? "#001529" : "#ffffff",
        }}
      >
        <div className="demo-logo-vertical" />
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Switch
            checked={menuTheme === "dark"}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            size="small"
          />
        </div>
        <Menu
          theme={menuTheme}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  label: "Log Out",
                  danger: true,
                  onClick: () => {
                    window.location.href = "/login"; // <-- Điều hướng đến login
                  },
                },
              ],
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <UserOutlined
              style={{
                fontSize: 24, // <-- Bự hơn ở đây (default chỉ 14px)
                cursor: "pointer",
                color: "#333",
                marginRight: 16, // <-- Nếu muốn thêm khoảng cách với lề
              }}
            />
          </Dropdown>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbItems}
          </Breadcrumb>
          <div>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
