import { useRef, useState } from 'react'
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import { uploadProductImage } from '@/services/imageUploadService'
import { isFirebaseConfigured } from '@/config/firebase'

/**
 * Manages a list of product image URLs, editable via either:
 *  - uploading image files (compressed client-side into data: URLs — see
 *    imageUploadService.ts for why, since Firebase Storage isn't available)
 *  - pasting an existing image URL directly
 * The parent form field stores the result as a newline-separated string,
 * matching the existing AdminProductFormValues.images shape.
 */
export function ImageUploadField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const urls = value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)

  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function setUrls(next: string[]) {
    onChange(next.join('\n'))
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setUrls([...urls, trimmed])
    setUrlInput('')
  }

  function handleRemove(index: number) {
    setUrls(urls.filter((_, i) => i !== index))
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploadError(null)
    setUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file)
        uploadedUrls.push(url)
      }
      setUrls([...urls, ...uploadedUrls])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-20 w-20 rounded-lg overflow-hidden bg-cream-200 shrink-0">
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = '0.3'
                }}
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => handleRemove(i)}
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-ink-900/70 text-cream-50 flex items-center justify-center cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !isFirebaseConfigured}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-ink-900/15 text-sm font-medium disabled:opacity-40 cursor-pointer"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        <div className="flex items-center gap-1.5 flex-1 min-w-48">
          <LinkIcon size={14} className="text-ink-400 shrink-0" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddUrl()
              }
            }}
            placeholder="Or paste an image URL"
            className="h-9 flex-1 rounded-lg border border-ink-900/15 px-2.5 text-sm focus:outline-none focus:border-terracotta-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="h-9 px-3 rounded-lg border border-ink-900/15 text-sm font-medium cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {!isFirebaseConfigured && (
        <p className="text-xs text-ink-400">Connect Firebase to upload image files — pasting URLs still works.</p>
      )}
      {uploadError && <p className="text-xs text-error-500">{uploadError}</p>}
      {urls.length === 0 && <p className="text-xs text-ink-400">At least one image is required.</p>}
    </div>
  )
}
