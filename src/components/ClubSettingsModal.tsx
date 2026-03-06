import { useState, useEffect } from 'react'
import { X, LogOut, Trash2, Edit2, Link, Users, Check, AlertTriangle } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useClubMutations } from '../hooks/useClubMutations'
import { useNavigate } from 'react-router-dom'
import type { Club, ClubMember, Profile } from '../types/database'

interface ClubSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    club: Club & { members: (ClubMember & { profile: Profile })[]; member_count: number }
    isAdmin: boolean
    onSuccess: () => void
}

export function ClubSettingsModal({ isOpen, onClose, club, isAdmin, onSuccess }: ClubSettingsModalProps) {
    const navigate = useNavigate()
    const { updateClub, deleteClub, leaveClub, loading } = useClubMutations()
    const [view, setView] = useState<'main' | 'edit' | 'members' | 'confirmLeave' | 'confirmDelete'>('main')
    const [copied, setCopied] = useState(false)

    // Edit states
    const [name, setName] = useState(club.name)
    const [icon, setIcon] = useState(club.icon || '🔥')
    const [description, setDescription] = useState(club.description || '')

    useEffect(() => {
        if (isOpen) {
            setView('main')
            setName(club.name)
            setIcon(club.icon || '🔥')
            setDescription(club.description || '')
        }
    }, [isOpen, club])

    if (!isOpen) return null

    const handleCopyInvite = async () => {
        const inviteUrl = `${window.location.origin}/join?code=${club.invite_code}`
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleUpdate = async () => {
        const success = await updateClub(club.id, { name, icon, description })
        if (success) {
            onSuccess()
            setView('main')
        }
    }

    const handleDelete = async () => {
        const success = await deleteClub(club.id)
        if (success) {
            onClose()
            navigate('/')
        }
    }

    const handleLeave = async () => {
        const success = await leaveClub(club.id)
        if (success) {
            onClose()
            navigate('/')
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#1a1a2e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-slate-100 italic">
                        {view === 'main' && 'Paramètres du Club'}
                        {view === 'edit' && 'Modifier le Club'}
                        {view === 'members' && 'Membres'}
                        {view === 'confirmLeave' && 'Quitter le Club ?'}
                        {view === 'confirmDelete' && 'Supprimer le Club ?'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto">
                    {view === 'main' && (
                        <div className="space-y-2">
                            {/* Admin Actions */}
                            {isAdmin && (
                                <button
                                    onClick={() => setView('edit')}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-100 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Edit2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Modifier les infos</p>
                                        <p className="text-xs text-slate-400">Nom, icône, description</p>
                                    </div>
                                </button>
                            )}

                            {/* Common Actions */}
                            <button
                                onClick={() => setView('members')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-100 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Voir les membres</p>
                                    <p className="text-xs text-slate-400">{club.member_count} personnes</p>
                                </div>
                            </button>

                            <button
                                onClick={handleCopyInvite}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-100 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                                    {copied ? <Check className="h-5 w-5" /> : <Link className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Inviter quelqu'un</p>
                                    <p className="text-xs text-slate-400">Copier le lien d'invitation</p>
                                </div>
                            </button>

                            {/* Destructive Actions */}
                            <div className="pt-2 border-t border-slate-800">
                                {!isAdmin ? (
                                    <button
                                        onClick={() => setView('confirmLeave')}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                            <LogOut className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Quitter le club</p>
                                            <p className="text-xs text-red-400/60">Tu ne verras plus ses sources</p>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setView('confirmDelete')}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                            <Trash2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-red-500">Supprimer le club</p>
                                            <p className="text-xs text-red-400/60">Action irréversible</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {view === 'edit' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Icône / Emoji</label>
                                <Input
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    placeholder="Ex: 🔥"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Nom du club</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nom du club"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-24 bg-[#0a0a0f] border border-slate-800 rounded-lg p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm"
                                    placeholder="À quoi sert ce club ?"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setView('main')}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    loading={loading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'members' && (
                        <div className="space-y-3">
                            {club.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                                            {member.profile?.username?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{member.profile?.username || 'Anonyme'}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{member.role}</p>
                                        </div>
                                    </div>
                                    {member.role === 'admin' && (
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                            Propriétaire
                                        </span>
                                    )}
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setView('main')}
                                className="w-full mt-2"
                            >
                                Retour
                            </Button>
                        </div>
                    )}

                    {(view === 'confirmLeave' || view === 'confirmDelete') && (
                        <div className="text-center py-4 space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <AlertTriangle className="h-10 w-10" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-100">Es-tu vraiment sûr ?</h3>
                                <p className="text-sm text-slate-400 mt-1 max-w-[200px] mx-auto">
                                    {view === 'confirmLeave'
                                        ? 'Tu perdras l\'accès à toutes les sources de ce club.'
                                        : 'Cette action supprimera toutes les sources et membres du club.'
                                    }
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setView('main')}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={view === 'confirmLeave' ? handleLeave : handleDelete}
                                    loading={loading}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                >
                                    {view === 'confirmLeave' ? 'Quitter le club' : 'Supprimer définitivement'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
