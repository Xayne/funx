import { AppLangM } from "../src/app-m"

export type MyDeps = {
    desptom: string
}

export type MyAlg<v>
    = { _t: 'lol', v: v }
    | { _t: 'ret', f: (d: MyDeps) => v }

export type MyState = {
    hello: string
    iter: number
}

export type MyErr = {
    _tag: 'MyErr.Unknown'
    er: any
}

export type AppM<v> = AppLangM<MyState, MyAlg<any>, MyErr, v>

