import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsEventsService } from '../../shared/google-analytics.service';

@Component({
  selector: 'app-proposal-ios',
  templateUrl: './proposal-ios.component.html',
  styleUrls: ['./proposal-ios.component.scss']
})
export class ProposalIosComponent implements OnInit {

  constructor(public googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }

  ngOnInit() {
  }
  emitAnalyticsClickEvent() {
    this.googleAnalyticsEventsService.setPageViewEvent('page-download-ios', 'download-ios');
  }

}
