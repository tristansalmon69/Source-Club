import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tighter italic">
                        Melting Pote
                    </h1>
                    <p className="mt-2 text-slate-400 italic">Bienvenue dans la marmite des bonnes sources.</p>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
