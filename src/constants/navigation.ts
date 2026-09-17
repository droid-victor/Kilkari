export interface NavLink {
  label: string
  path: string
}

export const mainNavLinks: NavLink[] = [
  { label: 'New Arrivals', path: '/shop?filter=new' },
  { label: 'Boys', path: '/boys' },
  { label: 'Girls', path: '/girls' },
  { label: 'New Born', path: '/New Born' },
  { label: 'Clothing', path: '/clothing' },
  { label: 'Footwear', path: '/footwear' },
  { label: 'Toys', path: '/toys' },
  { label: 'Accessories', path: '/accessories' },
  { label: 'Sale', path: '/sale' },
]

export const footerShopLinks: NavLink[] = [
  { label: 'Boys', path: '/boys' },
  { label: 'Girls', path: '/girls' },
  { label: 'New Born', path: '/New Born' },
  { label: 'Clothing', path: '/clothing' },
  { label: 'Footwear', path: '/footwear' },
  { label: 'Toys', path: '/toys' },
  { label: 'Accessories', path: '/accessories' },
  { label: 'Sale', path: '/sale' },
]

export const footerCareLinks: NavLink[] = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'Track Order', path: '/track-order' },
  { label: 'Returns & Exchange', path: '/returns' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Size Guide', path: '/size-guide' },
]

export const footerStoreLinks: NavLink[] = [
  { label: 'Visit Our Store', path: '/store' },
  { label: 'Store Location', path: '/store#location' },
  { label: 'Opening Hours', path: '/store#hours' },
]

export const footerCompanyLinks: NavLink[] = [
  { label: 'About Us', path: '/about' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Refund Policy', path: '/returns' },
]

export const mobileBottomNav = [
  { label: 'Home', path: '/', icon: 'Home' },
  { label: 'Categories', path: '/shop', icon: 'LayoutGrid' },
  { label: 'Search', path: '/search', icon: 'Search' },
  { label: 'Wishlist', path: '/wishlist', icon: 'Heart' },
  { label: 'Account', path: '/account', icon: 'User' },
] as const
