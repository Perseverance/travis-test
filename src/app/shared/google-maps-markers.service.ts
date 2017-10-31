import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleMapsMarkersService {

	constructor() { }

	private DEFAULT_MARKER_ICON = environment.mapConfig.DEFAULT_MARKER_ICON;
	private DEFAULT_MARKER_ICON_HOVERED = environment.mapConfig.DEFAULT_MARKER_ICON_HOVERED;
	private DEFAULT_MARKER_LABEL_COLOR = environment.mapConfig.DEFAULT_MARKER_LABEL_COLOR;
	private DEFAULT_MARKER_LABEL_FONT_SIZE = environment.mapConfig.DEFAULT_MARKER_LABEL_FONT_SIZE;

	public get defaultMarkerSettings(): object {
		const markerSize = new google.maps.Size(50, 30);
		const labelOrigin = new google.maps.Point(25, 12);
		return {
			url: this.DEFAULT_MARKER_ICON,
			size: markerSize,
			scaledSize: markerSize,
			labelOrigin: labelOrigin
		};
	}

	public get hoverMarkerSettings(): object {
		const markerSize = new google.maps.Size(50, 30);
		const labelOrigin = new google.maps.Point(25, 12);
		return {
			url: this.DEFAULT_MARKER_ICON_HOVERED,
			size: markerSize,
			scaledSize: markerSize,
			labelOrigin: labelOrigin
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
