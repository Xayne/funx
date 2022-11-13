import { id, Lazy } from "fp-essentials";
import { catchError, concatMap, defer, Observable, of, shareReplay, Subject, throwError } from "rxjs";
import { hot } from "ts-free-monad/lib/hot";
import { AppCore } from "./app-core";
import { AppLangM, AppLangF } from "./app-m";
import { ExecMiddleWare } from "./exec-middleware";

export const mkAppCore = <s, a, i, e>(
    internals: i,
    initialState: s,
    execAlg: (i: i) => <v>(a: hot<a, v>) => Observable<v>,
    // todo wrap error must not wrap if e is e
    wrapErr: (e: any) => e,
    execMiddleware?: ExecMiddleWare<s, a, i, e>
): AppCore<s, a, i, e> => {

    const c = class {
        internals = internals
        _exec = exec({
            core: this,
            execAlg,
            wrapErr: wrapErr,
            middleware: execMiddleware || id
        })

        currentState = initialState
        stateStream = new Subject<s>()

        setNewState
            = (s: s) => {
                this.currentState = s
                this.stateStream.next(s)
            }

        runAction: <v>(m: AppLangM<s, a, e, v>) => Observable<v>
            = m => {
                const r = this._exec(m).pipe(shareReplay(1))
                r.subscribe()
                return r
            }
    }
    return new c()
}

const exec: <s, a, i, e>(cfg: {
    core: AppCore<s, a, i, e>,
    wrapErr: (e: any) => e,
    execAlg: (i: i) => <v>(a: hot<a, v>) => Observable<v>
    middleware: ExecMiddleWare<s, a, i, e>
}) => <v>(m: AppLangM<s, a, e, v>) => Observable<v>
    = cfg => {
        const subExec = Lazy.from(() => exec(cfg))
        const e = cfg.middleware(_exec(subExec)(cfg.wrapErr)(cfg.execAlg(cfg.core.internals)))
            (cfg.core)
        return m => m.fold(
            e,
            // todo fucking rxjs types
            x => of(x),
            // todo fucking rxjs types
            a => b => concatMap(a)(b)
        )
    }

const _exec
    : <s, a, i, e>(subExec: Lazy<<v>(m: AppLangM<s, a, e, v>) => Observable<v>>) 
        => (wrapErr: (e: any) => e)
        => (e: <v>(a: hot<a, v>) => Observable<v>)
        => (core: AppCore<s, a, i, e>) 
        => <v>(a: hot<AppLangF<a, s, e, any>, v>) 
        => Observable<v>
    = se => wrapErr => ex => core => h => {
        const a = h as any as (AppLangF<any, any, any, any>)
        switch (a._tag) {
            case 'Err.Throw': return throwError(() => a.e)
            case 'Err.TryCatch': 
                return se.v(a.try).pipe(catchError(e => se.v(a.catch(wrapErr(e)))))
            case 'State.Read': return of(a.f(core.currentState))
            case 'State.Set': {
                return defer(() => {
                    core.setNewState(a.st)
                    return of(a.v)
                })
            }
            case 'Lift.Obs': {
                return a.o
            }
            default:
                return ex(a.a)
        }
    }
