import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        SourceClub
                    </h1>
                    <p className="mt-2 text-slate-400">Partagez vos sources de confiance.</p>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
