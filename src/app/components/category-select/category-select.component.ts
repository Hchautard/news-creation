import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySelectComponent implements OnChanges {
  /** Liste des catégories disponibles (extraites des news existantes) */
  @Input() categories: string[] = [];

  /** Valeur actuelle de la catégorie */
  @Input() value: string = '';

  /** Événement émis quand la catégorie change */
  @Output() valueChange = new EventEmitter<string>();

  /** Texte saisi dans le champ */
  inputValue: string = '';

  /** Indique si le dropdown est ouvert */
  isOpen: boolean = false;

  /** Indique si l'utilisateur est en mode "nouvelle catégorie" */
  isCreatingNew: boolean = false;

  /** Catégories filtrées selon la saisie */
  filteredCategories: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.inputValue = this.value;
    }
    if (changes['categories']) {
      this.filteredCategories = [...this.categories];
    }
  }

  onFocus() {
    this.isOpen = true;
    this.filteredCategories = this.getFiltered();
  }

  onBlur() {
    setTimeout(() => {
      this.isOpen = false;
    }, 200);
  }

  onInputChange() {
    this.isOpen = true;
    this.isCreatingNew = false;
    this.filteredCategories = this.getFiltered();
    this.valueChange.emit(this.inputValue);
  }

  selectCategory(category: string) {
    this.inputValue = category;
    this.isOpen = false;
    this.isCreatingNew = false;
    this.valueChange.emit(this.inputValue);
  }

  startCreatingNew() {
    this.isCreatingNew = true;
    this.inputValue = '';
    this.isOpen = false;
    this.valueChange.emit(this.inputValue);
  }

  private getFiltered(): string[] {
    if (!this.inputValue || this.inputValue.trim() === '') {
      return [...this.categories];
    }
    const search = this.inputValue.toLowerCase().trim();
    return this.categories.filter(cat => cat.toLowerCase().includes(search));
  }

  get isExactMatch(): boolean {
    return this.categories.some(cat => cat.toLowerCase() === this.inputValue?.toLowerCase()?.trim());
  }
}
