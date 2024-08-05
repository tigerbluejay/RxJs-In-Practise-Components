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

          // error out if the http response was correctly returned but it is an errored response
          if (response.ok) {
            return response.json();
          }
          else {
            observer.error('Request failed with status code: ' + response.status);
          }

          return response.json();
        })
        .then(body => {
          observer.next(body);
          observer.complete();
        })
        // this catch will be triggered in the case of a fatal error
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

