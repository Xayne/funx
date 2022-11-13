import { ExecMiddleWare, middlewareConditional, middlewarePipe } from "../src/exec-middleware"
import { logErrors } from "../src/plugins-exec-mw/log-errors"
import { logValuesFinish } from "../src/plugins-exec-mw/log-values-finish"
import { MyState, MyAlg, MyDeps, MyErr } from "./my-app"

export type MyExecMW = ExecMiddleWare<MyState, MyAlg<any>, MyDeps, MyErr>

export const execMiddleware: MyExecMW = middlewarePipe(
    logErrors(x => x._t),
    middlewareConditional(
        x => x._tag === 'State.Set',
        logValuesFinish(x => x._t)
    )
)
