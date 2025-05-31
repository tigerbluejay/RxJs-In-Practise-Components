# RxJS Angular Observables: Complete Reference

This document serves as an extensive reference for developers exploring RxJS observables in Angular. Each section includes a concise theoretical explanation of core RxJS concepts and operators, followed by annotated code snippets.

### Streams

Streams represent sequences of asynchronous events over time, such as clicks, HTTP responses, or timer-based events. In JavaScript, they are modeled by constructs like setInterval, setTimeout, and DOM events. Unlike arrays, streams emit values as they occur and can potentially continue indefinitely. Understanding streams is foundational to working with RxJS.

```javascript
document.addEventListener('click', evt => console.log(evt));
setInterval(() => console.log("tick"), 1000);
setTimeout(() => console.log("once"), 3000);
```

### RxJS

RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using observables. It enables declarative composition and transformation of asynchronous streams. RxJS avoids deeply nested callbacks, replacing them with powerful operators that simplify complex asynchronous logic. It's ideal for handling events, HTTP requests, and real-time data.

### Observables

Observables are the primary abstraction for working with streams in RxJS. They act as blueprints for producing values over time and are only activated upon subscription. Observables support multiple emissions, error handling, and completion logic, allowing granular control of asynchronous flows.

```ts
const interval$ = interval(1000);
interval$.subscribe(val => console.log("stream =>", val));
```

### Errors, Completion and Unsubscription

Each observable can emit values (next), signal an error (error), or indicate completion (complete). These are mutually exclusive: once an observable errors or completes, it stops emitting. Subscriptions can be manually cancelled using unsubscribe, which is critical for avoiding memory leaks in Angular.

```ts
const sub = interval$.subscribe(console.log);
setTimeout(() => sub.unsubscribe(), 5000);
```

### Create Our Own Observable

You can create custom observables using the Observable constructor. This gives you full control over how values are emitted, when errors are thrown, and when the stream completes. This is useful for wrapping non-observable async operations like fetch or third-party APIs.

```ts
const http$ = new Observable(observer => {
  fetch('/api/courses')
    .then(res => res.json())
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(err => observer.error(err));
});
```

### The map Operator

The map operator transforms each value emitted by the source observable using a provided function. It is similar to JavaScript's array map, but for streams. It's commonly used to reshape HTTP responses or project values into new formats.

```ts
http$.pipe(map(res => Object.values(res['payload'])));
```

### Observable Concatenation

concat allows sequential execution of multiple observables. It subscribes to each observable in order, waiting for each one to complete before moving to the next. This is useful when order matters and emissions must happen sequentially.

```ts
concat(of(1,2,3), of(4,5,6)).subscribe(console.log);
```

### Imperative vs Reactive Approaches

Imperative code handles side-effects directly, making it harder to scale and test. Reactive code separates data streams and transformations from execution, allowing clearer, declarative logic. Angular's use of RxJS promotes a reactive style that improves readability and maintainability.

tap and shareReplay Operators

tap allows performing side effects (like logging) without altering the stream. shareReplay caches emissions from the source observable and shares them with future subscribers, ensuring a single execution and avoiding repeated side-effects like HTTP calls.

```ts
courses$.pipe(tap(() => console.log("executed")), shareReplay());
```

### Merge Observable Combination

merge combines multiple observables and emits values as they arrive, interleaving them. It's ideal for concurrent operations where the order of emission is not important. This makes it powerful for real-time updates and user input streams.

```ts
merge(interval(1000), interval(1000).pipe(map(v => v * 10)))
  .subscribe(console.log);
```

### filter Operator

The filter operator excludes values from the stream that don't satisfy a predicate. It's used to remove invalid forms, irrelevant input, or conditional logic directly within observable pipelines.

```ts
form.valueChanges.pipe(filter(() => form.valid))
```

### concatMap

concatMap maps each value to an inner observable and queues emissions so that only one inner observable runs at a time. It's especially useful when performing sequential HTTP requests based on user input.

```ts
form.valueChanges
  .pipe(filter(() => form.valid), concatMap(changes => saveCourse(changes)))
```

### Cancellation of Observables

Cancelling a subscription stops the observable from emitting further values and can abort side-effects like HTTP calls. This is critical for avoiding memory leaks and preventing race conditions in Angular apps.

```ts
const sub = http$.subscribe();
setTimeout(() => sub.unsubscribe(), 0);
```

### mergeMap

mergeMap is like concatMap, but it does not wait for the inner observable to complete before starting the next one. It’s ideal for parallelizing tasks like concurrent HTTP requests or animations.

```ts
form.valueChanges
  .pipe(filter(() => form.valid), mergeMap(changes => saveCourse(changes)))
```

### exhaustMap

exhaustMap ignores new source values until the current inner observable completes. This prevents duplicate submissions from rapid user input and ensures that only one operation is in flight at a time.

```ts
fromEvent(button, 'click')
  .pipe(exhaustMap(() => saveCourse()))
```

### debounceTime, distinctUntilChanged, and switchMap

debounceTime waits for a pause in emissions before passing on the last value. distinctUntilChanged avoids repeating identical values. switchMap cancels previous inner observables when a new value is emitted, ensuring only the latest result is used.

```ts
fromEvent(input, 'keyup')
  .pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(search => loadLessons(search))
  )
```

### Error Handling Strategy: Catch and Provide Fallback

Use catchError to handle errors and return a fallback observable, allowing the app to continue operating with degraded functionality instead of crashing.

```ts
.catchError(err => of([{ id: 0, description: 'Fallback course' }]))
```

### Error Handling Strategy: Catch and Rethrow

Sometimes you want to handle an error locally but rethrow it so that upstream subscribers are aware. throwError emits a terminal error to signal failure while allowing for logging and cleanup.

```ts
.catchError(err => {
  console.error(err);
  return throwError(() => err);
}).finalize(() => console.log("Cleanup"));
```

### Error Handling Strategy: Retry

retryWhen re-subscribes to a failed observable after a delay, based on the emissions from another observable. This is useful for handling transient errors like network issues.

```ts
.retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
```

### startWith Operator

startWith emits an initial value immediately upon subscription, useful for providing default behavior like showing initial data before user input.

```ts
.fromEvent(input, 'keyup').pipe(startWith(''))
```

### debounceTime and throttleTime

Both operators control the rate of emissions. debounceTime waits for silence before emitting. throttleTime allows one value through, then silences emissions for a set period. Use them for optimizing performance-sensitive inputs.

```ts
debounceTime(400);
throttleTime(500);
```

### Custom Operator Design: The debug Operator

The debug operator is a custom operator that logs emissions based on the defined logging level. It wraps the tap operator and makes stream debugging more flexible by selectively logging.

```ts
export const debug = (level, message) => (source) =>
  source.pipe(tap(val => console.log(message, val)));
```

### forkJoin Operator

forkJoin runs multiple observables in parallel and emits a single array of their last emitted values once all complete. It’s useful for combining final results from multiple HTTP requests or operations.

```ts
forkJoin([course$, lessons$])
  .subscribe(([course, lessons]) => console.log(course, lessons));
```

This reference should guide your understanding and implementation of reactive patterns with RxJS in Angular. Each concept is both theoretically explained and backed with practical code.
