import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, Link as LinkIcon, Menu, X, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useClubs } from '../../hooks/useClubs'
import { cn } from '../../lib/utils'

export function ClubSidebar() {
    const location = useLocation()
    const { clubs, loading } = useClubs()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Main Navigation */}
            <div className="space-y-1">
                <Link
                    to="/"
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive('/')
                            ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )}
                >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Feed global</span>
                </Link>

                <Link
                    to="/my-sources"
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive('/my-sources')
                            ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )}
                >
                    <Search className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Mes sources</span>
                </Link>

                <Link
                    to="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive('/profile')
                            ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )}
                >
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Mon profil</span>
                </Link>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-800" />

            {/* Clubs Section */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Mes clubs
                </div>
                <div className="space-y-1 mt-2">
                    {loading ? (
                        <div className="px-4 py-2 text-sm text-slate-500">Chargement...</div>
                    ) : clubs.length > 0 ? (
                        clubs.map((club) => (
                            <Link
                                key={club.id}
                                to={`/clubs/${club.id}`}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                    isActive(`/clubs/${club.id}`)
                                        ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                )}
                            >
                                <span className="text-xl flex-shrink-0">{club.icon}</span>
                                <span className="font-medium truncate">{club.name}</span>
                            </Link>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-slate-500">
                            Aucun club pour le moment
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-800" />

            {/* Actions */}
            <div className="space-y-1">
                <Link
                    to="/clubs/new"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                    <Plus className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Créer un club</span>
                </Link>
                <Link
                    to="/clubs/join"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                >
                    <LinkIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Rejoindre un club</span>
                </Link>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-100"
            >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed md:static inset-y-0 left-0 z-40 w-60 bg-slate-900 border-r border-slate-800 p-4 transition-transform md:translate-x-0',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {sidebarContent}
            </aside>
        </>
    )
}
