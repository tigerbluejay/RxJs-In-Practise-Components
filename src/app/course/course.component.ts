import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay,
    throttle,
    throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    // component member variables
    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    // ngOnInit() {

    //     this.courseId = this.route.snapshot.params['id'];

    //     this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
    //         .pipe(
    //             debug( RxJsLoggingLevel.INFO, "course value ")
    //         );

    //     // this will load us an intial batch of lessons without any filtering applied
    //     // this.lessons$ = this.loadLessons();


    //     // this will set the logging level as defined in debug.ts to DEBUG
    //     setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);

    // }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        const course$ = createHttpObservable(`/api/courses/${this.courseId}`);

        // fetches a list of lessons
        const lessons$ = this.loadLessons();

        // forkJoin operator allows us to launch tasks in parallel and then get
        // the results of those tasks together.
        // trigger those requests at the same time
        // send them to the backend at the same time
        // have the backend serve the tasks in parallel
        // wait for both the results of the course and lessons observable to return (wait until they are completed)
        // and only then do something
        forkJoin([(course$),(lessons$)])
            .subscribe();
        // ideal for performing long running calculations that will emit multiple values
        // ideal for performing tasks in parallel

    }


    // ngAfterViewInit() {

    //     // fromEvent to create a new stream linked to the input box
    //     // keyup event is the browser value we subscribe to
    //     // this will give us a stream of keyup events
    //     const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
    //         .pipe(
    //             // take the browser keyup event, and we derive the value
    //             // of the input box
    //             map(event => event.target.value),
    //             // debounceTime operator: takes a stream of input values, and a delay in milliseconds
    //             // debounceTime delays values emitted by the source Observable, but drops previous pending
    //             // delayed emissions, if a new value arrives on the source Observable. This operator emits
    //             // only when the time has passed withotu any other value appearing on the source Observable.
    //             debounceTime(400),
    //             distinctUntilChanged(),
    //             // switchMap operator: The main difference between switchMap and other flattening operators 
    //             // is the cancelling effect. On each emission the previous inner observable (the result of 
    //             // the function you supplied) is cancelled and the new observable is subscribed. You can 
    //             // remember this by the phrase switch to a new observable.
    //             switchMap(search => this.loadLessons(search))
    //         );

    //         const initialLessons$ = this.loadLessons();

    //         // we combine two observables, concatenating them
    //         this.lessons$ = concat(initialLessons$, searchLessons$);

    // }

    // extracted into a method to reuse it easily
    // to make initialLessons$ (observable) is compatible with this.lesson$ (observable)
    // we define it as of type <Lesson[]>


    // ngAfterViewInit() {

    //     this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
    //     .pipe(
    //         map(event => event.target.value),
    //         // start with will start the stream with an empty string
    //         // which will trigger the default behavior in loadLessons() below.
    //         startWith(''),
    //         // debouncing is waiting for a value to become stable
    //         // for example in a search box we type characters and the search will fire only
    //         // after a certain amount of time has passed since the last typed character.
    //         // debounceTime(400),
    //         // throttling is the other side of the coin to debouncing
    //         // throttle emits the source Observable values on the output Observable 
    //         // when its internal timer is disabled, and ignores source values when 
    //         // the timer is enabled. Initially, the timer is disabled.
    //         // in other words, in a search box we type characters and the search will fire
    //         // immediately but will only fire again after a certain time since the initial typing has passed.
    //         // throttle(() => interval(500)),
    //         // an alternative way to write this is with the throttleTime operator
    //         throttleTime(500),
    //         distinctUntilChanged(),
    //         switchMap(search => this.loadLessons(search))
    //     );

    // }

    ngAfterViewInit() {

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
            map(event => event.target.value),
            startWith(''),
            // the custom operator we created "debug" in "debug.ts" takes as input parameter
            // the logging level and outputs "tap" operator information if the logging level
            // is equal or inferior to the logging level defined in the operator logic
            // which is set on this page at the ngOnInit() funciton.
            debug(RxJsLoggingLevel.TRACE, "search "),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search)),
            debug(RxJsLoggingLevel.DEBUG, "lessons value ")

        );

    }


    loadLessons(search = ''): Observable<Lesson[]> {
        // http request
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe (
                map(res => res["payload"])
            );
    }

}
