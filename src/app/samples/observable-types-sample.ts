import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/take";
import "rxjs/add/operator/publishBehavior";
import "rxjs/add/operator/toPromise";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/of";
import "rxjs/add/observable/timer";
import "rxjs/add/observable/range";
import {Http, Response} from "@angular/http";
import {Subject} from "rxjs/Subject";

export class ObservableTypesSamples {

  public static range() {
    let source = Observable.range(1, 10);

    source.subscribe(res => console.log('sub1', res));

    source.subscribe(res => console.log('\tsub2', res));
  }


  public static networkCall(http: Http) {

    let networkCall = http.get('http://www.amp.com.au');

    networkCall.subscribe((res: Response) => {
      console.log('sub1', res.text().substr(0, 100));
    });


    networkCall.subscribe((res: Response) => {
      console.log('sub2', res.text().substr(0, 100));
    })
  }


  public static sharedNetworkCall(http: Http) {
    let networkCall = http.get('http://www.amp.com.au').share();

    networkCall.subscribe((res: Response) => {
      console.log('sub1', res.text().substr(0, 100));
    });

    networkCall.subscribe((res: Response) => {
      console.log('sub2', res.text().substr(0, 100));
    });


    setTimeout(() => {
      networkCall.subscribe((res: Response) => {
        console.log('sub3', res.text().substr(0, 100));
      });
    }, 3000);
  }


  public static subject() {
    let source = new Subject<number>();

    source.subscribe(res => console.log('subscription1', res));


    source.next(1);
    source.next(2);
    source.subscribe(res => console.log('\tsubscription2', res));

    source.next(3);
    source.next(4);
  }


  private static getHotObservable(): Observable<number> {
     let subject = new Subject<number>();

    let i = 0;
    setInterval(() => {
      subject.next(i++);
    }, 1000);

    return subject;
  }


  public static hotObservable() {
    let source = ObservableTypesSamples.getHotObservable();

    let lastReceieved;
    source.subscribe(res => {
      lastReceieved= res;
      console.log('subscription1', res);
    });

    setTimeout(() => {
      console.log('\tlastReceieved:', lastReceieved);
      source.subscribe(res => console.log('\tsubscription2', res));

    }, 3500);

  }
}
