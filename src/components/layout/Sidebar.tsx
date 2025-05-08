import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CarOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.Item key="/home" icon={<HomeOutlined />}>
        <Link to="/home">Home</Link>
      </Menu.Item>

      {/* User Display */}
      <Menu.Item key="/users" icon={<UserOutlined />}>
        <Link to="/users">Users</Link>
      </Menu.Item>

      {/* Product Classification */}
      {/* Brand */}
      <Menu.Item key="/brands" icon={<ShoppingOutlined />}>
        <Link to="/brands">Brands</Link>
      </Menu.Item>
      {/* Category */}
      <Menu.Item key="/categories" icon={<ShoppingOutlined />}>
        <Link to="/categories">Categories</Link>
      </Menu.Item>
      {/* UnitOfMeasure */}
      <Menu.Item key="/unitOfMeasures" icon={<ShoppingOutlined />}>
        <Link to="/unitOfMeasures">UnitOfMeasures</Link>
      </Menu.Item>
      {/* Product Management */}
      {/* Product */}
      <Menu.Item key="/products" icon={<CarOutlined />}>
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">Cart</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;