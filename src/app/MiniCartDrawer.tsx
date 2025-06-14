import { useRef, useEffect } from 'react';
import { List, Button, Avatar, message, Drawer, Badge } from 'antd';
import { useCart } from '../data/CartContext';
import { useProducts } from '../data/ProductContext';
import { useRouter } from 'next/navigation';

export default function MiniCartDrawer({ 
  open, 
  onClose, 
  anchorRef,
  windowWidth,
  cartCount
}: { 
  open: boolean, 
  onClose: () => void, 
  anchorRef: React.RefObject<HTMLDivElement | null>,
  windowWidth: number,
  cartCount?: number
}) {
  const { cart, increaseQty, decreaseQty } = useCart();
  const { products } = useProducts();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sadece masaüstünde: Dışarı tıklanınca kapanma
  useEffect(() => {
    if (windowWidth < 600) return;
    function handleClick(e: MouseEvent) {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose, anchorRef, windowWidth]);

  if (windowWidth < 600) {
    // Mobil: Drawer
    return (
      <Drawer
        title="My Cart"
        placement="right"
        onClose={onClose}
        open={open}
        width="100%"
        styles={{
          body: {
            padding: '12px',
          },
          header: {
            padding: '12px',
          }
        }}
      >
        <CartListContent cart={cart} products={products} increaseQty={increaseQty} decreaseQty={decreaseQty} onClose={onClose} router={router} />
      </Drawer>
    );
  }

  // Masaüstü: Dropdown
  if (!open) return null;
  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: anchorRef.current ? anchorRef.current.getBoundingClientRect().bottom + window.scrollY + 8 : 60,
        left: anchorRef.current ? anchorRef.current.getBoundingClientRect().left + window.scrollX - 220 + (anchorRef.current.offsetWidth / 2) : 0,
        width: 320,
        background: '#fff',
        boxShadow: '0 4px 24px #0002',
        borderRadius: 12,
        zIndex: 99999,
        padding: 12,
      }}
    >
      <CartListContent cart={cart} products={products} increaseQty={increaseQty} decreaseQty={decreaseQty} onClose={onClose} router={router} />
    </div>
  );
}

// Sepet içeriği ortak component
function CartListContent({ cart, products, increaseQty, decreaseQty, onClose, router }: any) {
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        locale={{ emptyText: 'Your cart is empty.' }}
        renderItem={(item: any) => {
          const product = products.find((p: any) => p.Id === item.Id);
          const maxQty = product ? product.Stock : 99;
          return (
            <List.Item
              actions={[
                <Button size="small" onClick={() => decreaseQty(item.Id)} disabled={item.quantity <= 1}>-</Button>,
                <span>{item.quantity}</span>,
                <Button size="small" onClick={() => {
                  if (item.quantity < maxQty) increaseQty(item.Id);
                  else message.warning('No more in stock!');
                }} disabled={item.quantity >= maxQty}>+</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.Image} shape="square" size={40} />}
                title={item.Name}
                description={<>
                  <div>Price: {item.Price} ₺</div>
                  <div>Total: {(item.Price * item.quantity).toFixed(2)} ₺</div>
                </>}
              />
            </List.Item>
          );
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 12 }}>
        <Button block onClick={onClose}>Continue Shopping</Button>
        <Button type="primary" block onClick={() => { onClose(); router.push('/cart'); }}>Go to Cart</Button>
      </div>
    </>
  );
} 