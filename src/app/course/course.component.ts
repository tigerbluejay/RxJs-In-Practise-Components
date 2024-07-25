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
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


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

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

        // this will load us an intial batch of lessons without any filtering applied
        this.lessons$ = this.loadLessons();

    }

    ngAfterViewInit() {

        // fromEvent to create a new stream linked to the input box
        // keyup event is the browser value we subscribe to
        // this will give us a stream of keyup events
        const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                // take the browser keyup event, and we derive the value
                // of the input box
                map(event => event.target.value),
                // debounceTime operator: takes a stream of input values, and a delay in milliseconds
                // debounceTime delays values emitted by the source Observable, but drops previous pending
                // delayed emissions, if a new value arrives on the source Observable. This operator emits
                // only when the time has passed withotu any other value appearing on the source Observable.
                debounceTime(400),
                distinctUntilChanged(),
                // switchMap operator: The main difference between switchMap and other flattening operators 
                // is the cancelling effect. On each emission the previous inner observable (the result of 
                // the function you supplied) is cancelled and the new observable is subscribed. You can 
                // remember this by the phrase switch to a new observable.
                switchMap(search => this.loadLessons(search))
            );

            const initialLessons$ = this.loadLessons();

            // we combine two observables, concatenating them
            this.lessons$ = concat(initialLessons$, searchLessons$);

    }

    // extracted into a method to reuse it easily
    // to make initialLessons$ (observable) is compatible with this.lesson$ (observable)
    // we define it as of type <Lesson[]>
    loadLessons(search = ''): Observable<Lesson[]> {
        // http request
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe (
                map(res => res["payload"])
            );
    }

}
