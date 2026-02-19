import { BoxWithArticle, CompositionResult } from "./Temp";
import Score from "./Score";
import { Campaign } from "../entities/Campaign";
import { Usertochild } from "../entities/UserToChild";
import { Article } from "../entities/Article";
import { Box } from "../entities/Box";
import * as fs from "fs/promises";
import {Box} from "../entities/Box";

type RecuitOptions = {
    initialTemperature?: number;
    coolingRate?: number;
    iterationsPerTemp?: number;
    minTemperature?: number;
    maxIterations?: number;
    randomSeed?: number | null;
};

function deepCloneBoxes(boxes: BoxWithArticle[]): BoxWithArticle[] {
    return boxes.map(b => {
        const newBox = new Box();
        Object.assign(newBox, b.box);

        return {
            box: newBox,
            articles: b.articles.slice()
        };
    });
}

function randInt(max: number) {
    return Math.floor(Math.random() * max);
}

export default class RecuitSimule {
    private scoreService: Score;
    private opts: Required<RecuitOptions>;

    constructor(scoreService: Score, opts?: RecuitOptions) {
        this.scoreService = scoreService;
        this.opts = {
            initialTemperature: opts?.initialTemperature ?? 50,
            coolingRate: opts?.coolingRate ?? 0.95,
            iterationsPerTemp: opts?.iterationsPerTemp ?? 200,
            minTemperature: opts?.minTemperature ?? 0.1,
            maxIterations: opts?.maxIterations ?? 20000,
            randomSeed: opts?.randomSeed ?? null
        };
    }

