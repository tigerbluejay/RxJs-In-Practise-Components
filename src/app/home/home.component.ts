import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
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
        // const http$ : Observable<Course[]> =
        // createHttpObservable('/api/courses');

        // const courses$ : Observable<Course[]> = http$
        //     .pipe(

        //         map(response => Object.values(response["payload"])  )
        //     );

        // // we create a beginnerCourses Observable and we pass it to the template (home.component.html)
        // this.beginnerCourses$ = courses$
        //     .pipe(
        //         // the tap operator produces side effects like logging to the console
        //         tap(() => console.log("HTTP request executed.")),
        //         map(courses => courses
        //             .filter(course => course.category == 'BEGINNER')),
        //         // the shareReplay operator makes sure that only one http call is made (and not one for each dervied observable)
        //         shareReplay()
        //     );

        // // and here we derive the advancedCourses observable from the courses observable
        // this.advancedCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'ADVANCED'))
        //     );

        // //////////////////////////// ERROR HANDLING STRATEGY: CATCHING AN ERRORED OBSERVABLE AND PROVIDING AN ALTERNATIVE OBSERVABLE
        // ///////////////////////////// (AN ARRAY OF ONLY ONE COURSE) //////////////////////////////////////////////////
        // // We'll make the http observable fail.
        // // In this case we'll catch the error by using the catchError operator

        // const http$ : Observable<Course[]> =
        // createHttpObservable('/api/courses');

        // const courses$ : Observable<Course[]> = http$
        //     .pipe(
        //         map(response => Object.values(response["payload"])  )
        //     );

        // this.beginnerCourses$ = courses$
        //     .pipe(
        //         tap(() => console.log("HTTP request executed.")),
        //         map(courses => courses
        //             .filter(course => course.category == 'BEGINNER')),
        //         shareReplay(),
        //         // the beginnerCourse observable will error out (because of the changes we made in get-courses.route.ts)
        //         // so catchError will provide an alternative observable that only will be consumed by the component if
        //         // it beginnerCourse errors out.
        //         // we try to recover from the error by providing an alternative value.
        //         // we use the of operator to provide an alternative observable (an array with only one course)
        //         catchError(err => of([
        //             {
        //                 id: 0,
        //                 description: "RxJs In Practice Course",
        //                 iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        //                 courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        //                 longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
        //                 category: 'BEGINNER',
        //                 lessonsCount: 10
        //             }
        //         ]) )
        //     );

        // this.advancedCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'ADVANCED'))
        //     );
        // //////////////////////////// ERROR HANDLING STRATEGY: "CATCH AND RETHROW" - HANDLE THE ERROR LOCALLY /////////
        // // CREATE AN OBSERVABLE THAT ERRORS OUT WITHOUT EMITTING ANY VALUE     /////////////////////////////
        
        // const http$ : Observable<Course[]> =
        // createHttpObservable('/api/courses');

        // const courses$ : Observable<Course[]> = http$
        //     .pipe(
        //         map(response => Object.values(response["payload"])  )
        //     );

        // this.beginnerCourses$ = courses$
        //     .pipe(
        //         // create an observable that doesnt emit any value, and immediately errors out
        //         catchError(err => {
        //             console.log("Error occured", err);
        //             // throwError will throw an observable that errors out with the same error we got
        //             // throwError is an utility method
        //             return throwError(err);
        //         }),
        //         // clean up logic:
        //         finalize(() => {
        //             console.log("Finalize executed");
        //         }),
        //         // we can apply catchError and finalize operators at different points of the observable chain
        //         // but here we have applied it at the beginning.
        //         tap(() => console.log("HTTP request executed.")),
        //         map(courses => courses
        //             .filter(course => course.category == 'BEGINNER')),
        //         shareReplay()
        //     );

        // this.advancedCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'ADVANCED'))
        //     );

        //////////////////////////// ERROR HANDLING STRATEGY: WAIT AND RETRY AFTER A COUPLE OF SECONDS  /////////////////////////////
        
        const http$ : Observable<Course[]> =
        createHttpObservable('/api/courses');

        const courses$ : Observable<Course[]> = http$
            .pipe(
                map(response => Object.values(response["payload"])  )
            );

        this.beginnerCourses$ = courses$
            .pipe(
                tap(() => console.log("HTTP request executed.")),
                map(courses => courses
                    .filter(course => course.category == 'BEGINNER')),
                shareReplay(),
                // when backend request fails, we can retry after a couple of seconds (2 seconds)
                // (and it will fail 50% of the time due to the logic in get-courses.route.ts)
                // it will keep retrying every two seconds
                // the retryWhen operator receives an errors observable, an observable that will emit an error
                // each time the stream we are trying throws an error.
                // retryWhen creates a new stream until the stream does not error out, every two seconds.
                retryWhen(errors => errors.pipe(
                    delayWhen(() => timer(2000))
                ))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'ADVANCED'))
            );
    }
}
