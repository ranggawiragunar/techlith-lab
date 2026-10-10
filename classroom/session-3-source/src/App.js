import React, { useMemo, useState } from 'react';
import './styles.css';
import { isProductValid, validateOutbound } from './inventoryRules';

const initialItems = [
  { id: 'ITM-001', name: 'Kain Katun', unit: 'meter', stock: 10 },
  { id: 'ITM-002', name: 'Benang Hitam', unit: 'roll', stock: 5 },
  { id: 'ITM-003', name: 'Resleting', unit: 'pcs', stock: 100 }
];

const finiteNumberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function parseFiniteNumber(value) {
  const trimmed = value.trim();
  if (!finiteNumberPattern.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

const emptyProduct = () => ({
  name: '', category: '', description: '', price: '0', colors: '', sizes: '',
  stocks: [{ color: 'Black', size: 'M', amount: '1' }]
});

function App() {
  const [tab, setTab] = useState('items');
  const [items, setItems] = useState(initialItems);
  const [itemId, setItemId] = useState('ITM-001');
  const [amount, setAmount] = useState('10');
  const [transactionFeedback, setTransactionFeedback] = useState(null);
  const [product, setProduct] = useState(emptyProduct);
  const [productFeedback, setProductFeedback] = useState('');
  const [products, setProducts] = useState([]);

  const item = useMemo(() => items.find((candidate) => candidate.id === itemId), [items, itemId]);

  function updateProduct(field, value) {
    setProduct((current) => ({ ...current, [field]: value }));
    setProductFeedback('');
  }

  function updateStock(index, field, value) {
    setProduct((current) => ({
      ...current,
      stocks: current.stocks.map((stock, stockIndex) => stockIndex === index ? { ...stock, [field]: value } : stock)
    }));
    setProductFeedback('');
  }

  function runOutbound(event) {
    event.preventDefault();
    const result = validateOutbound(item.stock, Number(amount));
    setTransactionFeedback(result.message);
    if (result.valid) {
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, stock: result.nextStock } : entry));
    }
  }

  function runProduct(event) {
    event.preventDefault();
    const price = parseFiniteNumber(product.price);
    if (price === null) {
      setProductFeedback('Enter a finite numeric price.');
      return;
    }
    const stockAmounts = product.stocks.map((stock) => parseFiniteNumber(stock.amount));
    if (stockAmounts.some((amount) => amount === null)) {
      setProductFeedback('Enter a finite amount for each stock configuration.');
      return;
    }
    const candidate = {
      ...product,
      price,
      colors: product.colors.split(',').map((value) => value.trim()).filter(Boolean),
      sizes: product.sizes.split(',').map((value) => value.trim()).filter(Boolean),
      stocks: product.stocks.map((stock, index) => ({ ...stock, amount: stockAmounts[index] }))
    };
    if (isProductValid(candidate)) {
      setProducts((current) => [...current, candidate]);
      setProductFeedback('Product added to the classroom catalog.');
    } else {
      setProductFeedback('Product could not be added.');
    }
  }

  function reset() {
    setItems(initialItems);
    setItemId('ITM-001');
    setAmount('10');
    setTransactionFeedback(null);
    setProduct(emptyProduct());
    setProductFeedback('');
    setProducts([]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="mark" aria-hidden="true">IC</div><div><b>Inventory</b><small>Session 3 Classroom</small></div></div>
        <nav aria-label="Classroom sections">
          <button className={tab === 'items' ? 'active' : ''} aria-current={tab === 'items' ? 'page' : undefined} onClick={() => setTab('items')}>Inventory dataset</button>
          <button className={tab === 'outbound' ? 'active' : ''} aria-current={tab === 'outbound' ? 'page' : undefined} onClick={() => setTab('outbound')}>Boundary Testing</button>
          <button className={tab === 'product' ? 'active' : ''} aria-current={tab === 'product' ? 'page' : undefined} onClick={() => setTab('product')}>Product Validation</button>
        </nav>
        <button className="secondary reset-button" onClick={reset}>Reset classroom</button>
      </aside>

      <main>
        <header><div><p className="eyebrow">SOFTWARE TESTING</p><h1>Inventory Classroom</h1></div><span className="pill">Session 3</span></header>

        {tab === 'items' && <section>
          <div className="section-title"><div><h2>Inventory dataset</h2><p>Use this local dataset for the classroom activities.</p></div></div>
          <div className="cards">
            {items.map((entry) => <article className="item-card" key={entry.id}>
              <div className="item-icon" aria-hidden="true">{entry.name.substring(0, 1)}</div>
              <div><small>{entry.id}</small><h3>{entry.name}</h3><p>Current stock</p><strong>{entry.stock} {entry.unit}</strong></div>
            </article>)}
          </div>
        </section>}

        {tab === 'outbound' && <section>
          <div className="section-title"><div><h2>Outbound transaction</h2><p>Submit inventory transactions and observe the updated dataset.</p></div></div>
          <form className="panel form-panel" onSubmit={runOutbound}>
            <label>Item<select value={itemId} onChange={(event) => { setItemId(event.target.value); setTransactionFeedback(null); }}>
              {items.map((entry) => <option key={entry.id} value={entry.id}>{entry.id} — {entry.name}</option>)}
            </select></label>
            <div className="stockbox"><span>Current stock</span><strong>{item.stock}</strong><small>{item.unit}</small></div>
            <label>Outbound quantity<input type="number" value={amount} onChange={(event) => { setAmount(event.target.value); setTransactionFeedback(null); }} /></label>
            <button type="submit">Submit transaction</button>
            {transactionFeedback && <p className="feedback" role="status">{transactionFeedback}</p>}
          </form>
        </section>}

        {tab === 'product' && <section>
          <div className="section-title"><div><h2>Product Validation</h2><p>Enter product details, submit, and observe the classroom catalog.</p></div></div>
          <div className="grid2">
            <form className="panel form-panel" onSubmit={runProduct}>
              <label>Product name<input value={product.name} onChange={(event) => updateProduct('name', event.target.value)} /></label>
              <label>Category<input value={product.category} onChange={(event) => updateProduct('category', event.target.value)} /></label>
              <label>Description<textarea value={product.description} onChange={(event) => updateProduct('description', event.target.value)} /></label>
              <div className="row">
                <label>Price<input type="text" inputMode="decimal" value={product.price} onChange={(event) => updateProduct('price', event.target.value)} /></label>
                <label>Colors<input value={product.colors} onChange={(event) => updateProduct('colors', event.target.value)} placeholder="Separate with commas" /></label>
              </div>
              <label>Sizes<input value={product.sizes} onChange={(event) => updateProduct('sizes', event.target.value)} placeholder="Separate with commas" /></label>
              <fieldset className="stock-configurations"><legend>Stock configurations</legend>
                {product.stocks.map((stock, index) => <div className="stock-row" key={index}>
                  <label>Color<input aria-label={`Stock ${index + 1} color`} value={stock.color} onChange={(event) => updateStock(index, 'color', event.target.value)} /></label>
                  <label>Size<input aria-label={`Stock ${index + 1} size`} value={stock.size} onChange={(event) => updateStock(index, 'size', event.target.value)} /></label>
                  <label>Amount<input aria-label={`Stock ${index + 1} amount`} type="text" inputMode="decimal" value={stock.amount} onChange={(event) => updateStock(index, 'amount', event.target.value)} /></label>
                  <button className="remove-stock" type="button" aria-label={`Remove stock configuration ${index + 1}`} onClick={() => { setProduct((current) => ({ ...current, stocks: current.stocks.filter((_, stockIndex) => stockIndex !== index) })); setProductFeedback(''); }}>Remove</button>
                </div>)}
                <button className="secondary" type="button" onClick={() => setProduct((current) => ({ ...current, stocks: [...current.stocks, { color: '', size: '', amount: '0' }] }))}>Add stock configuration</button>
              </fieldset>
              <button type="submit">Submit product</button>
              {productFeedback && <p className="feedback" role="status">{productFeedback}</p>}
            </form>

            <section className="panel catalog" aria-labelledby="catalog-title">
              <h3 id="catalog-title">Classroom product catalog</h3>
              {products.length === 0 ? <p className="empty-state">No products have been added.</p> : <ul className="catalog-list">
                {products.map((entry, index) => <li key={`${entry.name}-${index}`}>
                  <h4>{entry.name || '—'}</h4>
                  <p>{entry.category || '—'} · {entry.description || '—'}</p>
                  <p>Price: {Number.isFinite(entry.price) ? entry.price : '—'}</p>
                  <p>Colors: {entry.colors.join(', ') || '—'} · Sizes: {entry.sizes.join(', ') || '—'}</p>
                  <p>Stock: {entry.stocks.map((stock) => `${stock.color || '—'} / ${stock.size || '—'} / ${stock.amount}`).join(', ') || '—'}</p>
                </li>)}
              </ul>}
            </section>
          </div>
        </section>}
      </main>
    </div>
  );
}

export default App;
