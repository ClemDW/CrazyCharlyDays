// Temp.ts
import { Article } from "../entities/Article";
import { Box } from "../entities/Box";

export type BoxWithArticle = {
    box: Box;
    articles: Article[];
}

export type CompositionResult = {
    boxes: BoxWithArticle[],
    score: number
}
