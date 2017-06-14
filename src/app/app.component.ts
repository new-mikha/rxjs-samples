import {Component, OnInit} from '@angular/core';
import {BehaviorSubjectSamples} from "./samples/behavior-subject-samples";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RxJs samples. See console for output.';

  ngOnInit(): void {
    try{
      BehaviorSubjectSamples.switchMapOnBehaviorSubject();
    }catch (e)
    {
      console.error(e);
    }
  }
}