    async optimize(
        articles: Article[],
        campaign: Campaign,
        usersToChild: Usertochild[]
    ): Promise<CompositionResult> {
        // box vide
        const initialBoxes: BoxWithArticle[] = usersToChild.map((utc, index) => {
            const b = new Box();
            b.id_box = "box_" + index;
            b.id_user = utc.id_user;
            b.id_camp = campaign.id_camp;
            b.score_box = 0;
            b.total_weight = 0;
            b.total_price = 0;
            b.validated = false;
            return {
                box: b,
                articles: []
            };
        });

        const articlesById = new Map<string, Article>();
        for (const a of articles) articlesById.set(a.id_article, a);

        const remaining = new Set<string>(articles.map(a => a.id_article));

        const getScore = (boxes: BoxWithArticle[]) => {
            const res = this.scoreService.evaluateComposition(
                deepCloneBoxes(boxes),
                campaign,
                usersToChild
            );
            return res.score;
        };

        const boxesGreedy = deepCloneBoxes(initialBoxes);
        const remainingGreedy = new Set(remaining);
        for (const art of articles) {
            let bestGain = -Infinity;
            let bestBoxIndex: number | null = null;

            for (let i = 0; i < boxesGreedy.length; i++) {
                const b = boxesGreedy[i];
                const user = usersToChild.find(u => u.id_user === b.box.id_user);
                if (!user) continue;
                if (art.age_range !== user.age_range) continue;

                // calcule poids actuel
                const currentWeight = b.articles.reduce((s, it) => s + it.weight, 0);
                if (currentWeight + art.weight > campaign.max_weight) continue;

                b.articles.push(art);
                const newScore = getScore(boxesGreedy);
                b.articles.pop();

                // gain
                const baseScore = getScore(boxesGreedy);
                const gain = newScore - baseScore;
                if (gain > bestGain) {
                    bestGain = gain;
                    bestBoxIndex = i;
                }
            }

            if (bestBoxIndex !== null && bestGain > -Infinity) {
                boxesGreedy[bestBoxIndex].articles.push(art);
                remainingGreedy.delete(art.id_article);
            }
        }

        // Score initial
        let currentBoxes = deepCloneBoxes(boxesGreedy);
        let currentRemaining = new Set<string>(remainingGreedy);
        let currentScore = getScore(currentBoxes);

        // Meilleur
        let bestBoxes = deepCloneBoxes(currentBoxes);
        let bestRemaining = new Set<string>(currentRemaining);
        let bestScore = currentScore;

        // voisins
        const tryMove = (boxes: BoxWithArticle[], rem: Set<string>): boolean => {
            const nonEmptyIndices = boxes
                .map((b, idx) => (b.articles.length > 0 ? idx : -1))
                .filter(idx => idx >= 0);
            if (nonEmptyIndices.length === 0) return false;

            const srcIdx = nonEmptyIndices[randInt(nonEmptyIndices.length)];
            const srcBox = boxes[srcIdx];
            const artIdx = randInt(srcBox.articles.length);
            const article = srcBox.articles[artIdx];

            const targetIndices = boxes
                .map((b, idx) => {
                    if (idx === srcIdx) return -1;
                    return idx;
                })
                .filter(idx => idx >= 0);
            if (targetIndices.length === 0) return false;

            for (let attempt = 0; attempt < targetIndices.length; attempt++) {
                const tIdx = targetIndices[randInt(targetIndices.length)];
                const targetBox = boxes[tIdx];
                const userTarget = usersToChild.find(u => u.id_user === targetBox.box.id_user);
                if (!userTarget) continue;
                if (article.age_range !== userTarget.age_range) continue;

                const targetWeight = targetBox.articles.reduce((s, it) => s + it.weight, 0);
                if (targetWeight + article.weight > campaign.max_weight) continue;

                srcBox.articles.splice(artIdx, 1);
                targetBox.articles.push(article);
                return true;
            }
            return false;
        };

        const trySwap = (boxes: BoxWithArticle[], rem: Set<string>): boolean => {
            const filledIndices = boxes
                .map((b, idx) => (b.articles.length > 0 ? idx : -1))
                .filter(idx => idx >= 0);
            if (filledIndices.length < 2) return false;

            let i = filledIndices[randInt(filledIndices.length)];
            let j = filledIndices[randInt(filledIndices.length)];
            let tries = 0;
            while (j === i && tries++ < 10) j = filledIndices[randInt(filledIndices.length)];
            if (i === j) return false;

            const boxA = boxes[i];
            const boxB = boxes[j];

            const idxA = randInt(boxA.articles.length);
            const idxB = randInt(boxB.articles.length);
            const artA = boxA.articles[idxA];
            const artB = boxB.articles[idxB];

            const userA = usersToChild.find(u => u.id_user === boxA.box.id_user);
            const userB = usersToChild.find(u => u.id_user === boxB.box.id_user);
            if (!userA || !userB) return false;

            if (artB.age_range !== userA.age_range) return false;
            if (artA.age_range !== userB.age_range) return false;

            const weightA = boxA.articles.reduce((s, it) => s + it.weight, 0) - artA.weight + artB.weight;
            const weightB = boxB.articles.reduce((s, it) => s + it.weight, 0) - artB.weight + artA.weight;
            if (weightA > campaign.max_weight || weightB > campaign.max_weight) return false;

            // swap
            boxA.articles[idxA] = artB;
            boxB.articles[idxB] = artA;
            return true;
        };

        const tryAssignUnassign = (boxes: BoxWithArticle[], rem: Set<string>): boolean => {
            if (rem.size > 0 && Math.random() < 0.6) {
                const remArr = Array.from(rem);
                const artId = remArr[randInt(remArr.length)];
                const art = articlesById.get(artId);
                if (!art) return false;

                const candidates = boxes
                    .map((b, idx) => ({ b, idx }))
                    .filter(({ b }) => {
                        const user = usersToChild.find(u => u.id_user === b.box.id_user);
                        if (!user) return false;
                        if (art.age_range !== user.age_range) return false;
                        const w = b.articles.reduce((s, it) => s + it.weight, 0);
                        return w + art.weight <= campaign.max_weight;
                    });

                if (candidates.length === 0) return false;
                const chosen = candidates[randInt(candidates.length)];
                chosen.b.articles.push(art);
                rem.delete(artId);
                return true;
            } else {
                const nonEmptyBoxes = boxes.filter(b => b.articles.length > 0);
                if (nonEmptyBoxes.length === 0) return false;
                const box = nonEmptyBoxes[randInt(nonEmptyBoxes.length)];
                const idx = randInt(box.articles.length);
                const art = box.articles.splice(idx, 1)[0];
                rem.add(art.id_article);
                return true;
            }
        };

        const applyRandomNeighbor = (boxes: BoxWithArticle[], rem: Set<string>): boolean => {
            const r = Math.random();
            if (r < 0.4) return tryMove(boxes, rem);
            if (r < 0.8) return trySwap(boxes, rem);
            return tryAssignUnassign(boxes, rem);
        };

        let T = this.opts.initialTemperature;
        let iterations = 0;

        while (T > this.opts.minTemperature && iterations < this.opts.maxIterations) {
            for (let it = 0; it < this.opts.iterationsPerTemp; it++) {
                iterations++;
                const neighborBoxes = deepCloneBoxes(currentBoxes);
                const neighborRem = new Set<string>(currentRemaining);

                const applied = applyRandomNeighbor(neighborBoxes, neighborRem);
                if (!applied) continue;

                const neighborScore = getScore(neighborBoxes);

                const delta = neighborScore - currentScore;

                if (delta >= 0) {
                    // accepte
                    currentBoxes = neighborBoxes;
                    currentRemaining = neighborRem;
                    currentScore = neighborScore;

                    if (neighborScore > bestScore) {
                        bestScore = neighborScore;
                        bestBoxes = deepCloneBoxes(neighborBoxes);
                        bestRemaining = new Set<string>(neighborRem);
                    }
                } else {
                    // formule de la proba
                    const p = Math.exp(delta / T);
                    if (Math.random() < p) {
                        currentBoxes = neighborBoxes;
                        currentRemaining = neighborRem;
                        currentScore = neighborScore;
                    }
                }
                if (iterations >= this.opts.maxIterations) break;
            }

            // on rapetisse la probabilité
            T = T * this.opts.coolingRate;
            if (iterations >= this.opts.maxIterations) break;
        }
        const compositionScore = this.scoreService.evaluateComposition(
            deepCloneBoxes(bestBoxes),
            campaign,
            usersToChild
        );

        for (const b of bestBoxes) {

            const box = new Box();
            box.id_user = b.box.id_user;
            box.id_camp = b.box.id_camp;

            box.total_weight = b.articles.reduce((s, a) => s + Number(a.weight), 0);
            box.total_price = b.articles.reduce((s, a) => s + Number(a.price), 0);
            box.score_box = compositionScore.perBoxScore.get(b.box.id_box) ?? 0;
            box.validated = false;

            await box.save();
        }


        // Retourne meilleure solution trouvée
        return {
            boxes: bestBoxes,
            score: Math.round(bestScore)
        };
    }
}
