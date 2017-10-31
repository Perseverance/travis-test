import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleMapsMarkersService {

	private markerSize = new google.maps.Size(50, 30);
	private labelOrigin = new google.maps.Point(25, 12);

	constructor() { }

	private DEFAULT_MARKER_ICON = environment.mapConfig.DEFAULT_MARKER_ICON;
	private DEFAULT_MARKER_ICON_HOVERED = environment.mapConfig.DEFAULT_MARKER_ICON_HOVERED;
	private DEFAULT_MARKER_LABEL_COLOR = environment.mapConfig.DEFAULT_MARKER_LABEL_COLOR;
	private DEFAULT_MARKER_LABEL_FONT_SIZE = environment.mapConfig.DEFAULT_MARKER_LABEL_FONT_SIZE;

	public get defaultMarkerSettings(): object {
		return {
			url: this.DEFAULT_MARKER_ICON,
			size: this.markerSize,
			scaledSize: this.markerSize,
			labelOrigin: this.labelOrigin
		};
	}

	public get hoverMarkerSettings(): object {
		return {
			url: this.DEFAULT_MARKER_ICON_HOVERED,
			size: this.markerSize,
			scaledSize: this.markerSize,
			labelOrigin: this.labelOrigin
		};
	}

	public getMarkerLabel(text: string): object {
		return {
			text,
			color: this.DEFAULT_MARKER_LABEL_COLOR,
			fontSize: this.DEFAULT_MARKER_LABEL_FONT_SIZE
		};
	}

}
