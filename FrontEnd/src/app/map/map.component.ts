import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input()  longitud:number=3.4567;
  @Input()  latitud:number=-3.4567;
  @Input() ubicacion:boolean=true;
  @Input() accurate:boolean=false;


  constructor() { }

  ngOnInit() {
  }

}
