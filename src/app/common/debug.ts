// this is the file of the custom rxjs operator we are creating, called "debug"

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// the operator is a higher order function that takes as an input an observable, and as output another observable
// debug is a higher order function, it is a function that returns another function

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

// this variable is private to the file
let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}

export const debug = (level:number, message:string) => 
(source: Observable<any>) => source
.pipe(
    // the tap operator prints to the console
    tap(val => {

        if ( level >= rxjsLoggingLevel){
            console.log(message + ': ', val);
        }
    })
);