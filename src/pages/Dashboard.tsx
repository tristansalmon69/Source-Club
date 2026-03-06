import { useState } from 'react'
import { useGlobalFeed } from '../hooks/useGlobalFeed'
import { useClubs } from '../hooks/useClubs'
import { SourceCard } from '../components/SourceCard'
import { FloatingAddButton } from '../components/FloatingAddButton'
import { AddSourceModal } from '../components/AddSourceModal'
import { Filter, Loader2 } from 'lucide-react'

export function Dashboard() {
    const [filterClubId, setFilterClubId] = useState<string | undefined>(undefined)
    const { sources, loading, refetch } = useGlobalFeed(filterClubId)
    const { clubs } = useClubs()
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h1 className="text-3xl font-bold truncate">Feed global</h1>
                <p className="text-slate-400 mt-1 text-sm">
                    Découvre les sources partagées par tes clubs
                </p>
            </div>

            {/* Club Filter */}
            {clubs.length > 1 && (
                <div
                    className="sticky top-16 md:top-20 z-10 bg-[#0a0a0f]/95 backdrop-blur py-2 -mx-4 px-4 md:mx-0 md:px-0 flex items-center gap-2 border-b border-slate-800/50 md:border-none no-scrollbar"
                    style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
                >
                    <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <button
                        onClick={() => setFilterClubId(undefined)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${!filterClubId
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                            }`}
                    >
                        Tous les clubs
                    </button>
                    {clubs.map((club) => (
                        <button
                            key={club.id}
                            onClick={() => setFilterClubId(club.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterClubId === club.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                                }`}
                        >
                            {club.icon} {club.name}
                        </button>
                    ))}
                    {/* Spacer for horizontal scroll end padding */}
                    <div className="w-8 flex-shrink-0 h-1" aria-hidden="true" />
                </div>
            )}

            {/* Sources Feed */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : sources.length > 0 ? (
                <div className="grid gap-4">
                    {sources.map((source) => (
                        <SourceCard key={source.id} source={source} showClubPill={true} />
                    ))}
                </div>
            ) : clubs.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="text-6xl">🏠</div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">
                            Bienvenue sur SourceClub !
                        </h3>
                        <p className="text-slate-400 mb-4">
                            Tu n'as pas encore de club. Crée ou rejoins un club pour commencer à partager des sources.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 space-y-4">
                    <div className="text-6xl">📚</div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">
                            Aucune source pour le moment
                        </h3>
                        <p className="text-slate-400">
                            Sois le premier à partager une source dans tes clubs !
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Add Button */}
            <FloatingAddButton onClick={() => setIsModalOpen(true)} />

            {/* Add Source Modal */}
            <AddSourceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    refetch()
                    setIsModalOpen(false)
                }}
            />
        </div>
    )
}
