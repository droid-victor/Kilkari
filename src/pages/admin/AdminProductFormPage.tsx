import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Product, AgeGroup } from '@/types/product'
import { fetchAllProductsOnce, saveProduct } from '@/services/inventoryService'
import { isFirebaseConfigured } from '@/config/firebase'
import { slugify } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { adminProductFormSchema, type AdminProductFormValues } from '@/pages/admin/adminProductSchema'

const emptyValues: AdminProductFormValues = {
  sku: '',
  name: '',
  brand: '',
  category: 'clothing',
  subcategory: '',
  gender: 'unisex',
  ageGroups: '',
  description: '',
  shortDescription: '',
  images: '',
  price: 0,
  mrp: 0,
  sizes: '',
  colors: '',
  material: '',
  careInstructions: '',
  rating: 4.5,
  reviewCount: 0,
  onlineStock: 0,
  storeStock: 0,
  tags: '',
  featured: false,
  newArrival: true,
  bestSeller: false,
  trending: false,
}

function productToFormValues(p: Product): AdminProductFormValues {
  return {
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    gender: p.gender,
    ageGroups: p.ageGroup.join(', '),
    description: p.description,
    shortDescription: p.shortDescription,
    images: p.images.join('\n'),
    price: p.price,
    mrp: p.mrp,
    sizes: p.sizes.join(', '),
    colors: p.colors.map((c) => `${c.name}:${c.hex}`).join(', '),
    material: p.material ?? '',
    careInstructions: p.careInstructions ?? '',
    rating: p.rating,
    reviewCount: p.reviewCount,
    onlineStock: p.onlineStock,
    storeStock: p.storeStock,
    tags: p.tags.join(', '),
    featured: p.featured ?? false,
    newArrival: p.newArrival ?? false,
    bestSeller: p.bestSeller ?? false,
    trending: p.trending ?? false,
  }
}

function toProduct(values: AdminProductFormValues, existingId: string | null): Product {
  const id = existingId ?? `p-${Date.now()}`
  return {
    id,
    sku: values.sku,
    slug: slugify(values.name),
    name: values.name,
    brand: values.brand,
    category: values.category,
    subcategory: values.subcategory,
    gender: values.gender,
    ageGroup: values.ageGroups
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as AgeGroup[],
    description: values.description,
    shortDescription: values.shortDescription,
    images: values.images
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean),
    price: values.price,
    mrp: values.mrp,
    sizes: (values.sizes ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    colors: (values.colors ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, hex] = entry.split(':').map((s) => s.trim())
        return { name: name ?? entry, hex: hex ?? '#cccccc' }
      }),
    material: values.material || undefined,
    careInstructions: values.careInstructions || undefined,
    rating: values.rating,
    reviewCount: values.reviewCount,
    onlineStock: values.onlineStock,
    storeStock: values.storeStock,
    pickupAvailable: values.storeStock > 0,
    featured: values.featured,
    newArrival: values.newArrival,
    bestSeller: values.bestSeller,
    trending: values.trending,
    tags: (values.tags ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductFormValues>({
    resolver: zodResolver(adminProductFormSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (isNew) return
    fetchAllProductsOnce().then((products) => {
      const existing = products.find((p) => p.id === id)
      if (existing) reset(productToFormValues(existing))
      setLoading(false)
    })
  }, [id, isNew, reset])

  async function onSubmit(values: AdminProductFormValues) {
    setSubmitError(null)
    try {
      const product = toProduct(values, isNew ? null : id!)
      await saveProduct(product)
      navigate('/admin/products')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save product.')
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-400">Loading...</p>
  }

  const inputClass =
    'h-11 rounded-lg border border-ink-900/15 px-3 text-sm focus:outline-none focus:border-terracotta-500 w-full'
  const labelClass = 'text-sm font-medium text-ink-900 mb-1.5 block'
  const errorClass = 'text-xs text-error-500 mt-1'

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">
        {isNew ? 'Add Product' : 'Edit Product'}
      </h1>

      {!isFirebaseConfigured && (
        <div className="rounded-card bg-terracotta-50 text-terracotta-700 text-sm p-4 mb-6">
          Firebase is not connected — saving is disabled until <code>.env.local</code> is configured.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Product Name</label>
            <input className={inputClass} {...register('name')} />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input className={inputClass} {...register('sku')} />
            {errors.sku && <p className={errorClass}>{errors.sku.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input className={inputClass} {...register('brand')} />
            {errors.brand && <p className={errorClass}>{errors.brand.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Subcategory</label>
            <input className={inputClass} placeholder="e.g. Dresses, Sneakers" {...register('subcategory')} />
            {errors.subcategory && <p className={errorClass}>{errors.subcategory.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} {...register('category')}>
              <option value="clothing">Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="toys">Toys</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select className={inputClass} {...register('gender')}>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="baby">Baby</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Age Groups (comma-separated: 0-3m, 3-12m, 1-3y, 4-7y, 8-12y, 13-16y)</label>
          <input className={inputClass} placeholder="1-3y, 4-7y" {...register('ageGroups')} />
          {errors.ageGroups && <p className={errorClass}>{errors.ageGroups.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Short Description</label>
          <input className={inputClass} {...register('shortDescription')} />
          {errors.shortDescription && <p className={errorClass}>{errors.shortDescription.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Full Description</label>
          <textarea rows={3} className={inputClass} style={{ height: 'auto' }} {...register('description')} />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Image URLs (one per line, or comma-separated)</label>
          <textarea
            rows={3}
            className={inputClass}
            style={{ height: 'auto' }}
            placeholder="https://..."
            {...register('images')}
          />
          {errors.images && <p className={errorClass}>{errors.images.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Selling Price (₹)</label>
            <input type="number" step="1" className={inputClass} {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>MRP (₹)</label>
            <input type="number" step="1" className={inputClass} {...register('mrp', { valueAsNumber: true })} />
            {errors.mrp && <p className={errorClass}>{errors.mrp.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Sizes (comma-separated)</label>
            <input className={inputClass} placeholder="4-5Y, 5-6Y, 6-7Y" {...register('sizes')} />
          </div>
          <div>
            <label className={labelClass}>Colors (name:hex, comma-separated)</label>
            <input className={inputClass} placeholder="Coral Pink:#e8927c" {...register('colors')} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Material</label>
            <input className={inputClass} {...register('material')} />
          </div>
          <div>
            <label className={labelClass}>Care Instructions</label>
            <input className={inputClass} {...register('careInstructions')} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Online Stock</label>
            <input type="number" className={inputClass} {...register('onlineStock', { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Store Stock</label>
            <input type="number" className={inputClass} {...register('storeStock', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rating (0-5)</label>
            <input type="number" step="0.1" className={inputClass} {...register('rating', { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelClass}>Review Count</label>
            <input type="number" className={inputClass} {...register('reviewCount', { valueAsNumber: true })} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input className={inputClass} placeholder="cotton, summer, casual" {...register('tags')} />
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('featured')} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('newArrival')} /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('bestSeller')} /> Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('trending')} /> Trending
          </label>
        </div>

        {submitError && <p className="text-sm text-error-500">{submitError}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting || !isFirebaseConfigured}>
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
