import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";

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

    source.subscribe(res => {
      console.log('sub1', res);
    });

    source.subscribe(res => {
      console.log('sub2', res);
    });
  }


  public static switchMapOnBehaviorSubject() {
    let subj1 = new BehaviorSubject<number>(null);
    let source = subj1;

    let subj2_a = new Observable(
      subscriber => {
        console.log('-----subj2_a');

        setTimeout(() => {
            subscriber.next('a1');
            subscriber.next('a2');
            subscriber.next('a3');
          },
          100);

        setTimeout(() => {
          subscriber.next('a4');
          subscriber.next('a5');
          subscriber.next('a6');
          // subscriber.complete();
        }, 1000);
      })
      .share();

    let subj2_b = new Observable(
      subscriber => {
        console.log('-----subj2_b');

        setTimeout(() => {
          subscriber.next('b1');
          subscriber.next('b2');
          subscriber.next('b3');
        }, 100);

        setTimeout(() => {
          subscriber.next('b4');
          subscriber.next('b5');
          subscriber.next('b6');
        }, 1000);
        // subscriber.complete();
      })
      .share();

    let resultObs: Observable<string>;

    let count = 0;
    let result = source.switchMap(
      num => {
        count++;
        console.log('-----------------switch map', count, num);

        if (num == null)
          return Observable.empty();


        if (num == 101) {
          resultObs = subj2_a.map(str => str + '_' + num);
        } else {
          resultObs = subj2_b.map(str => str + '_' + num);
        }

        return resultObs;
      });

    result.subscribe(str => console.log('result:', str));
    result.subscribe(str => console.log('\tresult3:', str));

    subj1.next(101);

    setTimeout(() => subj1.next(102), 500);

    // setTimeout(() => result.subscribe(str => console.log('\tresult2:', str))
    //   , 3000);
  }
}
