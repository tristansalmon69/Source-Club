import { Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { ClubSidebar } from './ClubSidebar'

export function Layout() {
    const { signOut } = useAuth()

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100">
            {/* Club Sidebar */}
            <ClubSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-900 p-4 sticky top-0 z-10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent ml-12">
                        SourceClub
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between border-b border-slate-800 bg-slate-900 p-6 sticky top-0 z-10">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        SourceClub
                    </h1>
                    <Button variant="ghost" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5 mr-2" />
                        Déconnexion
                    </Button>
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
