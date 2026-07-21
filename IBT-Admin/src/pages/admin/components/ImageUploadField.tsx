import { useEffect, useMemo, useRef, useState } from 'react'
import { FiImage, FiTrash2, FiUpload, FiAlertTriangle } from 'react-icons/fi'
import { getAbsoluteImageUrl } from '../../../utils/image'

type ImageUploadFieldProps = {
  label: string
  selectedFile: File | null
  existingImageUrl?: string
  previewAlt: string
  helperText?: string
  emptyText?: string
  maxSizeMB?: number
  onRemove?: () => void
  onFileChange: (file: File | null) => void
}

export function ImageUploadField({
  label,
  selectedFile,
  existingImageUrl,
  previewAlt,
  helperText,
  emptyText = 'Choose an image file or drag it here',
  maxSizeMB = 20,
  onRemove,
  onFileChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const selectedImageUrl = useMemo(() => {
    if (!selectedFile) {
      return null
    }

    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl)
      }
    }
  }, [selectedImageUrl])

  const previewUrl = selectedImageUrl ?? (existingImageUrl ? getAbsoluteImageUrl(existingImageUrl) : null)

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const validateAndSelectFile = (file: File | null) => {
    if (!file) {
      setFileError(null)
      onFileChange(null)
      return
    }

    // Validate image format by MIME type or file extension (handles Windows registry edge cases)
    const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|svg|bmp|ico)$/i.test(file.name)
    const isImageType = file.type ? file.type.toLowerCase().startsWith('image/') : hasImageExtension

    if (!isImageType && !hasImageExtension) {
      setFileError('Invalid file format. Please upload an image file (PNG, JPG, WEBP, GIF, SVG).')
      if (inputRef.current) inputRef.current.value = ''
      onFileChange(null)
      return
    }

    // Validate image file size / limit
    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      const selectedMB = (file.size / (1024 * 1024)).toFixed(2)
      setFileError(`File size (${selectedMB} MB) exceeds maximum allowed limit of ${maxSizeMB} MB. Please upload a compressed image.`)
      if (inputRef.current) inputRef.current.value = ''
      onFileChange(null)
      return
    }

    setFileError(null)
    onFileChange(file)
  }

  const handleRemove = () => {
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
    onFileChange(null)
    onRemove?.()
  }

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] ?? null
    validateAndSelectFile(file)
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[var(--ui-text)]">{label}</span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
          Max quality / limit: <strong className="text-slate-800 font-bold">{maxSizeMB} MB</strong> (JPG, PNG, WEBP)
        </span>
      </div>

      <div className={`overflow-hidden rounded-xl border transition-all ${fileError ? 'border-red-400 ring-2 ring-red-400/20 bg-red-50/10' : isDragging ? 'border-[var(--ui-primary)] ring-2 ring-[var(--ui-primary)]/20 bg-blue-50/10' : 'border-[var(--ui-border)] bg-white'}`}>
        <button
          type="button"
          className={`relative block h-52 w-full overflow-hidden text-left transition-colors ${isDragging ? 'bg-[var(--ui-primary)]/5' : 'bg-[var(--ui-surface-muted)]'}`}
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt={previewAlt} className="h-full w-full object-contain p-2 max-w-md mx-auto pointer-events-none" />
          ) : (
            <div className="grid h-full place-items-center text-[var(--ui-muted)] pointer-events-none">
              <div className="flex flex-col items-center gap-2 text-sm">
                <FiImage size={20} className={isDragging ? 'text-[var(--ui-primary)] scale-110 transition-transform' : ''} />
                <span className={isDragging ? 'text-[var(--ui-primary)] font-medium' : ''}>{isDragging ? 'Drop image here' : emptyText}</span>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/40 to-transparent px-3 py-2 text-xs text-white">
            <span className="font-semibold uppercase tracking-wide">
              {selectedFile ? 'New Preview' : previewUrl ? 'Current Image' : 'No Image'}
            </span>
          </div>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            validateAndSelectFile(file)
          }}
        />

        <div className="flex items-center justify-between gap-2 border-t border-[var(--ui-border)] px-3 py-2">
          <p className="truncate text-xs text-[var(--ui-muted)]">
            {selectedFile ? selectedFile.name : previewUrl ? 'Using saved image' : 'No image selected'}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-[var(--ui-border)] px-2.5 text-xs font-medium text-[var(--ui-text)] hover:bg-[var(--ui-surface-muted)]"
              onClick={openFilePicker}
            >
              <FiUpload size={12} />
              {previewUrl ? 'Replace' : 'Upload'}
            </button>

            {previewUrl ? (
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-md border border-red-200 px-2.5 text-xs font-medium text-red-700 hover:bg-red-50"
                onClick={handleRemove}
              >
                <FiTrash2 size={12} />
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {fileError ? (
        <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
          <FiAlertTriangle className="shrink-0 mt-0.5 text-red-600" size={15} />
          <span>{fileError}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-[var(--ui-muted)]">{helperText}</p>
      ) : null}
    </div>
  )
}