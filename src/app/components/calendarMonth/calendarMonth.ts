import { Component, ElementRef, ViewChild, AfterViewInit, inject, Signal, signal, effect, input, output} from '@angular/core';
import { HolidaysService } from '../../services/holidays.service';
import { CalendarDay, CalendarMonthData, Holiday, HolidayWeight, paletasColores, WeightColor } from '../../interfaces/holidays';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'calendar-month',
  imports: [CommonModule],
  templateUrl: './calendarMonth.html' ,
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

selectedDays: Record<string, number> = {};
selectedDaysStyle: Record<string, string> = {};

calendarMonths = signal<CalendarMonthData[]>([]);
weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
holidayColor = 'rgb(50, 99, 71)';

constructor() {
     effect(() => {
          console.log('STATE:', this.$stateCode());
          if(this.$weightsSignal().length > 0 && this.$weightColors()?.length > 0){            
            this.generateCalendar(this.Year,this.$stateCode());            
          }    
        });
}

private generateCalendar(year: number, state: string): void {

  this.holidaysService.getHolidays().subscribe(data => {

    const storedSelectedDays = this.loadSelectedDays(year);

     // Load selected days from storage
      for (let key in storedSelectedDays) {
        const weight = storedSelectedDays[key];
        this.selectedDays[key] = weight;
      }
      

    const holidays = [
      ...(data['NACIONALES'] || []),
      ...(data[state] || [])
    ];

    const monthsArray: CalendarMonthData[] = [];

    for (let month = 0; month < 12; month++) {

      const startPadding = this.getStartColumn(month, year);
      const totalDays = new Date(year, month + 1, 0).getDate();

      const days: CalendarDay[] = [];

      for (let day = 1; day <= totalDays; day++) {

        const date = new Date(year, month, day);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        const holiday = holidays.find(h => {
          const [d, m] = h.day.split('-').map(Number);
          return d === day && m === (month + 1);
        });

        const weightData = this.$weightsSignal()
          .find(w => w.day.toLocaleDateString() === date.toLocaleDateString());

        const disabled = isWeekend || !!holiday;

        days.push({
          date,
          dayNumber: day,
          month: month + 1,
          isWeekend,
          isHoliday: !!holiday,
          holidayName: holiday?.name,
          weight: weightData?.weight,
          disabled,
          selected: !!storedSelectedDays[`${month + 1}-${day}`]
        });
      }
     
      monthsArray.push({
        monthIndex: month,
        monthName: new Date(year, month, 1)
          .toLocaleString('default', { month: 'long' }),
        startPadding,
        days
      });
      
    }
   
    this.calendarMonths.set(monthsArray);
  });
}

  getWeightColor(weight: number): string {
    const weightColor = this.$weightColors()?.find(wc => wc.weight === weight);
    return weightColor ? weightColor.color : 'rgb(255,255,255)';
  }

  private getStartColumn(month: number, year: number): number {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajuste para que Lunes sea el primer día
  }

private loadSelectedDays(year: number): Record<string, number> {
  const raw = localStorage.getItem(`selectedDays${year}`);
  console.log('Cargando selección guardada:', raw);
  return raw ? JSON.parse(raw) : {};
}

toggleSelection(day: CalendarDay) {
  const weight = day.weight ?? 1;
  const key = `${day.month}-${day.dayNumber}`;
  console.log(key);
  console.log(this.selectedDays);
  if (this.selectedDays[key]) {
    console.log(false);
    delete this.selectedDays[key];          
    day.selected = false;    
  } else {
    console.log(true);
    this.selectedDays[key] = weight;
    day.selected = true;    
  }  
  this.updateTotalVacationDays();  
} 

 
  updateTotalVacationDays() {
    let total = 0;
    for (let day in this.selectedDays) {
      total += this.selectedDays[day];
    }
    this.$pointsOut.emit(total);//Number(this.sumaPuntos.toFixed(3)));    
  }

  // Función para guardar la selección en localStorage
  saveSelection() {
    localStorage.setItem(`selectedDays${this.Year}`, JSON.stringify(this.selectedDays));
    alert('Selección guardada.');
  }

  // Función para cargar la selección desde localStorage al cargar la página
 loadSelection() {
    const savedSelection = localStorage.getItem(`selectedDays${this.Year}`);
    if (savedSelection) {
      this.selectedDays = JSON.parse(savedSelection);
      // Actualizar la visualización de los días seleccionados
      for (let day in this.selectedDays) {
        console.log('Día seleccionado cargado:', day);
        const [month, dayOfMonth] = day.split('-');
        const cellId = `${month}-${dayOfMonth}`;
        const cell = document.getElementById(cellId);
        console.log(cell);
        console.log('Celda encontrada:', `${month}-${dayOfMonth}`);
        if (cell != null) {
          console.log('Día seleccionado pintado:', day);
          cell?.classList.remove('noselect'); // Remove first to avoid duplicates
          cell?.classList.add('selected');
        }
      }
      this.updateTotalVacationDays();
    }
  }

  // Función para limpiar la selección de días
  clearSelection() {
    this.selectedDays = {};
    localStorage.setItem(`selectedDays${this.Year}`,'');      
    this.calendarMonths().forEach(month => {
      month.days.forEach(day => {
        day.selected = false;
      });
    });
    //this.saveSelection(); // Guardar selección vacía
    const selectedCells = document.querySelectorAll('.day.selected');
    selectedCells.forEach(cell => {
      cell.classList.remove('selected');
    });
    this.updateTotalVacationDays();
  }
  
 paletteValue(value:number):string{
  return paletasColores[value] || 'rgb(200,200,200)';
 }
 
  ngAfterViewInit(): void {
    //this.generateCalendar(this.Year,'AN');
    //this.loadSelection();
  } 

}
