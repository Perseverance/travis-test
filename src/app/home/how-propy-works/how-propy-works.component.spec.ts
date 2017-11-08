import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HowPropyWorksComponent} from './how-propy-works.component';

describe('HowPropyWorksComponent', () => {
	let component: HowPropyWorksComponent;
	let fixture: ComponentFixture<HowPropyWorksComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HowPropyWorksComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HowPropyWorksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
