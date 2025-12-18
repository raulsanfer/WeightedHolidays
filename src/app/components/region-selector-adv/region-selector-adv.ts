import { AfterViewInit, ChangeDetectionStrategy, Component, effect, output, signal, WritableSignal } from '@angular/core';
import { RegionKV, regionsKV } from '../../interfaces/holidays';

@Component({
  selector: 'region-selector-adv',
  imports: [],
  templateUrl: './region-selector-adv.html'
})

export class RegionSelectorAdv implements AfterViewInit {
  $selectChanged: WritableSignal<string | null> = signal(null);
  placeholder = '— Selecciona una región —';
  selected : string = 'MA';
  displayed: RegionKV[] = Object.entries(regionsKV).map(([key, value]) => ({ key, value }));
  value = output<string>();
  /**
   *
   */
  constructor() {

    effect(() => {
      //console.log('Region selected:', this.$selectChanged());
    });

  }

  emitirValor(e: Event): void {
    const selectElement = e.target as HTMLSelectElement;
    this.$selectChanged.set(selectElement.value || null);
    const emittedValue = selectElement.value ? selectElement.value : this.selected;
    this.value.emit(emittedValue);
    //console.log('Valor seleccionado:', this.$selectChanged());
  }
  ngAfterViewInit(): void {

    this.value.emit(this.selected);
  }
 }
