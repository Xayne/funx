import { Observable, ReplaySubject, Subject } from "rxjs"
import { AppCore } from "./app-core"
import { AppLangM } from "./app-m"

export type AppFacade<state, alg, err> = {
    state: {
        next: Observable<state>
        curr: state
        /** replayed(1) obs */
        nextAndCurr: Observable<state>
    }
    run: <v>(m: AppLangM<state, alg, err, v>) => Observable<v>
    dispose: () => void
}

export const mkAppFacade: <s, a, i, e>(core: AppCore<s, a, i, e>) => AppFacade<s, a, e>
    = core => {
        // todo type inference
        const state = {
            next: new Subject<any>(),
            curr: core.currentState,
            nextAndCurr: new ReplaySubject<any>(1)
        }
        state.nextAndCurr.next(core.currentState)
        const sub = core.stateStream.subscribe(s => {
            state.curr = s
            state.next.next(s)
            state.nextAndCurr.next(s)
        })
        return {
            state,
            run: core.runAction,
            dispose: () => {
                sub.unsubscribe()
                state.next.complete()
                state.nextAndCurr.complete()
            }
        }
    }


