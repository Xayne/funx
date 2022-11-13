import { Observable } from "rxjs";

export type LiftObs<a> =
    { _tag: 'Lift.Obs', o: Observable<a> }
