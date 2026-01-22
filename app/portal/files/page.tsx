'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface FileItem {
  key: string
  filename: string
  size: number
  uploaded: string
  url: string
}

export default function FilesPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/portal/auth/session')
      .then(res => res.json() as Promise<{ authenticated?: boolean; customer?: { id: string } }>)
      .then(data => {
        if (data.authenticated && data.customer) {
          setCustomerId(data.customer.id)
          fetchFiles(data.customer.id)
        } else {
          router.push('/portal/login')
        }
      })
      .catch(() => router.push('/portal/login'))
  }, [router])

  const fetchFiles = async (custId: string) => {
    try {
      const res = await fetch(`/api/files/list?customerId=${custId}`)
      const data = await res.json() as { files?: FileItem[] }
      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !customerId) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('customerId', customerId)

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        fetchFiles(customerId)
      } else {
        const data = await res.json() as { error?: string }
        alert(data.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (key: string) => {
    if (!confirm('Delete this file?')) return

    try {
      await fetch(`/api/files/${key}`, { method: 'DELETE' })
      if (customerId) fetchFiles(customerId)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    return imageExts.includes(ext || '') ? PhotoIcon : DocumentIcon
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6a8c8c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/portal" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              accept="image/*,.pdf,.ai,.eps,.psd"
              className="hidden"
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
              style={{ background: uploading ? '#999' : 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)' }}
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </span>
          </label>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Upload your logos, artwork, and design files here. Supported: Images (JPG, PNG, SVG), PDF, AI, EPS, PSD. Max 10MB.
        </p>

        {files.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
            <CloudArrowUpIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Files Yet</h2>
            <p className="text-gray-500 mb-6">Upload your logos and artwork to use in future orders.</p>
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleUpload}
                accept="image/*,.pdf,.ai,.eps,.psd"
                className="hidden"
              />
              <span
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)' }}
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                Upload Your First File
              </span>
            </label>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {files.map(file => {
                const FileIcon = getFileIcon(file.filename)
                return (
                  <div key={file.key} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} &middot; {new Date(file.uploaded).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        download
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(file.key)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
