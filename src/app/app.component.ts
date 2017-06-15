import {Component, OnInit} from '@angular/core';
import {BehaviorSubjectSamples} from "./samples/behavior-subject-samples";
import {SwitchMapSamples} from "./samples/switch-map-samples";
import {ObservableTypesSamples} from "./samples/observable-types-sample";
import {Http} from "@angular/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RxJs samples. See console for output.';


  constructor(private http: Http){

  }

  ngOnInit(): void {
    try{
      ObservableTypesSamples.hotObservable();
    }catch (e)
    {
      console.error(e);
    }
  }
}
