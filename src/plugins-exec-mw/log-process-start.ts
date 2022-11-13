import { of } from "rxjs"
import { concatMap, tap } from "rxjs/operators"
import { matAppLangF } from "../app-m"
import { ExecMiddleWare } from "../exec-middleware"
import { getActName } from "./utils"

export const logProcessStart: <s, a, i, e>(getName: (a: a) => string) => ExecMiddleWare<s, a, i, e>
    = getName => ex => core => h =>
        of({})
            .pipe(
                tap(_ => {
                    const a = matAppLangF(h)
                    console.log(
                        `[Started] ${getActName(getName)(a)}`,
                        core.currentState,
                        core
                    )
                })
                , concatMap(_ => ex(core)(h))
            )
