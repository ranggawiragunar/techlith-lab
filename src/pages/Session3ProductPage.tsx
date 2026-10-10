import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useClassroomLab } from '../features/session3/context'
import type { ClassroomProduct, ClassroomStockConfiguration } from '../features/session3/productModel'
import { isClassroomProductValid } from '../features/session3/productValidation'

interface ProductDraft {
  name: string
  category: string
  description: string
  price: string
  colors: string
  sizes: string
}

interface StockConfigurationDraft {
  key: number
  color: string
  size: string
  amount: string
}

interface ProductFeedback {
  accepted: boolean
  message: string
}

const NUMERIC_VALUE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

function createEmptyProductDraft(): ProductDraft {
  return { name: '', category: '', description: '', price: '', colors: '', sizes: '' }
}

function parseFiniteNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || !NUMERIC_VALUE.test(trimmed)) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function parseValues(value: string): string[] {
  return value.split(',').map((entry) => entry.trim()).filter(Boolean)
}

function displayValue(value: string): string {
  return value || '—'
}

function displayPrice(value: number): string {
  return `Rp ${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`
}

export function Session3ProductPage() {
  const { products, addProduct, resetLabData } = useClassroomLab()
  const [draft, setDraft] = useState<ProductDraft>(createEmptyProductDraft)
  const [stockConfigurations, setStockConfigurations] = useState<StockConfigurationDraft[]>([])
  const [nextStockKey, setNextStockKey] = useState(0)
  const [feedback, setFeedback] = useState<ProductFeedback | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function updateDraft(field: keyof ProductDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function updateStockConfiguration(key: number, field: keyof Omit<StockConfigurationDraft, 'key'>, value: string) {
    setStockConfigurations((current) => current.map((configuration) => (
      configuration.key === key ? { ...configuration, [field]: value } : configuration
    )))
  }

  function addStockConfiguration() {
    const key = nextStockKey
    setNextStockKey((current) => current + 1)
    setStockConfigurations((current) => [...current, { key, color: '', size: '', amount: '' }])
  }

  function removeStockConfiguration(key: number) {
    setStockConfigurations((current) => current.filter((configuration) => configuration.key !== key))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const price = parseFiniteNumber(draft.price)
    if (price === null) {
      setFeedback({ accepted: false, message: 'Enter a finite numeric price.' })
      return
    }

    const stocks: ClassroomStockConfiguration[] = []
    for (const configuration of stockConfigurations) {
      const amount = parseFiniteNumber(configuration.amount)
      if (amount === null) {
        setFeedback({ accepted: false, message: 'Enter a finite amount for each stock configuration.' })
        return
      }
      stocks.push({ color: configuration.color, size: configuration.size, amount })
    }

    const product: ClassroomProduct = {
      name: draft.name,
      category: draft.category,
      description: draft.description,
      price,
      colors: parseValues(draft.colors),
      sizes: parseValues(draft.sizes),
      stocks,
    }

    if (!isClassroomProductValid(product)) {
      setFeedback({ accepted: false, message: 'Product could not be added.' })
      return
    }

    addProduct(product)
    setFeedback({ accepted: true, message: 'Product added to the classroom catalog.' })
    setDraft(createEmptyProductDraft())
    setStockConfigurations([])
    setNextStockKey(0)
  }

  function handleReset() {
    resetLabData()
    setDraft(createEmptyProductDraft())
    setStockConfigurations([])
    setNextStockKey(0)
    setFeedback(null)
    setConfirmingReset(false)
  }

  return (
    <>
      <Link className="back-link" to="/admin/classroom/session-3">← Session 3 classroom</Link>
      <div className="page-heading session3-page-heading">
        <div className="product-page-heading">
          <div className="eyebrow">SESSION 3 ACTIVITY</div>
          <h1>Product Validation</h1>
          <p>Add products to the classroom catalog and observe the application's validation behavior.</p>
        </div>
        <button className="button button-danger" type="button" onClick={() => setConfirmingReset(true)}>Reset Lab Data</button>
      </div>

      <section className="content-card product-form-card" aria-labelledby="product-form-title">
        <div className="product-section-heading">
          <h2 id="product-form-title">Product Add</h2>
          <p>Enter product details and submit them to the classroom catalog.</p>
        </div>

        <form className="product-form" noValidate onSubmit={handleSubmit}>
          <div className="product-field-grid">
            <div className="product-field">
              <label htmlFor="classroom-product-name">Product Name</label>
              <input id="classroom-product-name" type="text" value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} />
            </div>
            <div className="product-field">
              <label htmlFor="classroom-product-category">Category</label>
              <input id="classroom-product-category" type="text" value={draft.category} onChange={(event) => updateDraft('category', event.target.value)} />
            </div>
            <div className="product-field product-field-wide">
              <label htmlFor="classroom-product-description">Description</label>
              <textarea id="classroom-product-description" rows={3} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} />
            </div>
            <div className="product-field">
              <label htmlFor="classroom-product-price">Price</label>
              <input id="classroom-product-price" type="text" inputMode="decimal" value={draft.price} onChange={(event) => updateDraft('price', event.target.value)} />
            </div>
            <div className="product-field">
              <label htmlFor="classroom-product-colors">Colors</label>
              <input id="classroom-product-colors" type="text" aria-describedby="classroom-colors-hint" value={draft.colors} onChange={(event) => updateDraft('colors', event.target.value)} />
              <span id="classroom-colors-hint" className="product-field-hint">Enter zero or more values separated by commas.</span>
            </div>
            <div className="product-field product-field-wide">
              <label htmlFor="classroom-product-sizes">Sizes</label>
              <input id="classroom-product-sizes" type="text" aria-describedby="classroom-sizes-hint" value={draft.sizes} onChange={(event) => updateDraft('sizes', event.target.value)} />
              <span id="classroom-sizes-hint" className="product-field-hint">Enter zero or more values separated by commas.</span>
            </div>
          </div>

          <fieldset className="product-stock-fieldset">
            <legend>Stock Configurations</legend>
            <p className="product-field-hint">Add zero or more color, size, and amount combinations.</p>
            {stockConfigurations.length > 0 && (
              <div className="product-stock-list">
                {stockConfigurations.map((configuration, index) => (
                  <fieldset className="product-stock-row" key={configuration.key}>
                    <legend>Configuration {index + 1}</legend>
                    <div className="product-stock-fields">
                      <div className="product-field">
                        <label htmlFor={`stock-color-${configuration.key}`}>Color</label>
                        <input id={`stock-color-${configuration.key}`} type="text" value={configuration.color} onChange={(event) => updateStockConfiguration(configuration.key, 'color', event.target.value)} />
                      </div>
                      <div className="product-field">
                        <label htmlFor={`stock-size-${configuration.key}`}>Size</label>
                        <input id={`stock-size-${configuration.key}`} type="text" value={configuration.size} onChange={(event) => updateStockConfiguration(configuration.key, 'size', event.target.value)} />
                      </div>
                      <div className="product-field">
                        <label htmlFor={`stock-amount-${configuration.key}`}>Amount</label>
                        <input id={`stock-amount-${configuration.key}`} type="text" inputMode="decimal" value={configuration.amount} onChange={(event) => updateStockConfiguration(configuration.key, 'amount', event.target.value)} />
                      </div>
                      <button className="button button-quiet product-remove-stock" type="button" onClick={() => removeStockConfiguration(configuration.key)} aria-label={`Remove stock configuration ${index + 1}`}>Remove</button>
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
            <button className="button button-quiet product-add-stock" type="button" onClick={addStockConfiguration}>＋ Add stock configuration</button>
          </fieldset>

          <div className="product-form-actions">
            <button className="button button-primary" type="submit">Add product</button>
          </div>
        </form>

        {feedback && (
          <div className={`product-feedback ${feedback.accepted ? 'accepted' : 'rejected'}`} role={feedback.accepted ? 'status' : 'alert'} aria-live={feedback.accepted ? 'polite' : 'assertive'}>
            {feedback.message}
          </div>
        )}
      </section>

      <section className="content-card product-catalog-card" aria-labelledby="product-catalog-title">
        <div className="product-section-heading product-catalog-heading">
          <div>
            <h2 id="product-catalog-title">Classroom Product Catalog</h2>
            <p>{products.length} {products.length === 1 ? 'product' : 'products'} in this classroom catalog.</p>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="product-catalog-wrap">
            <table className="product-catalog-table">
              <thead>
                <tr>
                  <th scope="col">PRODUCT</th>
                  <th scope="col">CATEGORY</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">COLORS</th>
                  <th scope="col">SIZES</th>
                  <th scope="col">STOCK CONFIGURATIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={`${product.name}-${index}`}>
                    <td>{displayValue(product.name)}</td>
                    <td>{displayValue(product.category)}</td>
                    <td>{displayPrice(product.price)}</td>
                    <td>{product.colors.length ? product.colors.join(', ') : '—'}</td>
                    <td>{product.sizes.length ? product.sizes.join(', ') : '—'}</td>
                    <td>
                      {product.stocks.length ? product.stocks.map((stock, stockIndex) => (
                        <div className="product-catalog-stock" key={`${stock.color}-${stock.size}-${stockIndex}`}>
                          {displayValue(stock.color)} · {displayValue(stock.size)}: {stock.amount}
                        </div>
                      )) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="product-catalog-empty">No products have been added to this classroom catalog.</div>}
      </section>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset Session 3 lab data?"
          description="Restore classroom inventory to its starting stock values and clear the classroom product catalog. Main inventory data and history will not be changed."
          confirmLabel="Reset Lab Data"
          danger
          onCancel={() => setConfirmingReset(false)}
          onConfirm={handleReset}
        />
      )}
    </>
  )
}
