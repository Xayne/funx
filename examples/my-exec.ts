import { Observable, of } from "rxjs";
import { hot } from 'ts-free-monad/lib/hot'
import { MyAlg, MyDeps } from "./my-app";

const mat: <v>(a: hot<MyAlg<any>, v>) => MyAlg<v>
    = v => v as any

export const exec: (d: MyDeps) => <v>(a: hot<MyAlg<any>, v>) => Observable<v>
    = d => h => {
        const a = mat(h)
        switch (a._t) {
            case 'lol': {
                return of(a.v)
            }
            case 'ret': {
                return of(a.f(d))
            }
        }
    }
