export type Category =
    | 'Géopolitique'
    | 'Économie'
    | 'Tech'
    | 'Écologie'
    | 'Science'
    | 'Divertissement'
    | 'Sport'
    | 'Autre'

interface CategoryRule {
    domains: string[]
    keywords: string[]
}

const CATEGORY_RULES: Record<Category, CategoryRule> = {
    'Géopolitique': {
        domains: ['lemonde.fr/international', 'reuters.com', 'france24.com', 'bbc.com/news', 'aljazeera.com'],
        keywords: ['guerre', 'élection', 'diplomatie', 'conflit', 'international', 'politique', 'président']
    },
    'Économie': {
        domains: ['lesechos.fr', 'bloomberg.com', 'boursorama.com', 'investing.com'],
        keywords: ['inflation', 'bourse', 'entreprise', 'économie', 'finance', 'marché', 'action']
    },
    'Tech': {
        domains: ['theverge.com', 'techcrunch.com', 'wired.com', 'arstechnica.com', 'numerama.com'],
        keywords: ['ia', 'intelligence artificielle', 'startup', 'app', 'technologie', 'logiciel', 'crypto']
    },
    'Écologie': {
        domains: ['reporterre.net', 'greenpeace.org'],
        keywords: ['climat', 'environnement', 'carbone', 'écologie', 'biodiversité', 'pollution', 'renouvelable']
    },
    'Science': {
        domains: ['nature.com', 'sciencesetavenir.fr', 'science.org', 'newscientist.com'],
        keywords: ['étude', 'recherche', 'scientifique', 'découverte', 'laboratoire', 'expérience']
    },
    'Divertissement': {
        domains: ['youtube.com', 'spotify.com', 'allocine.fr', 'netflix.com', 'twitch.tv'],
        keywords: ['film', 'série', 'musique', 'concert', 'album', 'artiste', 'streaming']
    },
    'Sport': {
        domains: ['lequipe.fr', 'espn.com', 'eurosport.fr'],
        keywords: ['match', 'championnat', 'football', 'basket', 'tennis', 'sport', 'victoire']
    },
    'Autre': {
        domains: [],
        keywords: []
    }
}

export function detectCategory(url: string, title?: string): Category {
    const urlLower = url.toLowerCase()
    const titleLower = title?.toLowerCase() || ''

    // Check each category except 'Autre'
    for (const [category, rules] of Object.entries(CATEGORY_RULES)) {
        if (category === 'Autre') continue

        // Check domain match
        const domainMatch = rules.domains.some(domain => urlLower.includes(domain))
        if (domainMatch) return category as Category

        // Check keyword match in title
        if (titleLower) {
            const keywordMatch = rules.keywords.some(keyword =>
                titleLower.includes(keyword.toLowerCase())
            )
            if (keywordMatch) return category as Category
        }
    }

    return 'Autre'
}

export const CATEGORIES: Category[] = [
    'Géopolitique',
    'Économie',
    'Tech',
    'Écologie',
    'Science',
    'Divertissement',
    'Sport',
    'Autre'
]

export const CATEGORY_COLORS: Record<Category, string> = {
    'Géopolitique': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Économie': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Tech': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Écologie': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Science': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Divertissement': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    'Sport': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Autre': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}
