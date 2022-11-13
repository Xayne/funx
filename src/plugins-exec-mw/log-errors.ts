import { throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { matAppLangF } from "../app-m"
import { ExecMiddleWare } from "../exec-middleware"
import { getActName } from "./utils"

const errIsLogged = Symbol()

export const logErrors: <s, a, i, e>(getName: (a: a) => string) => ExecMiddleWare<s, a, i, e>
    = getName => ex => core => h =>
        ex(core)(h).pipe(
            catchError(e => {
                if (!e[errIsLogged]) {
                    const a = matAppLangF(h)
                    console.log(
                        `[Executed with Error!] ${getActName(getName)(a)}`,
                        e,
                        core.currentState,
                        core
                    )
                    e[errIsLogged] = true
                }
                return throwError(() => e)
            })
        )
