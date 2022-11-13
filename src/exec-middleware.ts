import { Observable } from "rxjs"
import { hot } from "ts-free-monad/lib/hot"
import { AppCore } from "./app-core"
import { AppLangF } from "./app-m"

type Endo<v> = (v: v) => v 

export type ExecMiddleWare<s, a, i, e> = Endo<
    (core: AppCore<s, a, i ,e>) 
    => <v>(a: hot<AppLangF<a, s, e, any>, v>) 
    => Observable<v>
>

export const middlewarePipe: <s, a, i, e>(...p: ExecMiddleWare<s, a, i, e>[]) => ExecMiddleWare<s, a, i, e>
    = (...p) => exec => p.reduce(
        (a, f) => f(a)
        , exec
    )

export const middlewareConditional
    : <s, a, i, e>(p: (a: AppLangF<a, s, e, any>) 
        => boolean, m: ExecMiddleWare<s, a, i, e>) => ExecMiddleWare<s, a, i, e>
    = (p, m) => exec => core => a =>
        (p(a as any) ? m(exec) : exec)(core)(a)
