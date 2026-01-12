import { CommonModule } from '@angular/common';
import { HolidayWeight, paletasColores, WeightColor } from './../../interfaces/holidays';
import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'weight-legend',
  imports: [CommonModule],
  templateUrl: './weightLegend.html'
})
export class WeightLegend {
  items = input<HolidayWeight[]>();
  distinctDays: HolidayWeight[] = [];
  colors : WeightColor[] = [];
  distinctColors = output<WeightColor[]>();

  constructor() {
  effect(() => {
    
    this.distinctDays = [...new Map((this.items() ?? []).map(e => [e.weight, e])).values()];
    let count = 0;
    this.colors = this.distinctDays.map(dw => {      
      return { weight: dw.weight, color: this.valueToRGB(dw.weight) };    
    });
    //add selected color at the end
   // this.colors.push( { weight: -1, color: 'yellow' } );
    this.distinctColors.emit(this.colors);    
  });
 }
 
getRandomInt(max:number) {
  console.log(Math.random());
  return Math.floor(Math.random() * max);
}

 valueToRGB(value: number): string {
  const r = this.getRandomInt(255);
  const b = this.getRandomInt(255);  
  const g = this.getRandomInt(255);//0; 
  return `rgb(${r}, ${g}, ${b})`;
}

}
