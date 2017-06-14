import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";
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


export class BehaviorSubjectSamples {

  public static withAndWithoutShare() {
    console.log('---------- Without share:')
    BehaviorSubjectSamples.immdediate(false);

    console.log('---------- With share:')
    BehaviorSubjectSamples.immdediate(true);
  }


  public static immdediate(useShare: boolean) {
    let subj = new BehaviorSubject<number>(42);

    let source: Observable<number> = subj;

    if (useShare) {
      // share() breaks BehaviorSubject:
      // See also https://stackoverflow.com/questions/42825763/behaviorsubject-initial-value-not-working-with-share
      source = source.share();
    }

    subj.next(43);

    source.subscribe(res => {
      console.log('sub1', res);
    });

    source.subscribe(res => {
      console.log('sub2', res);
    });
  }


  public static asyncResult() {
    let subj = new BehaviorSubject<Observable<number>>(Observable.empty());
    let source = subj;

    let result = source.switchMap(val => {
      return val;
    });


    let inner = Observable.of(42)
    // .timer(3000)
    // .map(() => 42)
      .share();

    subj.next(inner);

    setTimeout(() => {
      // result already has the value, however 'end' is written _before_ result:
      result.subscribe(res => console.log('result', res));
      console.log('end');
    }, 2000);
  }


  private static ensureRunOnce<T>(source: Observable<T>): Observable<T> {
    let completedSubject = new Subject<T>();

    let subscriptionsCount = 0;
    let origSubscriptionSingleton;

    let gotOriginalValue = false;
    let originalValue: T;

    return new Observable((subscriber: Subscriber<T>) => {
        if (gotOriginalValue) {
          subscriber.next(originalValue);
          subscriber.complete();
          return;
        }

        subscriptionsCount++;
        console.log('shareForever+', subscriptionsCount);

        if (!origSubscriptionSingleton) {
          origSubscriptionSingleton = source.take(1).subscribe(res => {
            completedSubject.next(res);
          });
        }

        // add tear-down logic:
        subscriber.add(() => {
          subscriptionsCount--;
          console.log('shareForever-', subscriptionsCount);
          if (subscriptionsCount === 0 && origSubscriptionSingleton) {
            console.log('unsubscribing source from inside shareForever', subscriptionsCount);
            origSubscriptionSingleton.unsubscribe();
            origSubscriptionSingleton = null;
          }
        });

        completedSubject.subscribe(originalResult => {
          gotOriginalValue = true;
          originalValue = originalResult;
          subscriber.next(originalResult);
          subscriber.complete();
        });
      }
    )
  }


  public static  testEnsureRunOnce() {
    let source = new Observable(subscriber => {
      console.log('Long operation observable');
      let timeoutHandle = setTimeout(() => {
          timeoutHandle = null;
          console.log('hit');
          subscriber.next('a1');
          subscriber.complete();
        },
        2000);

      subscriber.add(() => {
        if (timeoutHandle != null) {
          console.log('cancelling...');
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
      });
    });


    source = BehaviorSubjectSamples.ensureRunOnce(source);

    let sub1 = source.subscribe(res => console.log('res1', res));
    setTimeout(() => sub1.unsubscribe(), 1000);

    let sub2 = source.subscribe(res => console.log('res2', res));
    setTimeout(() => sub2.unsubscribe(), 1200);


    setTimeout(() => {
      source.subscribe(res => console.log('res2', res));
    }, 3000);

    setTimeout(() => {
      console.log('Then, after the long wait, subscribe again, and...');
      source.subscribe(res => console.log('...immediately get the result', res));
      console.log("...and it's done now.");
    }, 10000);
  }


  public static switchMapOnBehaviorSubject() {
    let subj1 = new BehaviorSubject<number>(null);

    let subj2_a = new Observable(subscriber => {
      console.log('Long operation observable');
      let timeoutHandle = setTimeout(() => {
          timeoutHandle = null;
          console.log('hit');
          subscriber.next('a1');
          subscriber.complete();
        },
        2000);

      subscriber.add(() => {
        if (timeoutHandle != null) {
          console.log('cancelling...');
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
      });
    });

    subj2_a = BehaviorSubjectSamples.ensureRunOnce(subj2_a);


    //let resultObs: Observable<string>;
    let subj2_b = new Observable(
      subscriber => {
        console.log('-----subj2_b');

        setTimeout(() => {
          subscriber.next('b1');
          subscriber.complete();
        }, 100);
      });
    subj2_b = BehaviorSubjectSamples.ensureRunOnce(subj2_b);

    BehaviorSubjectSamples.getSwitchMap(subj1, subj2_a, subj2_b).subscribe(str => console.log('result:', str));
    subj1.next(101);

    // setTimeout(() => {
    //   BehaviorSubjectSamples.getSwitchMap(subj1, subj2_a, subj2_b).subscribe(str => console.log('\tresultX:', str));
    // }, 2000);


  //  setTimeout(() => subj1.next(102), 500);

    // setTimeout(() => result.subscribe(str => console.log('\tresult2:', str))
    //   , 3000);
  }

  private static smCount = 0;

  private static   getSwitchMap(out: Observable<number>, in1: Observable<string>, in2: Observable<string>,) {
    return out.switchMap(
      num => {
        BehaviorSubjectSamples.smCount++;
        console.log('-----------------switch map', BehaviorSubjectSamples.smCount, num);

        if (num == null)
          return Observable.empty();

        let result: Observable<string>;
        if (num == 101) {
          result = in1.map(str => str + '_' + num);
        } else {
          result = in2.map(str => str + '_' + num);
        }
        return result;
      });
  }
}
