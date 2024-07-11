import { Observable } from "rxjs";

export function createHttpObservable<T>(url:string) : Observable<T> {
    return new Observable(observer => {
      
      const controller = new AbortController();
      // we can create a signal
      const signal = controller.signal;
      // if the signal returns true we abort

      // we provide a property called signal to link it
      fetch(url, {signal})
      // fetch('/api/courses')
        .then(response => {
          return response.json();
        })
        .then(body => {
          observer.next(body);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
      

      // controller.abort() cancels the http request
      // but we will call it only if we unsubscribe
      // and when we unsubscribe the following line
      // executes.
      // unsubscribe triggers the function below.
      return () => controller.abort();

      });
    }

