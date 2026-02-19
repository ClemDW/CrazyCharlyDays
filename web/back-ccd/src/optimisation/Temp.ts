import {Article} from "../entities/Article";
import {Box} from "../entities/Box";

type BoxWithArticle = {
    box: Box
    articles: Article[]
}

export { BoxWithArticle}