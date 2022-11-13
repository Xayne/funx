import { morph_ } from "fp-essentials";
import { mkUtils } from "../src/app-m.utils";
import { MyState, MyAlg, MyErr, AppM } from "./my-app";

export const {
    pure,
    lift,
    liftObs,

    readState,
    setState,
    updateState,
    modifyState,

    tryCatch,
    throwErr

} = mkUtils<
    MyState,
    MyAlg<any>,
    MyErr,
    <v>(a: MyAlg<v>) => AppM<v>
>()


const r = pure(11)
    .flatMap(x => modifyState(morph_(s => ({
        hello: s.iter.toString() + s.hello
    }))))
    .flatMap(_ => readState)
    .flatMap(x => lift({ _t: 'ret', f: y => y.desptom + '_' + x.hello }))


