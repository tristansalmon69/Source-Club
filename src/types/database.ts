export interface Profile {
    id: string
    username: string
    avatar_url: string | null
    created_at: string
}

export interface Club {
    id: string
    name: string
    description: string | null
    icon: string
    theme: string | null
    invite_code: string
    created_by: string | null
    created_at: string
}

export interface ClubMember {
    id: string
    club_id: string
    user_id: string
    role: 'admin' | 'member'
    joined_at: string
    profile?: Profile
    club?: Club
}

export interface Source {
    id: string
    user_id: string
    club_id: string
    url: string
    title: string | null
    description: string | null
    thumbnail: string | null
    domain: string | null
    source_type: string | null
    category: string | null
    summary: string | null
    personal_note: string | null
    rating: number | null
    created_at: string
    profile?: Profile
    club?: Club
}

export interface Comment {
    id: string
    source_id: string
    user_id: string
    content: string
    created_at: string
    profile?: Profile
}

export interface ClubWithMembers extends Club {
    members: ClubMember[]
    member_count: number
}

export interface SourceWithDetails extends Source {
    profile: Profile
    club: Club
}
