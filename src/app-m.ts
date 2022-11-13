import { id } from "fp-essentials";
import { Free } from "ts-free-monad";
import { hot } from "ts-free-monad/lib/hot";
import { LiftObs } from "./alg-extensions/lift-obs";
import { StateAlg } from "./alg-extensions/state";
import { WithErrsAlg } from "./alg-extensions/with-errors";

export type AppLangM<state, alg, err, v> = Free<AppLangF<alg, state, err, any>, v>

export type AppLangF<userAlg, state, err, v> = WithErrsAlg<
    { 
        _tag: 'u', 
        a: userAlg // in normal PL it must be typed with v too
    }
    | StateAlg<state, v>
    | LiftObs<v>
    ,
    err,
    v>

export const matAppLangF: <a, s, e, v>(l: hot<AppLangF<a, s, e, any>, v>) => AppLangF<a, s, e, v>
    = id as any
