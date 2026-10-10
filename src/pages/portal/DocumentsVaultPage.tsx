import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { DocumentItem } from '@/mock/types'
import { formatDate } from '@/lib/format'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { mockApi } from '@/mock/api'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  UploadCloud,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FolderLock,
  Layers,
  FileSpreadsheet,
  FileArchive,
} from 'lucide-react'

export const DocumentsVaultPage: React.FC = () => {
  const { documents, uploadDocument, addToast } = useStore()

  const [activeTab, setActiveTab] = useState<'all' | 'tendervantage' | 'client'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Upload dropzone states
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')

  // Preview Drawer
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileDrop = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setUploadError('')

    // Validate size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('This file is over 20MB. Compress or split it and try again.')
      return
    }

    // Validate extension
    const ext = file.name.split('.').pop()?.toUpperCase()
    if (!['PDF', 'DOCX', 'XLSX', 'JPG', 'PNG', 'ZIP'].includes(ext || '')) {
      setUploadError('This file type is not supported. Please upload PDF, Word, Excel, or ZIP.')
      return
    }

    // Mock progress bar
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            uploadDocument({
              name: file.name,
              sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              sizeBytes: file.size,
              fileType: (ext as any) || 'PDF',
              source: 'client',
            })
          }, 400)
          return 100
        }
        return prev + 25
      })
    }, 300)
  }

  const handleDownload = async (doc: DocumentItem) => {
    try {
      await mockApi.downloadFile(doc.name)
      addToast({
        type: 'success',
        title: 'Document downloaded',
        message: `${doc.name} saved to local device.`,
      })
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Download failed',
        message: err.message,
      })
    }
  }

  // Filter documents
  const filteredDocs = documents.filter((d) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'tendervantage' && d.source === 'tendervantage') ||
      (activeTab === 'client' && d.source === 'client')

    const matchesType = typeFilter === 'all' || d.fileType === typeFilter

    const matchesSearch =
      !searchQuery.trim() ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.orderNumber && d.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesType && matchesSearch
  })

  const getFileIcon = (type: string) => {
    if (type === 'XLSX') return <FileSpreadsheet className="w-4 h-4 text-[#3E7A5B]" />
    if (type === 'ZIP') return <FileArchive className="w-4 h-4 text-[#B8864B]" />
    return <FileText className="w-4 h-4 text-[#3F6C8C]" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E3DDD0]">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            DOCUMENT REPOSITORY
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#17323A] mt-1">
            Documents Vault
          </h1>
          <p className="text-xs text-[#6F7A78] mt-1">
            Encrypted storage for corporate returnables, proposal drafts, and final packs.
          </p>
        </div>

        <BuildMapTag
          label="Documents Module"
          wpEquivalent="WP Customer Area Private Files"
          position="top-left"
        />
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFileDrop(e.dataTransfer.files)
        }}
        className={`p-8 rounded-[12px] border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${
          isDragging
            ? 'border-[#17323A] bg-[#EFEADF]'
            : 'border-[#CFC7B6] bg-white hover:border-[#17323A]'
        }`}
        onClick={() => document.getElementById('vault-file-upload')?.click()}
      >
        <input
          id="vault-file-upload"
          type="file"
          className="hidden"
          onChange={(e) => handleFileDrop(e.target.files)}
        />

        <UploadCloud className="w-8 h-8 text-[#5E7F78] mx-auto" />

        {isUploading ? (
          <div className="max-w-xs mx-auto space-y-2">
            <div className="text-xs font-semibold text-[#17323A]">
              Uploading document to secure vault... {uploadProgress}%
            </div>
            <div className="w-full h-1.5 bg-[#E3DDD0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3F6C8C] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-semibold text-[#17323A]">
              Drag and drop tender files here, or browse
            </div>
            <p className="text-xs text-[#6F7A78] mt-1">
              Supports PDF, DOCX, XLSX, JPG, PNG, and ZIP up to 20MB. Encrypted in private vault.
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-[#A94438] font-semibold flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{uploadError}</span>
          </p>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Source Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E3DDD0] pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              activeTab === 'all'
                ? 'bg-[#17323A] text-white'
                : 'text-[#4A5755] hover:bg-[#EFEADF]'
            }`}
          >
            All Files ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tendervantage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              activeTab === 'tendervantage'
                ? 'bg-[#17323A] text-white'
                : 'text-[#4A5755] hover:bg-[#EFEADF]'
            }`}
          >
            From TenderVantage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              activeTab === 'client'
                ? 'bg-[#17323A] text-white'
                : 'text-[#4A5755] hover:bg-[#EFEADF]'
            }`}
          >
            Your Uploads
          </button>
        </div>

        {/* Search & Type Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6F7A78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="h-9 pl-8 pr-3 rounded-[6px] bg-white border border-[#CFC7B6] text-xs text-[#1B2625] focus:outline-none focus:border-[#17323A]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-2.5 rounded-[6px] bg-white border border-[#CFC7B6] text-xs font-semibold text-[#17323A] focus:outline-none cursor-pointer"
          >
            <option value="all">All types</option>
            <option value="PDF">PDF</option>
            <option value="XLSX">Excel</option>
            <option value="DOCX">Word</option>
            <option value="ZIP">ZIP</option>
          </select>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-[12px] border border-[#E3DDD0] overflow-hidden shadow-xs divide-y divide-[#E3DDD0]">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6F7A78]">
            No documents match your filters.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#FBF9F4] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-[6px] bg-[#FBF9F4] border border-[#E3DDD0] flex items-center justify-center shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>

                <div className="truncate">
                  <div className="font-semibold text-xs text-[#17323A] truncate">
                    {doc.name}
                  </div>
                  <div className="text-[11px] text-[#6F7A78] mt-0.5">
                    {doc.orderNumber ? `${doc.orderNumber} · ` : ''}
                    {doc.sizeFormatted} · Uploaded {formatDate(doc.uploadedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="px-2.5 py-1 rounded text-xs text-[#5E7F78] hover:text-[#17323A] hover:bg-[#EFEADF] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="p-1.5 rounded hover:bg-[#EFEADF] text-[#17323A] transition-colors cursor-pointer"
                  aria-label={`Download ${doc.name}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* File Preview Drawer */}
      {previewDoc && (
        <Drawer
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          description={`${previewDoc.sizeFormatted} · ${previewDoc.fileType}`}
          width="md"
        >
          <div className="space-y-6 text-xs">
            {/* Faux Document Preview (grey SVG bars per PRD Section 11.5) */}
            <div className="aspect-[4/5] bg-white rounded-[8px] border border-[#E3DDD0] p-6 shadow-sm flex flex-col justify-between select-none">
              <div className="space-y-4">
                <div className="h-4 bg-[#17323A] rounded w-3/4" />
                <div className="space-y-2 pt-2">
                  <div className="h-2 bg-[#E3DDD0] rounded w-full" />
                  <div className="h-2 bg-[#E3DDD0] rounded w-5/6" />
                  <div className="h-2 bg-[#E3DDD0] rounded w-4/5" />
                  <div className="h-2 bg-[#E3DDD0] rounded w-full" />
                </div>
                <div className="pt-4 space-y-2">
                  <div className="h-2.5 bg-[#B8864B]/40 rounded w-1/2" />
                  <div className="h-2 bg-[#E3DDD0] rounded w-full" />
                  <div className="h-2 bg-[#E3DDD0] rounded w-2/3" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3DDD0] flex justify-between text-[10px] text-[#6F7A78] font-mono">
                <span>TenderVantage Private Vault</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="p-4 bg-[#FBF9F4] rounded-[8px] border border-[#E3DDD0] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6F7A78]">Source:</span>
                <span className="font-semibold text-[#17323A]">
                  {previewDoc.source === 'tendervantage' ? 'TenderVantage' : 'Client Upload'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F7A78]">Category:</span>
                <span className="font-semibold text-[#17323A] uppercase font-mono">
                  {previewDoc.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F7A78]">Uploaded Date:</span>
                <span className="font-mono text-[#17323A]">{formatDate(previewDoc.uploadedAt)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => handleDownload(previewDoc)}
              className="w-full"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download File
            </Button>
          </div>
        </Drawer>
      )}
    </div>
  )
}
