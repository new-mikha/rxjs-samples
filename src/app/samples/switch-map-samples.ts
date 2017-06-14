import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/timeInterval";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/observable/interval";

export class SwitchMapSamples {
  public static concurrent() {
    let sourceSubject = new Subject<number>();

    let result = sourceSubject
      .switchMap(num => {
        console.log('----- switch map called!', num);
        return Observable.interval(500).map(i => `switchMappedValue ${num}`);
      });

    let subsc1 = result.subscribe(res => {
      console.log('subscription1:', res);
    });

    sourceSubject.next(1);

    let subsc2 = result.subscribe(res => {
      console.log('\tsubscription2:', res);
    });


    setTimeout(() => {sourceSubject.next(2);}, 5000);


  }
}
