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
    
    this.colors = this.distinctDays.map(dw => {      
      return { weight: dw.weight, color: this.valueToRGB(dw.weight) };    
    });
    
    this.distinctColors.emit(this.colors);    
  });
 }

 valueToRGB(value: number): string {
  const r = Math.random() * (255 - 0) + 0;// Math.max(0, 255);// Math.min(1, value)) ; // clamp 0–1
 const b = Math.random() * (255 - 0) + 0;//Math.max(0, 255);
  //const r = v;// Math.round(v * 255);        // rojo crece
  const g = 0;                          // verde fijo
  //const b = Math.round((1 - v) * 255);  // azul decrece

  return `rgb(${r}, ${g}, ${b})`;
}
}
