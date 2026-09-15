import type { Product } from '@/types/product'
import { Badge } from '@/components/ui/Badge'

export function StockBadge({ product }: { product: Product }) {
  const totalStock = product.onlineStock + product.storeStock

  if (totalStock === 0) {
    return <Badge tone="error">Out of Stock</Badge>
  }
  if (product.onlineStock === 0 && product.storeStock > 0) {
    return <Badge tone="sun">Available at Store</Badge>
  }
  if (product.onlineStock > 0 && product.onlineStock <= 3) {
    return <Badge tone="terracotta">Only {product.onlineStock} left</Badge>
  }
  return null
}
