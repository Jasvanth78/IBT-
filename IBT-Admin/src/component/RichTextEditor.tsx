import { useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { FiUpload } from 'react-icons/fi'
import { cx } from '../utils/cx'
import { Modal } from './Modal'
import { Toast } from './Toast'
import { Loader } from './Loader'
import { importBlogDocument } from '../api/blogsMaster'

type RichTextEditorProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  helperText?: string
  error?: string
  minHeight?: number
  disabled?: boolean
  className?: string
  showPreview?: boolean // kept for backward compatibility if any form spreads it, but unused
  showImportButton?: boolean
}

function isContentEmpty(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim().length === 0
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write your content...',
  helperText,
  error,
  minHeight = 220,
  disabled = false,
  className,
  showImportButton = false,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Importer states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success')
  const [toastTitle, setToastTitle] = useState('')

  const modules = useMemo(
    () => ({
      toolbar: [
        // Heading and Font Styles
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],

        // Text Styles
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],

        // Lists and Alignment
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        // Inserts
        ['link', 'blockquote', 'code-block'],

        // Clear formatting
        ['clean'],
      ],
    }),
    [],
  )

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset file input value
    event.target.value = ''

    // Validate file type
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    if (extension !== '.docx' && extension !== '.pdf') {
      setToastVariant('error')
      setToastTitle('Unsupported File')
      setToastMessage('Only PDF and DOCX files are allowed for import.')
      setToastOpen(true)
      return
    }

    // Validate size limit (10MB)
    const limit = 10 * 1024 * 1024
    if (file.size > limit) {
      setToastVariant('error')
      setToastTitle('File Too Large')
      setToastMessage('The uploaded file exceeds the maximum allowed size of 10MB.')
      setToastOpen(true)
      return
    }

    // Overwrite check
    if (value && !isContentEmpty(value)) {
      setPendingFile(file)
      setIsConfirmOpen(true)
    } else {
      await startImport(file)
    }
  }

  const startImport = async (file: File) => {
    setIsUploading(true)
    setUploadPercent(0)
    setUploadStatus('Uploading document...')

    try {
      const response = await importBlogDocument(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadPercent(percent)
        if (percent === 100) {
          setUploadStatus('Processing and extracting images on server...')
        } else {
          setUploadStatus(`Uploading document... ${percent}%`)
        }
      })

      if (response && response.html) {
        onChange(response.html)

        setToastVariant('success')
        setToastTitle('Document Imported')
        if (response.warnings && response.warnings.length > 0) {
          setToastMessage(`Document imported successfully with warnings:\n${response.warnings.map((w: string) => `• ${w}`).join('\n')}`)
        } else {
          setToastMessage('Your document content and images have been successfully imported.')
        }
        setToastOpen(true)
      } else {
        throw new Error('Server returned empty layout content.')
      }
    } catch (error: any) {
      console.error('Import error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred during document import.'
      setToastVariant('error')
      setToastTitle('Import Failed')
      setToastMessage(errorMsg)
      setToastOpen(true)
    } finally {
      setIsUploading(false)
      setPendingFile(null)
    }
  }

  return (
    <div className={cx('grid gap-1.5', className)}>
      <div className="flex items-center justify-between">
        {label ? <span className="text-sm font-semibold text-[var(--ui-text)]">{label}</span> : <span />}
        
        {showImportButton && (
          <>
            <button
              type="button"
              onClick={handleImportClick}
              disabled={disabled}
              className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-[var(--ui-radius-md)] border font-semibold transition-colors duration-150 h-8 px-3 text-xs border-[var(--ui-border)] bg-white text-[var(--ui-text)] hover:bg-[var(--ui-surface-muted)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUpload size={13} />
              Import Docx / PDF
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".docx,.pdf"
              className="hidden"
            />
          </>
        )}
      </div>

      <div
        className={cx(
          'rounded-lg border bg-white overflow-hidden',
          error ? 'border-[var(--ui-danger)]' : 'border-[var(--ui-border)]',
          disabled && 'opacity-70 pointer-events-none'
        )}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          readOnly={disabled}
          className="qb-editor-wrapper"
          style={{ minHeight: `${minHeight}px` }}
        />
      </div>

      <style>{`
        .qb-editor-wrapper .ql-container {
          font-family: inherit;
          font-size: 0.875rem;
          min-height: ${minHeight}px;
          border: none !important;
        }
        .qb-editor-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--ui-border) !important;
          background-color: var(--ui-surface);
        }
        .qb-editor-wrapper .ql-editor {
          min-height: ${minHeight}px;
          color: var(--ui-text);
        }
        .qb-editor-wrapper .ql-editor p {
          margin-bottom: 0.75rem;
        }
      `}</style>

      {error ? <span className="text-xs font-medium text-[var(--ui-danger)]">{error}</span> : null}
      {!error && helperText ? <span className="text-xs text-[var(--ui-muted)]">{helperText}</span> : null}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        title="Overwrite Content?"
        onClose={() => {
          setIsConfirmOpen(false)
          setPendingFile(null)
        }}
        footer={
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsConfirmOpen(false)
                setPendingFile(null)
              }}
              className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--ui-border)] hover:bg-[var(--ui-surface-muted)] text-[var(--ui-text)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsConfirmOpen(false)
                if (pendingFile) {
                  await startImport(pendingFile)
                }
              }}
              className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--ui-primary)] text-white hover:bg-[var(--ui-primary-strong)]"
            >
              Overwrite
            </button>
          </div>
        }
      >
        <p className="text-sm text-[var(--ui-text-muted)]">
          The editor currently contains content. Importing a new document will completely replace the current text.
          Are you sure you want to proceed?
        </p>
      </Modal>

      {/* Upload & Progress Modal */}
      <Modal
        isOpen={isUploading}
        title="Importing Document"
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <div className="flex flex-col items-center justify-center py-6">
          <Loader size="lg" className="border-t-[var(--ui-primary)]" />
          <p className="mt-4 text-sm font-semibold text-[var(--ui-text)]">{uploadStatus}</p>
          <div className="w-full bg-[var(--ui-surface-muted)] h-2 rounded-full mt-4 overflow-hidden max-w-xs">
            <div
              className="bg-[var(--ui-primary)] h-full transition-all duration-150"
              style={{ width: `${uploadPercent}%` }}
            />
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        open={toastOpen}
        message={toastMessage}
        title={toastTitle}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}
