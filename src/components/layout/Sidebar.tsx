import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
    {/* Product Classification */}
    {/* Brand */}
      <Menu.Item key="/brands" icon={<ShoppingOutlined />}>
        <Link to="/brands">Brands</Link>
      </Menu.Item>
      
    {/* -------------------------------- */}
    {/* Product Management */}
    {/* Product */}
      <Menu.Item key="/products" icon={<ShoppingOutlined />}>
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">Cart</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar; 