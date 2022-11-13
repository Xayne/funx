import { Free } from 'ts-free-monad'

export type WithErrsAlg<alg, err, v>
    = ErrorsAlg<alg, err, v>
    | alg


export type ErrorsAlg<alg, err, v>
    = { _tag: 'Err.Throw', e: err }
    | { _tag: 'Err.TryCatch', try: Free<WithErrsAlg<alg, err, any>, v>, catch: (err: err) => Free<WithErrsAlg<alg, err, any>, v> }
