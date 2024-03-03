import { Router } from "express"

export type BaseRouter = {
    endpoint: string,
    app: Router
}
export enum ScoreLevel {
    LOW,
    MEDIUM,
    HIGH
}
export type SearchPredicate = {
    title: string,
    description: string,
    url: string,
    score: ScoreLevel
}

export type BaseMeta = {
    title: string,
    description: string
}