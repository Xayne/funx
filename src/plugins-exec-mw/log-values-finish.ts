import { tap } from "rxjs/operators"
import { matAppLangF } from "../app-m"
import { ExecMiddleWare } from "../exec-middleware"
import { getActName } from "./utils"

export const logValuesFinish: <s, a, i, e>(getName: (a: a) => string) => ExecMiddleWare<s, a, i, e>
    = getName => ex => core => h => {
        return ex(core)(h).pipe(
            tap(v => console.log(
                `[Executed] ${getActName(getName)(matAppLangF(h))}`,
                v,
                core.currentState,
                core
            ))
        )
    }

