import { useState } from 'react'

export function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible no-scrollbar">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden ring-2 transition ${
              active === i ? 'ring-terracotta-500' : 'ring-transparent'
            }`}
          >
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-square rounded-card overflow-hidden bg-cream-200">
        <img
          src={images[active]}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}
