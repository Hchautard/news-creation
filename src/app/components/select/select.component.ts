import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxPopupContainer,
} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed, input,
  viewChild,
  viewChildren,
  Output,
  EventEmitter
} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import News from "../../models/News";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SelectComponent {
  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);
  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);
  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);
  /** The string that is displayed in the combobox. */
  displayValue = computed(() => {
    const values = this.listbox()?.values() || [];
    return values.length ? values[0] : 'Sélectionner une news';
  });

  newsList = input<News[]>([]);
  @Output() newsSelected = new EventEmitter<News>();

  /** The labels that are available for selection. */
  labels = computed(() => this.newsList().map(news => ({ id: news.id, title: news.title })));

  constructor() {
    // Scrolls to the active item when the active option changes.
    // The slight delay here is to ensure animations are done before scrolling.
    afterRenderEffect(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({block: 'nearest'}), 50);
    });
    // Resets the listbox scroll position when the combobox is closed.
    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }

  onOptionSelected(id: number | undefined) {
    const selectedNews = this.newsList().find(news => news.id === id);
    if (selectedNews) {
      this.newsSelected.emit(selectedNews);
    }
  }
}
