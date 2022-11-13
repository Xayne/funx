import { AppCore } from "../src/app-core"
import { mkAppCore } from "../src/mk-app-core"
import { execMiddleware } from "./exec-mw"
import { MyState, MyAlg, MyDeps, MyErr } from "./my-app"
import { exec } from "./my-exec"

export type MyCore = AppCore<MyState, MyAlg<any>, MyDeps, MyErr>

export const core: MyCore
    = mkAppCore(
        { desptom: '11' },
        { hello: '', iter: 0 },
        exec,
        e => ({ _tag: 'MyErr.Unknown', er: e }),
        execMiddleware
    )
