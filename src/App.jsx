import { useState, useEffect } from 'react';
import { products } from './data/data';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [recProducts, setRecProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const [cartIcon, setCartIcon] = useState('./public/image/cart_def.png');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  function addToCart(prod) {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === prod.id);
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { product: prod, quantity: 1 }];
      }
    });
  }

  function increaseQuantity(prod) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === prod.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(prod) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === prod.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(prod) {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== prod.id));
  }

  function applyCoupon() {
    const coupons = {
      CSMJU: 100,
    };
    const discountValue = coupons[couponCode.toUpperCase()];
    if (discountValue) {
      setDiscount(discountValue);
      alert(`คุณได้รับส่วนลด ${discountValue}%`);
    } else {
      alert('คูปองไม่ถูกต้อง');
      setDiscount(0);
    }
  }

  function letsPay() {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    alert('ชำระเงินสำเร็จ');
  }

  const shippingCost = 100;
  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const addShipping = totalPrice + shippingCost;
  const discountAmount = (addShipping * discount) / 100;
  const totalAfterDiscount = addShipping - discountAmount;
  const grandTotal = totalAfterDiscount;

  const filteredProducts = products.filter((product) =>
    product.nameProd.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    function getRandomProducts(products, num) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    }

    const randomProducts = getRandomProducts(products, 8);
    setRecProducts(randomProducts);
  }, []);

  useEffect(() => {
    if (cart.length > 0 && showHomePage) {
      setCartIcon('./public/image/cart_new.png');
    } else if (!showHomePage) {
      setCartIcon('./public/image/back_page.png');
    } else {
      setCartIcon('./public/image/cart_def.png');
    }
  }, [cart, showHomePage]);

  function openModal(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  const recProductList = recProducts.map((product) => (
    <div className='box-prod' key={product.id}>
      <img src={product.imgProd} alt={product.nameProd} />
      <span className='cutoff-text-1'> {product.nameProd} </span>
      <span className='bold'> {'$' + product.price} </span>
      <button className='prod-btn' onClick={() => addToCart(product)}>
        เพิ่มลงในตระกร้า
      </button>
      <button className='prod-btn-2' onClick={() => openModal(product)}>
        รายละเอียดเพิ่มเติม
      </button>
    </div>
  ));

  const allProducts = filteredProducts.map((product) => (
    <div className='box-prod' key={product.id}>
      <img src={product.imgProd} alt={product.nameProd} />
      <span className='cutoff-text-1'> {product.nameProd} </span>
      <span className='bold'> {'$' + product.price} </span>
      <button className='prod-btn' onClick={() => addToCart(product)}>
        เพิ่มลงในตระกร้า
      </button>
      <button className='prod-btn-2' onClick={() => openModal(product)}>
        รายละเอียดเพิ่มเติม
      </button>
    </div>
  ));

  const cartItems = cart.map((item) => (
    <div className='cart-item' key={item.product.id}>
      <img src={item.product.imgProd} alt={item.product.nameProd} className='img-prod' />
      <div className='info-prod'>
        <div>
          <span className='cutoff-text-1'> {item.product.nameProd} </span>
          <span className='bold'> {'$' + item.product.price} </span>
        </div>
        <div className='quantity-controls'>
          <button onClick={() => decreaseQuantity(item.product)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => increaseQuantity(item.product)}>+</button>
        </div>
      </div>
      <img
        src='./public/image/trash.png'
        alt='Remove'
        className='trash-icon'
        onClick={() => removeFromCart(item.product)}
      />
    </div>
  ));

  return (
    <>
      <nav className='navbar'>
        <div>
          <a className='logo'>BGT-SHOPPING</a>
        </div>
        <div>
          {showHomePage && (
            <div className='search'>
              <input
                className='search-input'
                type='text'
                placeholder='ค้นหาสินค้า'
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
          )}
        </div>
        <div className='icon'>
          {showHomePage ? (
            <img
              src={cartIcon}
              className='cart'
              onClick={() => setShowHomePage(false)}
            />
          ) : (
            <img
              src={cartIcon}
              className='cart'
              onClick={() => setShowHomePage(true)}
            />
          )}
        </div>
      </nav>

      {showHomePage ? (
        <>
          {searchText === '' ? (
            <>
              <div className='rec-prod'>
                <p className='bold'>สำหรับคุณ</p>
                <div className='flex-prod'>{recProductList}</div>
              </div>

              <div className='rec-prod'>
                <p className='bold'>สินค้าทั้งหมด</p>
                <div className='flex-prod'>{allProducts}</div>
              </div>
            </>
          ) : (
            <>
              <div className='rec-prod'>
                <p className='bold'>ผลการค้นหา</p>
                <div className='flex-prod'>
                  {allProducts.length > 0 ? allProducts : <p>ไม่พบสินค้าที่ตรงกับคำค้นหา</p>}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className='rec-prod'>
          <p className='bold'>สินค้าในตะกร้า</p>
          {cartItems.length > 0 ? (
            <>
              {cartItems}
              <div className='coupon-section'>
                <input
                  type='text'
                  placeholder='ใช้โค้ด "CSMJU" ลด 100%'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={applyCoupon}>ใช้คูปอง</button>
              </div>
              <div className='cart-summary'>
                <p>ราคารวม: ${totalPrice.toFixed(2)}</p>
                <p>ค่าจัดส่ง: ${shippingCost.toFixed(2)}</p>
                <p>ส่วนลด: {discount}%</p>
                <p>ลดแล้ว: ${discountAmount.toFixed(2)}</p>
                <p>ต้องชำระ: ${grandTotal.toFixed(2)}</p>
              </div>
              <div className='let-pay'>
                <button onClick={letsPay}>ชำระเงิน</button>
              </div>
            </>
          ) : (
            <div className='flex-prod'>
              <p>ไม่มีสินค้าในตะกร้า</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2></h2>
            <img src={selectedProduct.imgProd} alt={selectedProduct.nameProd} />
            <h2>{selectedProduct.nameProd}</h2>
            <p>Price: ${selectedProduct.price}</p>
            <p>Stock: {selectedProduct.stock}</p>
            <p>Description: {selectedProduct.detail}</p>
            <button className='prod-btn-more' onClick={() => addToCart(selectedProduct)}>
              เพิ่มลงในตระกร้า
            </button>
            <button className='close-modal-btn' onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
