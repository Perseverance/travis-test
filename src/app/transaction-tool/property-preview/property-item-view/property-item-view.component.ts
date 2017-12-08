import { Component, OnInit, Input } from '@angular/core';
import { LoadPropertyService } from '../../load-property.service';

@Component({
  selector: 'app-property-item-view',
  templateUrl: './property-item-view.component.html',
  styleUrls: ['./property-item-view.component.scss']
})
export class PropertyItemViewComponent implements OnInit {
  public property: any;
  @Input('deedAddress') deedAddress;
  constructor(private loadProperty: LoadPropertyService) { }

  async ngOnInit() {
    const result = await this.loadProperty.getProperty(this.deedAddress);
    this.property = result;
  }

}