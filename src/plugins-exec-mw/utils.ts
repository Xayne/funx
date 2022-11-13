import { AppLangF } from "../app-m";

export const getActName: <a>(getName: (a: a) => string) => 
    <s, e, v>(l: AppLangF<a, s, e, v>) => string
    = getName => l => l._tag === 'u' ? getName(l.a) : l._tag
