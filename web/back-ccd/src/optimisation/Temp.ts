// ====== ENUMS ======

enum State {
    N = "N",
    TB = "TB",
    B = "B"
}

// ====== TYPES ======

type Article = {
    id_article: string
    description: string
    category: string
    age_range: string
    state: State
    price: number
    weight: number
}

type Campaign = {
    max_weight: number
}

type UserToChild = {
    id_user: string
    age_range: string
    preferences: string[]
}

type Box = {
    id_box: string
    id_user: string
}

type BoxWithArticle = {
    box: Box
    articles: Article[]
}

type ScoreResult = {
    score: number
    perBoxScore: Map<string, number>
}

export { State, Article, Campaign, UserToChild, Box, BoxWithArticle, ScoreResult }