import { Home, Bookmark, Plus, Users, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

interface BottomNavProps {
    onAddClick: () => void
}

export function BottomNav({ onAddClick }: BottomNavProps) {
    const location = useLocation()
    const pathname = location.pathname

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true
        if (path !== '/' && pathname.startsWith(path)) return true
        return false
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f] border-t border-slate-800 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {/* Feed */}
                <Link
                    to="/"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1",
                        isActive('/') ? "text-indigo-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Feed</span>
                </Link>

                {/* My Sources */}
                <Link
                    to="/my-sources"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1",
                        isActive('/my-sources') ? "text-indigo-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Bookmark className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Favoris</span>
                </Link>

                {/* ADD BUTTON (FAB-like) */}
                <div className="relative -top-5">
                    <button
                        onClick={onAddClick}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-transform active:scale-95 border-4 border-[#0a0a0f]"
                    >
                        <Plus className="w-8 h-8" />
                    </button>
                </div>

                {/* Clubs */}
                <Link
                    to="/clubs/join" // Assuming this is the best entry point for "Clubs" if no dashboard for it
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1",
                        isActive('/clubs') ? "text-indigo-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Users className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Clubs</span>
                </Link>

                {/* Profile */}
                <Link
                    to="/profile"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1",
                        isActive('/profile') ? "text-indigo-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Profil</span>
                </Link>
            </div>
        </nav>
    )
}
