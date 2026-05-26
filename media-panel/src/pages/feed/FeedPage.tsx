import { useState, useEffect, useRef } from 'react'
import { Trash2, Send } from 'lucide-react'
import type { Role } from '../../types/media.types'
import { feedService } from '../../services/feed.service'

interface FeedPageProps {
  role: Role
}

interface FeedPost {
  id: string
  type: string
  title: string
  body: string
  imageUrl?: string
  createdAt: string
  createdBy?: {
    name?: string
    email?: string
  }
}

const FEED_TYPES = ['ANNOUNCEMENT', 'DEVOTIONAL', 'SERMON']

export default function FeedPage({ role }: FeedPageProps) {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [type, setType] = useState<string>('ANNOUNCEMENT')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await feedService.getAll()
        setPosts(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load feed posts'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !body) {
      alert('Please fill in title and body')
      return
    }

    setSubmitting(true)
    try {
      await feedService.create({
        type,
        title,
        body,
        imageUrl: imageUrl || undefined,
      })
      // Refetch to get the full list
      const data = await feedService.getAll()
      setPosts(data)
      // Clear form
      setTitle('')
      setBody('')
      setImageUrl('')
      setType('ANNOUNCEMENT')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post'
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await feedService.delete(postId)
      // Refetch to get updated list
      const data = await feedService.getAll()
      setPosts(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete post'
      alert(message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getTypeColor = (postType: string): string => {
    switch (postType) {
      case 'ANNOUNCEMENT':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'DEVOTIONAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'SERMON':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const showSermonOption = role === 'Pastor' || role === 'Admin'
  const displayTypes = showSermonOption ? FEED_TYPES : ['ANNOUNCEMENT', 'DEVOTIONAL']

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-3xl font-bold">Feed Management</h1>
        <p className="text-slate-400 mt-1">Create and manage feed posts</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6 space-y-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {/* Create Post Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Post Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {displayTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Title input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Body textarea */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-2">
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter post content"
                rows={5}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Image input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-500 py-2">or</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg text-sm transition"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    setUploading(true)
                    try {
                      const result = await feedService.uploadImage(file)
                      setImageUrl(result.url)
                    } catch (err) {
                      const message = err instanceof Error ? err.message : 'Upload failed'
                      alert(message)
                    } finally {
                      setUploading(false)
                    }
                  }}
                />
              </div>
              {imageUrl && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-20 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>

        {/* Posts list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-slate-400 py-8">No posts yet. Create one to get started!</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition"
                >
                  {/* Post header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 border rounded ${getTypeColor(post.type)}`}>
                          {post.type.charAt(0) + post.type.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="ml-4 p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post body */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.body}</p>

                  {/* Post image if available */}
                  {post.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-slate-800 max-h-48">
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = ''
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Post metadata */}
                  {post.createdBy && (
                    <div className="text-xs text-slate-500">
                      by {post.createdBy.name || post.createdBy.email || 'Unknown'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
