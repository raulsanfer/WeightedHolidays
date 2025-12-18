import { Length } from './../../../node_modules/lightningcss/node/ast.d';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import * as XLSX from "xlsx";
import { Holiday } from "../interfaces/holidays";

const API_URL = 'https://api.generadordni.es/v2/holidays/holidays';
const API_REGIONS_URL = 'https://api.generadordni.es/v2/holidays/states?country=ES';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  //constructor(private http: HttpClient) {}

  private http = inject(HttpClient);

  private excelPath = 'assets/FESTIVOS.xlsx';

  public getHolidays(): Observable<Record<string, Holiday[]>> {
    const excelData = this.http.get(this.excelPath, { responseType: 'arraybuffer' }).pipe(
      map(buffer => this.parseExcel(buffer))
    );    
    return excelData;
  }
  
 private parseExcel(buffer: ArrayBuffer): Record<string, Holiday[]> {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const result: Record<string, Holiday[]> = {};

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<any>(worksheet, {
        header: 1,
        raw: false,
        defval: ''
      });

      const holidays: Holiday[] = [];

      for (const row of json) {
        const day = row[0]?.toString().trim();
        const name = row[1]?.toString().trim();

        if (!day || !name) continue;

        holidays.push({ day, name });
      }

      result[sheetName] = holidays;
    });

    return result;
  }

    // getHolidays(state: string): Holiday[] {  
    //     const nationalHolidays = this.readHolidaysFromExcel('src/assets/holidays.xlsx', 'NACIONALES');
    //     const holidays = this.readHolidaysFromExcel('src/assets/holidays.xlsx', state);
    //     return [...nationalHolidays, ...holidays];
    // }

    // getHolidaysByState(country: string, stateCode: string, year: number): Observable<any> {  
    //   console.log(`${API_URL}?year=${year}&country=${country}&state=${stateCode}`);
    //     return this.http.get<any>(`${API_URL}?&year=${year}&country=${country}&state=${stateCode}`);
    // }
    /*getRegions(): Observable<any> {  
        return this.http.get<any>(`${API_REGIONS_URL}`);
    }*/
}
