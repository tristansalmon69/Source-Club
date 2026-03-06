import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useClub } from '../../hooks/useClub'
import { useClubSources } from '../../hooks/useClubSources'
import { SourceCard } from '../../components/SourceCard'
import { Button } from '../../components/ui/Button'
import { InviteModal } from '../../components/InviteModal'
import { ClubSettingsModal } from '../../components/ClubSettingsModal'
import { Users, Settings, Loader2 } from 'lucide-react'
import { useAuth } from '../../components/AuthProvider'

export function ClubDetail() {
    const { clubId } = useParams<{ clubId: string }>()
    const { user } = useAuth()
    const { club, loading: clubLoading, refetch } = useClub(clubId)
    const { sources, loading: sourcesLoading } = useClubSources(clubId)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)

    if (clubLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    if (!club) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Club introuvable</p>
            </div>
        )
    }

    const isAdmin = club.members.find(m => m.user_id === user?.id)?.role === 'admin'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-5xl">{club.icon}</div>
                    <div>
                        <h1 className="text-3xl font-bold">{club.name}</h1>
                        {club.description && (
                            <p className="text-slate-400 mt-1">{club.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {club.member_count} membre{club.member_count > 1 ? 's' : ''}
                            </span>
                            {club.theme && <span>• {club.theme}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => setShowInviteModal(true)}>
                        Inviter
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettingsModal(true)}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Members Section (optional, can be sidebar) */}
            {club.members && club.members.length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Membres</h3>
                    <div className="flex flex-wrap gap-3">
                        {club.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2"
                            >
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium">
                                    {member.profile?.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{member.profile?.username || 'Unknown'}</p>
                                    {member.role === 'admin' && (
                                        <span className="text-xs text-indigo-400">Admin</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sources */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Sources ({sources.length})
                </h2>

                {sourcesLoading ? (
                    <div className="text-center py-12 text-slate-400">
                        Chargement...
                    </div>
                ) : sources.length > 0 ? (
                    <div className="grid gap-4">
                        {sources.map((source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                showClubPill={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 space-y-4">
                        <div className="text-6xl">📚</div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">
                                Aucune source pour le moment
                            </h3>
                            <p className="text-slate-400">
                                Sois le premier à partager une source dans ce club !
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                inviteCode={club.invite_code}
                clubName={club.name}
            />

            {/* Settings Modal */}
            <ClubSettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                club={club}
                isAdmin={isAdmin}
                onSuccess={() => {
                    refetch()
                    setShowSettingsModal(false)
                }}
            />
        </div>
    )
}
