import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    ///////////////////////////// IMPERATIVE APPROACH TO IMPLEMENTING THIS COMPONENT ///////////////////////////////
    // beginnerCourses: Course[];
    // advancedCourses: Course[];
    ///////////////////////////// REACTIVE APPROACH TO IMPLEMENTING THIS COMPONENT ///////////////////////////////
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {

        ///////////////////////////// IMPERATIVE APPROACH TO IMPLEMENTING THIS COMPONENT ///////////////////////////////
        // It could lead to nesting hell, so it's best to use reactive instead of imperative approach.

        // const http$: Observable<Course[]> = createHttpObservable<Course[]>('/api/courses');

        // const courses$ : Observable<Course[]> = http$
        //     .pipe(
        //       map(response => Object.values(response["payload"]))
        //     );

        // courses$.subscribe(
        //   courses => {
        //         this.beginnerCourses = courses.filter(course => course.category == 'BEGINNER');
        //         this.advancedCourses = courses.filter(course => course.category == 'ADVANCED');
        //   },
        //   noop,
        //   () => console.log('completed')
        // );
     
        ///////////////////////////// REACTIVE APPROACH TO IMPLEMENTING THIS COMPONENT ///////////////////////////////

        // const http$ : Observable<Course[]> =
        //     createHttpObservable('/api/courses');

        // const courses$ : Observable<Course[]>= http$
        //     .pipe(
        //         map(response => Object.values(response["payload"])  )
        //     );

        // this.beginnerCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'BEGINNER'))
        //     );

        // this.advancedCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'ADVANCED'))
        //     );

        //////////////////////////////////// TAP AND SHARE REPLAY OPERATORS ///////////////////////////////////////////
        const http$ : Observable<Course[]> =
        createHttpObservable('/api/courses');

        const courses$ : Observable<Course[]> = http$
            .pipe(

                map(response => Object.values(response["payload"])  )
            );

        // we create a beginnerCourses Observable and we pass it to the template (home.component.html)
        this.beginnerCourses$ = courses$
            .pipe(
                // the tap operator produces side effects like logging to the console
                tap(() => console.log("HTTP request executed.")),
                map(courses => courses
                    .filter(course => course.category == 'BEGINNER')),
                // the shareReplay operator makes sure that only one http call is made (and not one for each dervied observable)
                shareReplay()
            );

        // and here we derive the advancedCourses observable from the courses observable
        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'ADVANCED'))
            );


    }
}
