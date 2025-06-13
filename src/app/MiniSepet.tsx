import { Badge, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useCart } from '../data/CartContext';

export default function MiniSepet() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  return (
    <>
      <Link href="/cart">
        <Badge count={cartCount} offset={[0, 6]}>
          <Button shape="circle" icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />} size="large" style={{ background: '#eee', border: '1px solid #eee' }} />
        </Badge>
      </Link>
      <Link href="/cart">
        <Button type="primary" style={{ marginLeft: 4 }}>Sepete Git</Button>
      </Link>
    </>
  );
} 