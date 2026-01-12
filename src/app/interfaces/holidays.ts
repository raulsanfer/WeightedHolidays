/*export interface Holiday {
  date: string
  start: string
  end: string
  name: string
  type: string
  rule: string
}*/
export interface RegionKV {
  key: string;
  value: string;
}
export interface HolidayWeight{
  day: Date;   // formato dd-mm
  weight: number;  // Valor del peso del festivo
}
export interface WeightColor{
  weight: number;  // Valor del peso del festivo
  color: string;   // Color asociado al peso
}
export interface Holiday {
    day: string;   // formato dd-mm
    name: string;  // Nombre del festivo
}

export interface CalendarMonthData {
  monthIndex: number;
  monthName: string;
  startPadding: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  month: number;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  weight?: number;
  disabled: boolean;
   selected: boolean;
}

export interface CalendarMonth {
  monthIndex: number;
  monthName: string;
  startPadding: number;
  days: CalendarDay[];
}
export const paletasColores: string[] = [
  'rgb(255, 179, 186)',
  'rgb(255, 223, 186)',
  'rgb(255, 255, 186)',
  'rgb(186, 255, 201)',
  'rgb(186, 225, 255)',
  'rgb(219, 219, 219)'
];

export const selectedColor = 'orange'; // Color para selección (Cornflower Blue)

export const regionsKV: {[key: string]: string} = {
  "AN": "Andalucía",
  "AR": "Aragón",
  "AS": "Asturias",
  "CA": "Cantabria",
  "CE": "Ciudad de Ceuta",
  "CL": "Castilla y León",
  "CM": "Castile-La Mancha",  
  "CN-HI": "Islas Canarias - El Hierro",
  "CN-FU": "Islas Canarias - Fuerteventura",
  "CN-GC": "Islas Canarias - Gran Canaria",
  "CN-LP": "Islas Canarias - La Palma",
  "CN-LN": "Islas Canarias - Lanzarote",
  "CN-TF": "Islas Canarias - Tenerife",  
  "CT": "Cataluña",
  "EX": "Extremadura",
  "GA": "Galicia",
  "IB": "Illes Balears",
  "MU": "Murcia Region",
  "MA": "Comunidad de Madrid",
  "ME": "Ciudad de Melilla",
  "NA": "Comunidad Foral de Navarra",
  "PV": "País Vasco",
  "RI": "La Rioja",
  "VA": "Comunitat Valenciana"  
};