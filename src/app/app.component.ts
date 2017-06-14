import {Component, OnInit} from '@angular/core';
import {BehaviorSubjectSamples} from "./samples/behavior-subject-samples";
import {SwitchMapSamples} from "./samples/switch-map-samples";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RxJs samples. See console for output.';

  ngOnInit(): void {
    try{
      SwitchMapSamples.concurrent();
    }catch (e)
    {
      console.error(e);
    }
  }
}
