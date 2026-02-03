import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { ClubSidebar } from './ClubSidebar'
import { BottomNav } from './BottomNav'
import { AddSourceModal } from '../AddSourceModal'

export function Layout() {
    const { signOut } = useAuth()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    return (
        <div className="flex h-screen bg-[#0a0a0f] text-slate-100">
            {/* Club Sidebar - Desktop Only */}
            <div className="hidden md:flex">
                <ClubSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-[#0a0a0f]/95 backdrop-blur-sm p-4 sticky top-0 z-20">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        SourceClub
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between border-b border-slate-800 bg-[#0a0a0f] p-6 sticky top-0 z-20">
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

            {/* Bottom Navigation - Mobile Only */}
            <BottomNav onAddClick={() => setIsAddModalOpen(true)} />

            {/* Global Add Source Modal (triggered from BottomNav) */}
            <AddSourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    // Refetch logic might need context or event bus if we want global refresh
                    // For now, simple close. The feed won't auto-refresh unless we pass a refresh callback 
                    // or rely on the query invalidation if we used react-query (here it's custom hooks).
                    // We might need to expose context for triggering refetch later.
                    setIsAddModalOpen(false)
                    window.location.reload() // Temporary dirty fix to ensure feed updates until Context/Query is set up
                }}
            />
        </div>
    )
}
