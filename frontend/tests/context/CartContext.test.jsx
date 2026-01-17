import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../../src/context/CartContext';

// Helper component to test cart operations and capture cartId
const TestComponent = () => {
  const { cart, total, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount } = useCart();
  
  // Get first item's cartId for operations
  const firstCartId = cart.length > 0 ? cart[0].cartId : null;
  
  return (
    <div>
      <div data-testid="cart-count">{getItemCount()}</div>
      <div data-testid="cart-total">{total}</div>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="first-quantity">{cart[0]?.quantity || 0}</div>
      <button onClick={() => addToCart({ 
        _id: 'item1', 
        name: 'Test Item', 
        price: 100, 
        size: 'Medium',
        selectedAddons: ['Cheese']
      })}>Add Item</button>
      <button onClick={() => firstCartId && removeFromCart(firstCartId)}>Remove First</button>
      <button onClick={() => firstCartId && updateQuantity(firstCartId, 1)}>Increase Qty</button>
      <button onClick={() => firstCartId && updateQuantity(firstCartId, -1)}>Decrease Qty</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide initial empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('should add item to cart', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId('cart-total').textContent).toBe('100');
  });

  it('should add multiple items to cart separately', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    await user.click(screen.getByText('Add Item'));
    
    // Each add creates a new item (because of Date.now() in cartId)
    expect(screen.getByTestId('cart-length').textContent).toBe('2');
    expect(screen.getByTestId('cart-total').textContent).toBe('200');
  });

  it('should remove first item from cart', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    
    await user.click(screen.getByText('Remove First'));
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });

  it('should increase item quantity with delta', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    expect(screen.getByTestId('first-quantity').textContent).toBe('1');
    
    await user.click(screen.getByText('Increase Qty'));
    expect(screen.getByTestId('first-quantity').textContent).toBe('2');
    
    await user.click(screen.getByText('Increase Qty'));
    expect(screen.getByTestId('first-quantity').textContent).toBe('3');
  });

  it('should decrease item quantity and remove at zero', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    expect(screen.getByTestId('first-quantity').textContent).toBe('1');
    
    await user.click(screen.getByText('Decrease Qty'));
    // Item should be removed when quantity goes to 0
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });

  it('should clear entire cart', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add Item'));
    await user.click(screen.getByText('Add Item'));
    expect(screen.getByTestId('cart-length').textContent).toBe('2');
    
    await user.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('should calculate correct total', async () => {
    const TestMultiPrice = () => {
      const { total, addToCart } = useCart();
      
      return (
        <div>
          <div data-testid="total">{total}</div>
          <button onClick={() => addToCart({ _id: 'a', name: 'A', price: 150 })}>Add A</button>
          <button onClick={() => addToCart({ _id: 'b', name: 'B', price: 75 })}>Add B</button>
        </div>
      );
    };
    
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestMultiPrice />
      </CartProvider>
    );
    
    await user.click(screen.getByText('Add A')); // 150
    await user.click(screen.getByText('Add B')); // 75
    
    // Total: 150 + 75 = 225
    expect(screen.getByTestId('total').textContent).toBe('225');
  });
});
