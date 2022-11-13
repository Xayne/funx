import { Observable } from "rxjs";
import { AppLangM } from "./app-m";

export type AppCore<state, alg, internals, err> = {
    internals: internals
    currentState: state
    stateStream: Observable<state>
    setNewState: (s: state) => void
    runAction: <v>(m: AppLangM<state, alg, err, v>) => Observable<v>
}
