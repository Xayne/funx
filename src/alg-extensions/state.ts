

export type StateAlg<s, v>
    = { _tag: 'State.Read', f: (st: s) => v }
    | { _tag: 'State.Set', st: s, v: v }
