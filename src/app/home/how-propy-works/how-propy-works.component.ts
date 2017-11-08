import {Component, OnInit} from '@angular/core';
import {NgxCarousel} from 'ngx-carousel';
import {NgxCarouselStore} from 'ngx-carousel/src/ngx-carousel/ngx-carousel.interface';

@Component({
	selector: 'app-how-propy-works',
	templateUrl: './how-propy-works.component.html',
	styleUrls: ['./how-propy-works.component.scss']
})
export class HowPropyWorksComponent implements OnInit {
	public INTERVIEW_VIDEO = 'https://www.youtube.com/embed/ztS1f4sVU0A';
	public BLOOMBERG_VIDEO = 'https://www.youtube.com/embed/MEiOCQBZwes';
	public BG_OFFICE_VIDEO = 'https://www.youtube.com/embed/C2XMYrlVBiI';
	public AUTOPLAY_COMMAND = '?autoplay=1';
	public interviewCNBCAfricaUrl = this.INTERVIEW_VIDEO;
	public interviewCNBCAfricaThumb = 'https://img.youtube.com/vi/ztS1f4sVU0A/0.jpg';
	public bloombergTvUrl = this.BLOOMBERG_VIDEO;
	public bloombergTvThumb = 'https://img.youtube.com/vi/MEiOCQBZwes/0.jpg';
	public propysOfficeBulgariaUrl = this.BG_OFFICE_VIDEO;
	public propysOfficeBulgariaThumb = 'https://img.youtube.com/vi/C2XMYrlVBiI/0.jpg';
	public carouselBanner: NgxCarousel;
	public videoThumbnailClicked = false;

	constructor() {
	}

	ngOnInit() {
		this.carouselBanner = {
			grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
			slide: 1,
			point: {
				visible: false,
				pointStyles: ``
			},
			loop: true
		};
	}

	public thumbnailInterviewClicked() {
		this.videoThumbnailClicked = true;
		this.interviewCNBCAfricaUrl += this.AUTOPLAY_COMMAND;
	}

	public thumbnailBloombergClicked() {
		this.videoThumbnailClicked = true;
		this.bloombergTvUrl += this.AUTOPLAY_COMMAND;
	}

	public thumbnailBGOfficeClicked() {
		this.videoThumbnailClicked = true;
		this.propysOfficeBulgariaUrl += this.AUTOPLAY_COMMAND;
	}

	public onVideoChanged() {
		this.videoThumbnailClicked = false;
		this.interviewCNBCAfricaUrl = this.INTERVIEW_VIDEO;
		this.bloombergTvUrl = this.BLOOMBERG_VIDEO;
		this.propysOfficeBulgariaUrl = this.BG_OFFICE_VIDEO;
	}
}
