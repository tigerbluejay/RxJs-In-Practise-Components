import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, concat, fromEvent, interval, noop, of, timer } from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

////////////////////////////// STREAMS //////////////////////////

  //   // first example of a stream of values:
  //   // emits multiple values and never completes
  //   // every click you do in the application will be a stream of values
  //   // we detect the whole document, we detect a stream of clicks
  //   // subscribing to the click event and print the event to the console.
  //   document.addEventListener('click', evt => {
  //     console.log(evt);
  //   });

  //   // second example of a stream:
  //   // emits multiple values and never completes
  //   // javascript intervals
  //   // an interval that is emitting a new value each second
  //   let counter = 0;
  //   setInterval(() => {
  //     console.log(counter);
  //     counter++;
  //   }, 1000);

  //   // third example of a stream:
  //   // set time out is a special type of stream
  //   // it emits one value and then completes
  //   setTimeout(() => {
  //     console.log("finished...");
  //   }, 3000);

  // }

////////////////////////////// RXJS //////////////////////////

  // These three separate streams are typically combined
  // For example, after the user clicks on the screen, we wait
  // three seconds and then trigger the value count stream
  // but doing this is hard with nesting the calls
  // and can lead to call back hell
  // Enter RxJs library
  // Reactive Extensions for Javascript Library
  // It makes it simple to combine streams together in a maintainable well.
  // This is an alternative of nesting streams which can cause many complications
  // nested streams (we don't want to do this)

////////////////////////////// OBSERVABLES //////////////////////////


  // OBSERVABLES
  // Observables are blueprints for streams
  // Once subscribed to we are instantiating the observable

  // const interval$ = interval(1000); // interval$ is of type Observable<number>
  
  // // when we subscribe we are instantiating
  // // here we are instantiating two different streams
  // interval$.subscribe(val => console.log("stream 1 =>" + val));
  // interval$.subscribe(val => console.log("stream 2 =>" + val));

  // // this new observable waits three seconds to output the interval (every 1 second)
  // const intervalwithTimer$ = timer(3000, 1000);

  // intervalwithTimer$.subscribe(val => console.log("stream 1 =>" + val));

  // // third example of observables:
  // const click$ = fromEvent(document, 'click'); // click$ is of type Observable<Event>
  
  // // here we instantiate, when we click on the document
  // // the event will be logged to the console.
  // click$.subscribe(evt => console.log(evt));


/////////////////////////ERRORS, COMPLETION AND UNSUBSCRIPTION //////////////////////////
////////////////////////////// FROM STREAMS //////////////////////////

// // we create an observable
// const interval$ = timer(3000, 1000);
// // subscribe to it (instantiate it)
// const sub = interval$.subscribe(val => console.log("stream 1 =>" + val));
// // we can also choose to unsubscribe from it to stop it
// setTimeout(() => sub.unsubscribe(), 5000);

// const click$ = fromEvent(document, 'click');
// click$.subscribe(
//   evt => console.log(evt),
//   // we can choose what to do in case of an error
//   err => console.log(err),
//   // or what to do in case of completion
//   () => console.log("completed")
// );
//   // note that a subscribed event can either run
//   // error out or complete
//   // erroring out and completing are mutually exclusive
//   // if one happens the other cannot.

///////////////////////// CREATE OUR OWN OBSERVABLE //////////////////////////

// // remember to write in the terminal npm start, and npm run server
// // to have our server that serves the data available

// // create an observable like interval() or timer()
// // we assign it to a variable http$
// // the observer is private to the implementation of the observable
// // it will allow us to emit a value (with next) error it (with error) or complete it (with complete)
// const http$ = new Observable(observer => {

//   // fetch returns a promise
//   // a promise will get immediately executed once defined (unlike an observable which
//   // requires you to subscribe)
//   // the fetch implements the behavior of this observable
//     fetch('/api/courses')
//       .then(response => {
//         // retrieves the body of the data
//         return response.json();
//       })
//       .then(body => {
//         // we emit the json payload (body) returned by the previous
//         // then method
//         observer.next(body);
//         observer.complete();
//       })
//       .catch(err => {
//         // this catches a dns error or a network error for example
//         observer.error(err);
//       })
// });

// // when we subscribe to the observable, the behavior defined
// // inside the observable above gets triggered.
// http$.subscribe(
//   courses => console.log(courses),
//   // the second parameter corresponds to the error
//   // noop stands for no operation, meaning that nothing is passed
//   noop,
//   // the third parameter is what to do when the operation completes
//   () => console.log('completed')
// );

// // the advantage of doing this: is we can combine streams!
// // with rxjs operators

///////////////////////// EXTRACT THE OBSERVABLE TO A FUNCTION  //////////////
///////////////////////// AND USE THE MAP OPERATOR  //////////////////////////

        // // we retrieve the data into an observable
        // const http$ = createHttpObservable('/api/courses');

        // // we transform the http observable into the courses observable
        // // using the pipe to pipe multiple rxjs operators, in this case, map
        // const courses$ = http$
        //     .pipe(
        //       map(response => Object.values(response["payload"]))
        //     );

        // // we instantiate the courses observable by subscribing to it
        // // we can watch for the results in the console inspecting the about component
        // courses$.subscribe(
        //   courses => console.log(courses),
        //   noop,
        //   () => console.log('completed')
        // );

    ///////////////////////// OBSERVABLE CONCATENATION  //////////////////

    // the of function, is useful for defining observables
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const results$ = concat(source1$, source2$, source3$);

    // only when we subscribe will the concatenation execute
    results$.subscribe(console.log);

  }
}
