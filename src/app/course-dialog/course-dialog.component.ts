import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import moment from 'moment';
import {fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {

        //////////////////////// FORM DRAFT PRE SAVE (AUTO SAVE) EXAMPLE AND ////////////////
        //////////////////////// THE FILTER OPERATOR ////////////////////////////////////////
        // // in this example we use nested subscribes which is not good, in the next example
        // // we'll use observable concatenation to avoid the nested subscriptions


        // // valueChanges is an observable that is emitting objects with all the properties of the form
        // // if we change any value in the form a full object with all the new properties is being emitted.
        // this.form.valueChanges
        //     .pipe(
        //         // filter out the form values that are invalid
        //         // and exclude it from the output
        //         filter(() => this.form.valid)
        //     )
        //     .subscribe(changes => {

        //         // we use the fetch operator
        //         // fetch's method properties and other properties to specify the characteristics
        //         // of the http requests we are making.
        //         // rxjs method fromPromise takes a promise and converts it to an observable
        //         const saveCourse$ = fromPromise(fetch(`/api/courses/${this.course.id}`, {
        //             method: 'PUT',
        //             body: JSON.stringify(changes),
        //             headers: {
        //                 'content-type': 'application/json'
        //             }
        //         }));

        //         // subscribing to the observable triggers the http request.
        //         saveCourse$.subscribe();
        //     });


        ////////////////////////////////// CONCAT MAP /////////////////////////////////////////////
        // concatMap is an observable combination strategy that makes sure that our requests are sequential
        // only after one saveCourse request is finished do we make a second saveCourse request
        // and in the order the requests are emitted.
        // this is an example of observable concatenation

        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                // concatMap calls saveCourse, saveCourse will get us back an observable
                // the output of this mapping function will be an observable (which we then subscribe to)
                // concatMap takes the value from valueChanges, creating new observables, subscribing to them
                // then concatenating them together - so no nested subscriptions are needed here.
                concatMap(changes => this.saveCourse(changes))
            )
            .subscribe();
    }

    saveCourse(changes) {
        return fromPromise(fetch(`/api/courses/${this.course.id}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }


    ngAfterViewInit() {


    }



    close() {
        this.dialogRef.close();
    }

  save() {

  }
}
