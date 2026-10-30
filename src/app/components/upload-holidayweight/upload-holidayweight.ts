import { Component, output } from '@angular/core';
import { read, utils } from 'xlsx';
import { HolidayWeight } from '../../interfaces/holidays';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'upload-holidayweight',
  imports: [],
  templateUrl: './upload-holidayweight.html'
})
export class UploadHolidayweight { 

items: HolidayWeight[] = [];
weights = output<HolidayWeight[]>();

  onFileSelected(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const buffer = e.target.result as ArrayBuffer;

      // ⭐ IMPORTANTE: read() y type: 'array'
      const workbook = read(buffer, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json(sheet, { header: 1 }) as any[];

      // Saltamos cabecera
      
      this.items = rows.slice(1).map((r: any[]) => ({
        day: this.excelDateToJSDate(r[0]),
        weight: Number(1 - r[1])
      }));      
      this.weights.emit(this.items);
    };

    reader.readAsArrayBuffer(file);
  }

  excelDateToJSDate(serial: number): Date {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Epoch de Excel
    const days = Math.floor(serial);
    const ms = days * 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + ms);    
  }

}
