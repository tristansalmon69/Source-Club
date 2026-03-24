import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { StarRating } from './ui/StarRating'
import { CategoryBadge } from './ui/CategoryBadge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { fetchMetadata } from '../lib/metadataExtractor'
import { detectCategory, CATEGORIES, type Category } from '../lib/categoryDetection'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthProvider'
import { useClubs } from '../hooks/useClubs'

interface AddSourceModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    preselectedClubId?: string
    initialUrl?: string
}

export function AddSourceModal({ isOpen, onClose, onSuccess, preselectedClubId, initialUrl }: AddSourceModalProps) {
    const { user } = useAuth()
    const { clubs } = useClubs()
    const [url, setUrl] = useState(initialUrl || '')
    const [personalNote, setPersonalNote] = useState('')
    const [rating, setRating] = useState<number | null>(null)
    const [category, setCategory] = useState<Category>('Autre')

    // Automatically set URL when modal opens via ShareTarget
    useEffect(() => {
        if (isOpen && initialUrl) {
            setUrl(initialUrl)
        }
    }, [isOpen, initialUrl])

    // Club selection with pre-selection logic
    const getInitialClubId = () => {
        if (preselectedClubId) return preselectedClubId
        const lastUsed = localStorage.getItem('lastUsedClubId')
        if (lastUsed && clubs.some(c => c.id === lastUsed)) return lastUsed
        return clubs[0]?.id || ''
    }
    const [selectedClubId, setSelectedClubId] = useState<string>(getInitialClubId())

    const [metadata, setMetadata] = useState<{
        title: string | null
        description: string | null
        thumbnail: string | null
        domain: string
    } | null>(null)

    const [loading, setLoading] = useState(false)
    const [fetchingMetadata, setFetchingMetadata] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUrlBlur = async () => {
        if (!url || url === metadata?.domain) return

        setFetchingMetadata(true)
        setError(null)

        try {
            const data = await fetchMetadata(url)
            setMetadata(data)

            // Auto-detect category
            const detectedCategory = detectCategory(url, data.title || undefined)
            setCategory(detectedCategory)
        } catch (err) {
            setError('Impossible de récupérer les informations de cette URL')
        } finally {
            setFetchingMetadata(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url || !user) return

        setLoading(true)
        setError(null)

        try {
            const { error: insertError } = await supabase
                .from('sources')
                .insert({
                    user_id: user.id,
                    club_id: selectedClubId || clubs[0]?.id,
                    url,
                    title: metadata?.title,
                    description: metadata?.description,
                    thumbnail: metadata?.thumbnail,
                    domain: metadata?.domain || new URL(url).hostname,
                    category: category,
                    personal_note: personalNote || null,
                    rating: rating
                })

            if (insertError) throw insertError

            // Save last used club to localStorage
            if (selectedClubId) {
                localStorage.setItem('lastUsedClubId', selectedClubId)
            }

            // Reset form
            setUrl('')
            setPersonalNote('')
            setRating(null)
            setCategory('Autre')
            setMetadata(null)

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'ajout de la source')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-[#0a0a0f] md:bg-black/50 md:backdrop-blur-sm">
            <Card className="w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] overflow-y-auto rounded-none md:rounded-xl border-0 md:border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ajouter une source</CardTitle>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL *</label>
                            <Input
                                type="url"
                                placeholder="https://example.com/article"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onBlur={handleUrlBlur}
                                required
                            />
                            {fetchingMetadata && (
                                <p className="text-sm text-slate-400 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Récupération des informations...
                                </p>
                            )}
                        </div>

                        {/* Metadata Preview */}
                        {metadata && (
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 space-y-2">
                                {metadata.thumbnail && (
                                    <img
                                        src={metadata.thumbnail}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                        }}
                                    />
                                )}
                                <div>
                                    <p className="font-medium text-slate-200">
                                        {metadata.title || metadata.domain}
                                    </p>
                                    {metadata.description && (
                                        <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                                            {metadata.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Club Selector */}
                        {clubs.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Partager dans : *</label>
                                <select
                                    value={selectedClubId || clubs[0]?.id}
                                    onChange={(e) => setSelectedClubId(e.target.value)}
                                    className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {clubs.map((club) => (
                                        <option key={club.id} value={club.id}>
                                            {club.icon} {club.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Catégorie</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <CategoryBadge category={category} />
                        </div>

                        {/* Personal Note */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Commentaire (optionnel)</label>
                            <textarea
                                placeholder="Pourquoi tu recommandes cette source ?"
                                value={personalNote}
                                onChange={(e) => setPersonalNote(e.target.value)}
                                rows={3}
                                className="flex w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note (optionnel)</label>
                            <StarRating value={rating} onChange={setRating} />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !url}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Ajout...
                                    </>
                                ) : (
                                    'Ajouter'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
