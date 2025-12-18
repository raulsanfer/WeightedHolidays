import { Component, ElementRef, ViewChild, AfterViewInit, inject, Signal, signal, effect, input, output} from '@angular/core';
import { HolidaysService } from '../../services/holidays.service';
import { Holiday, HolidayWeight, paletasColores, WeightColor } from '../../interfaces/holidays';

@Component({
  selector: 'calendar-month',
  imports: [],
  template: '<div #calendar class="calendar"></div>',
  styleUrls: ['./calendarMonth.css']  
})
export class CalendarMonth implements AfterViewInit{
@ViewChild('calendar', { static: true }) calendarRef!: ElementRef<HTMLDivElement>;
  
holidaysService = inject(HolidaysService);
Year = 2026;
$weightsSignal = input<HolidayWeight[]>([]);
$weightColors = input<WeightColor[]>([]);
$stateCode = input<string>('MD');
holidaysData: Record<string, Holiday[]> | undefined;
holidays : Holiday[] = [];
$pointsOut = output<number>();
//sumaPuntos: number = 0;
selectedDays: Record<string, number> = {};

constructor() {
     effect(() => {
          console.log('STATE:', this.$stateCode());
          if(this.$weightsSignal().length > 0 && this.$weightColors()?.length > 0){
            this.generateCalendar(this.Year,this.$stateCode());
          }    
        });
}

/*updateTotalVacationDays() {
    let total = 0;
    for (let day in this.selectedDays) {
      total += this.selectedDays[day];
    }
    document.getElementById('totalVacationDays').innerText = total;
  }*/

private generateCalendar(year: number,state: string): void {
  
  const holidayColor = 'rgb(50, 99, 71)'; // Color para festivos   
  const calendar = this.calendarRef.nativeElement;
  calendar.innerHTML = ''; // Limpiar calendario previo

  this.holidaysService.getHolidays().subscribe(data => {
    
    this.holidaysData = data; 
    this.holidays = [...(this.holidaysData['NACIONALES'] || []), ...(this.holidaysData[state] || [])];
 
    for (let month = 0; month < 12; month++) {
      const monthContainer = document.createElement('div');
      monthContainer.classList.add('month');

      // Nombre del mes
      const monthName = document.createElement('div');
      monthName.classList.add('month-name');
      monthName.textContent = new Date(this.Year, month, 1).toLocaleString('default', { month: 'long' });
      monthContainer.appendChild(monthName);

      // Días de la semana
      const weekdaysContainer = document.createElement('div');
      weekdaysContainer.classList.add('weekdays');
      const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      weekdays.forEach(day => {
        const cell = document.createElement('div');
        cell.textContent = day;
        weekdaysContainer.appendChild(cell);
      });
      monthContainer.appendChild(weekdaysContainer);

      // Contenedor de días
      const daysContainer = document.createElement('div');
      daysContainer.classList.add('days');

      const startColumn = this.getStartColumn(month, this.Year);

      // Espacios vacíos antes del primer día
      for (let i = 0; i < startColumn; i++) {
        const emptyCell = document.createElement('div');
        daysContainer.appendChild(emptyCell);
      }

      // Días del mes
      const totalDays = new Date(this.Year, month + 1, 0).getDate();
      for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.textContent = day.toString();
        cell.classList.add('day', 'noselect');

        const valueKey = `${month + 1}-${day}`;
        const currentDate = new Date(this.Year, month, day);
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
                
        //console.log('datos fecha',this.holidays);
        const isHoliday = this.holidays.find(holiday => {
          const [holidayDay, holidayMonth] = holiday.day.split('-').map(Number);          
          return holidayDay === day && holidayMonth === (month + 1);
        });
        if(day===28 && month + 1 === 2) {
          console.log('Festivo encontrado el 28/2:', isHoliday);
        }
        const holidayName = isHoliday ? isHoliday.name : null;

        const currentWeight = this.$weightsSignal().find(w => w.day.toLocaleDateString() === currentDate.toLocaleDateString());
        if (isWeekend) {
          cell.classList.add('disabled');          
          cell.title = 'No se puede seleccionar este día';                    
          cell.style.backgroundColor = 'rgb(220,220,220)';
        }
        else if (isHoliday) {
          cell.classList.add('disabled');
          cell.setAttribute('title', holidayName ? `Festivo: ${holidayName}` : 'Festivo');         
          cell.style.backgroundColor = holidayColor;
          cell.style.color = 'rgb(255,255,255)';
        }
        else if (currentWeight === undefined)
        {
          //vale 1
          cell.addEventListener('click', () => this.toggleSelection(cell, month + 1, day, 1));
          cell.setAttribute('title', '1');
        }
        else {
          const getColor = this.$weightColors()?.find(wc => {
            if(wc.weight === currentWeight.weight){              
              return wc;
            }
            return undefined;
          });
          cell.style.backgroundColor = getColor ? getColor.color : "rgb(255,255,255)";
          cell.addEventListener('click', () => this.toggleSelection(cell, month + 1, day, currentWeight.weight));
          cell.setAttribute('title', currentWeight.weight.toString());
           cell.style.color = 'rgb(255,255,255)';
        }

        cell.id = valueKey;
        daysContainer.appendChild(cell);
      }

      monthContainer.appendChild(daysContainer);
      calendar.appendChild(monthContainer);
    }
     });

  
  }

  private getStartColumn(month: number, year: number): number {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajuste para que Lunes sea el primer día
  }

 
  private toggleSelection(thiscell: HTMLElement, month: number, day: number, value: number): void {    
    const key = `${month}-${day}`;
    if (this.selectedDays[key]) {
      delete this.selectedDays[key];
    } else {
      this.selectedDays[key] = value;
    }
    const cell = document.getElementById(key);
    thiscell.classList.toggle('selected');

    //this.sumaPuntos+=value;    
    //this.$pointsOut.emit(Number(this.sumaPuntos.toFixed(3)));
    this.updateTotalVacationDays();
  }
 
  updateTotalVacationDays() {
    let total = 0;
    for (let day in this.selectedDays) {
      total += this.selectedDays[day];
    }
    this.$pointsOut.emit(total);//Number(this.sumaPuntos.toFixed(3)));
    //document.getElementById('totalVacationDays').innerText = total;
  }

 paletteValue(value:number):string{
  return paletasColores[value] || 'rgb(200,200,200)';
 }
 
  ngAfterViewInit(): void {
    //this.generateCalendar(this.Year,'AN');
  } 

}
