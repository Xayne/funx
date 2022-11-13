import { id, morph } from "fp-essentials";
import { Observable } from "rxjs";
import { Free } from "ts-free-monad";
import { hot } from "ts-free-monad/lib/hot";
import { AppLangM, AppLangF } from "./app-m";

export const mkUtils = <s, a, e, prettyLift>(
): {
    pure: <v>(v: v) => AppLangM<s, a, e, v>
    lift: prettyLift
    liftObs: <v>(o: Observable<v>) => AppLangM<s, a, e, v>
    // state
    readState: AppLangM<s, a, e, s>
    setState: (s: s) => AppLangM<s, a, e, {}>
    updateState: (s: Partial<s>) => AppLangM<s, a, e, {}>
    modifyState: (f: (s: s) => s) => AppLangM<s, a, e, {}>
    // erss
    throwErr: <v = never>(e: e) => AppLangM<s, a, e, v>
    tryCatch: <v>(m: AppLangM<s, a, e, v>, _catch: (e: e) => AppLangM<s, a, e, v>) => AppLangM<s, a, e, v>
    // todo add do notation
} => {
    const dem: <v>(e: AppLangF<a, s, e, v>) => hot<AppLangF<a, s, e, any>, v>
        = id as any

    const readState = Free.Lift(dem({ _tag: 'State.Read', f: id }))
    const setState = (s: s) => Free.Lift(dem({ _tag: 'State.Set', st: s, v: {} }))

    return {
        pure: Free.Pure,
        lift: (<v>(h: hot<a, v>) => Free.Lift(dem({ _tag: 'u', a: h as any }))) as any,
        readState,
        setState,
        updateState: pst => readState.map(morph(pst)).flatMap(setState),
        modifyState: f => readState.flatMap(s => setState(f(s))),
        throwErr: e => Free.Lift(dem<any>({ _tag: 'Err.Throw', e })),
        tryCatch: (m, c) => Free.Lift(dem({ _tag: 'Err.TryCatch', try: m, catch: c })),
        liftObs: o => Free.Lift(dem({ _tag: 'Lift.Obs', o }))
    }

}


