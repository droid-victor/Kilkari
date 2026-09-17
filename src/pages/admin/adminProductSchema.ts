import { z } from 'zod'

// Form-level schema: several Product[] fields are edited as plain text in
// the admin form (comma-separated) for simplicity, then parsed into arrays
// on submit — see toProduct() in AdminProductFormPage.tsx.
export const adminProductFormSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['clothing', 'footwear', 'toys', 'accessories']),
  subcategory: z.string().min(1, 'Subcategory is required'),
  gender: z.enum(['boys', 'girls', 'New Born', 'unisex']),
  ageGroups: z.string().min(1, 'Select at least one age group'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  images: z.string().min(1, 'At least one image URL is required'),
  price: z.number().positive('Price must be greater than 0'),
  mrp: z.number().positive('MRP must be greater than 0'),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  onlineStock: z.number().min(0),
  storeStock: z.number().min(0),
  tags: z.string().optional(),
  featured: z.boolean(),
  newArrival: z.boolean(),
  bestSeller: z.boolean(),
  trending: z.boolean(),
})

export type AdminProductFormValues = z.infer<typeof adminProductFormSchema>
