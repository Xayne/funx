import { AppFacade } from "./app-facade"
import { AppLangM } from "./app-m"

export type Dispatcher<event> = (a: event) => void

export const mkDispatcher: <event, state, alg, err>
    (eventToAction: (e: event) => AppLangM<state, alg, err, {}>)
    => (facade: AppFacade<state, alg, err>) => Dispatcher<event>
    = eta => facade => a => facade.run(eta(a))
