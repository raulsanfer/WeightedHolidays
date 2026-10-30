import { Holiday, HolidayWeight, WeightColor } from './interfaces/holidays';
import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarMonth } from "./components/calendarMonth/calendarMonth";
import { RegionSelectorAdv } from "./components/region-selector-adv/region-selector-adv";
import { UploadHolidayweight } from "./components/upload-holidayweight/upload-holidayweight";
import { WeightLegend } from "./components/weightLegend/weightLegend";

// Define HeightColor type if not imported from elsewhere
export type HeightColor = {
  color: string;
  height: number;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalendarMonth, RegionSelectorAdv, UploadHolidayweight, WeightLegend],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Babel-holidays';
  readonly year = this.getValidYear(new URLSearchParams(window.location.search).get('year'));
  query = signal<string>('');
  app_weights = signal<HolidayWeight[]>([]);
  app_weightColors = signal<WeightColor[]>([]);
  selectedPoints = signal<number>(0);

  constructor() {    
    effect(() => {
      if(this.app_weights().length > 0){
        //console.log('PESOS RECIBIDOS EN APP COMPONENT:', this.app_weights());        
      }
      if(this.app_weightColors().length > 0){
        //console.log('COLORES RECIBIDOS EN APP COMPONENT:', this.app_weightColors());
      }   
    });
  }

  private getValidYear(value: string | null): number {
    const year = Number(value);
    const nowyear = new Date().getFullYear();
    return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : nowyear;
  }
    
  // holidaysResource = rxResource({
  // request: () =>({query:this.query()}),
  // loader: ({request})=>{        
  //       if (!request.query) return of([]);
  //       console.log(request.query);
  //       return this.holidaysService.getHolidaysByState('ES',request.query,2025);
  //    }
  //  })

}
