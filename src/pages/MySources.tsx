import { useState } from 'react'
import { useUserSources } from '../hooks/useUserSources'
import { useClubs } from '../hooks/useClubs'
import { SourceCard } from '../components/SourceCard'
import { FloatingAddButton } from '../components/FloatingAddButton'
import { AddSourceModal } from '../components/AddSourceModal'
import { Filter, Loader2 } from 'lucide-react'

export function MySources() {
    const { sources, loading, refetch } = useUserSources()
    const { clubs } = useClubs()
    const [filterClubId, setFilterClubId] = useState<string | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredSources = filterClubId
        ? sources.filter(s => s.club_id === filterClubId)
        : sources

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Mes sources</h1>
                <p className="text-slate-400 mt-1">
                    Toutes les sources que tu as partagées
                </p>
            </div>

            {/* Club Filter */}
            {clubs.length > 1 && sources.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <button
                        onClick={() => setFilterClubId(undefined)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${!filterClubId
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                            }`}
                    >
                        Tous les clubs ({sources.length})
                    </button>
                    {clubs.map((club) => {
                        const count = sources.filter(s => s.club_id === club.id).length
                        if (count === 0) return null
                        return (
                            <button
                                key={club.id}
                                onClick={() => setFilterClubId(club.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterClubId === club.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                                    }`}
                            >
                                {club.icon} {club.name} ({count})
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Sources List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : filteredSources.length > 0 ? (
                <div className="grid gap-4">
                    {filteredSources.map((source) => (
                        <SourceCard
                            key={source.id}
                            source={source}
                            showClubPill={true}
                        />
                    ))}
                </div>
            ) : sources.length > 0 ? (
                <div className="text-center py-12 text-slate-400">
                    Aucune source dans ce club.
                </div>
            ) : (
                <div className="text-center py-12 space-y-4">
                    <div className="text-6xl">📚</div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">
                            Aucune source pour le moment
                        </h3>
                        <p className="text-slate-400">
                            Tu n'as pas encore partagé de source. Clique sur + pour commencer !
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
