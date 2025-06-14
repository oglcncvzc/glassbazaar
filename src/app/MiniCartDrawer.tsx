import { useRef, useEffect } from 'react';
import { List, Button, Avatar, message, Drawer, Badge } from 'antd';
import { useCart } from '../data/CartContext';
import { useProducts } from '../data/ProductContext';
import { useRouter } from 'next/navigation';

export default function MiniCartDrawer({ 
  open, 
  onClose, 
  anchorRef,
  windowWidth 
}: { 
  open: boolean, 
  onClose: () => void, 
  anchorRef: React.RefObject<HTMLDivElement | null>,
  windowWidth: number 
}) {
  const { cart, increaseQty, decreaseQty } = useCart();
  const { products } = useProducts();
  const router = useRouter();

  return (
    <Drawer
      title="Sepetim"
      placement="right"
      onClose={onClose}
      open={open}
      width={windowWidth < 600 ? '100%' : 320}
      styles={{
        body: {
          padding: '12px',
        },
        header: {
          padding: '12px',
        }
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={cart}
        locale={{ emptyText: 'Sepetiniz boş.' }}
        renderItem={item => {
          const product = products.find(p => p.Id === item.Id);
          const maxQty = product ? product.Stock : 99;
          return (
            <List.Item
              actions={[
                <Button size="small" onClick={() => decreaseQty(item.Id)} disabled={item.quantity <= 1}>-</Button>,
                <span>{item.quantity}</span>,
                <Button size="small" onClick={() => {
                  if (item.quantity < maxQty) increaseQty(item.Id);
                  else message.warning('Stokta daha fazla yok!');
                }} disabled={item.quantity >= maxQty}>+</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.Image} shape="square" size={40} />}
                title={item.Name}
                description={<>
                  <div>Fiyat: {item.Price} ₺</div>
                  <div>Toplam: {(item.Price * item.quantity).toFixed(2)} ₺</div>
                </>}
              />
            </List.Item>
          );
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
        <Button block onClick={onClose}>Alışverişe Devam Et</Button>
        <Button type="primary" block onClick={() => { onClose(); router.push('/cart'); }}>Sepete Git</Button>
      </div>
    </Drawer>
  );
} 