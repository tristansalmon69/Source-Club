import { ExternalLink, Trash2, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryBadge } from './ui/CategoryBadge'
import { StarRating } from './ui/StarRating'
import { Card, CardContent } from './ui/Card'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { SourceWithDetails } from '../types/database'

interface SourceCardProps {
    source: SourceWithDetails
    onDelete?: (id: string) => void
    showClubPill?: boolean
}

export function SourceCard({ source, onDelete, showClubPill = true }: SourceCardProps) {
    const timeAgo = formatDistanceToNow(new Date(source.created_at), {
        addSuffix: true,
        locale: fr
    })

    const domain = source.domain || new URL(source.url).hostname

    return (
        <Card className="group hover:border-indigo-500/50 transition-all">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Thumbnail */}
                    {source.thumbnail ? (
                        <div className="flex-shrink-0 w-[60px] h-[60px] md:w-24 md:h-24 rounded-lg overflow-hidden bg-slate-700">
                            <img
                                src={source.thumbnail}
                                alt={source.title || domain || 'Source image'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex-shrink-0 w-[60px] h-[60px] md:w-24 md:h-24 rounded-lg bg-slate-700 flex items-center justify-center">
                            <ExternalLink className="h-6 w-6 md:h-8 md:w-8 text-slate-500" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Club Pill */}
                        {showClubPill && source.club && (
                            <Link
                                to={`/clubs/${source.club.id}`}
                                className="inline-flex items-center gap-2 bg-slate-700 rounded-full px-3 py-1 text-sm mb-2 hover:bg-slate-600 transition-colors"
                            >
                                <span>{source.club.icon}</span>
                                <span>{source.club.name}</span>
                            </Link>
                        )}

                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-100 line-clamp-2 mb-1">
                                    {source.title || source.url}
                                </h3>
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                                >
                                    {domain}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>

                            {onDelete && (
                                <button
                                    onClick={() => onDelete(source.id)}
                                    className="p-3 md:p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-full text-red-400 hover:text-red-300"
                                    title="Supprimer"
                                >
                                    <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                                </button>
                            )}
                        </div>

                        {source.description && (
                            <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                                {source.description}
                            </p>
                        )}

                        {source.personal_note && (
                            <p className="text-sm text-slate-300 italic mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-indigo-500">
                                "{source.personal_note}"
                            </p>
                        )}

                        <div className="flex items-center gap-3 flex-wrap">
                            {source.category && <CategoryBadge category={source.category as any} />}

                            {source.rating && (
                                <StarRating value={source.rating} readonly size="sm" />
                            )}

                            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
