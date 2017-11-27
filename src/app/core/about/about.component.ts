import { GoogleAnalyticsEventsService } from './../../shared/google-analytics.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(public googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }

  ngOnInit() {
  }
  emitEmailContactAnalyticsClickEvent() {
    this.googleAnalyticsEventsService.emitEvent('page-about', 'email');
  }

} 
