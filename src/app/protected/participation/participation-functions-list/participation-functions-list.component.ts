import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ArrayUtils} from '../../../shared/utils/array.utils';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {
  IParticipationEditFunctionData,
  ParticipationEditFunctionDialogComponent
} from '../participation-edit-function-dialog/participation-edit-function-dialog.component';
import {Theme} from '../../../core/services/states/theme.service';
import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';

@Component({
  selector: 'app-participation-functions-list',
  templateUrl: './participation-functions-list.component.html',
  styles: []
})
export class ParticipationFunctionsListComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel: NgbCarousel;
  @ViewChildren('cdkDropList') dropLists: QueryList<CdkDropList>;
  @Input() header: string;
  @Input() language: IProgrammingLanguage;
  @Input() functionCreatorId: string;
  @Input() functionsCountBySlide = 6;
  @Output() addFunction = new EventEmitter<AppFunction>();
  @Output() removeFunction = new EventEmitter<AppFunction>();
  @Output() updateFunction = new EventEmitter<AppFunction>();
  @Input() theme: Theme;
  @Input() canDragOrDrop = false;

  slides: number[];
  functionsMatrix: AppFunction[][] = [];

  constructor(private dialog: MatDialog, private readonly _changeDetector: ChangeDetectorRef) {
  }

  private _functions: AppFunction[] = [];

  @Input() set functions(functions: AppFunction[]) {
    this._functions = functions.map(f => FunctionFactory.new(f).parse());
    this.setMatrix();
  }

  ngOnInit(): void {
  }

  onAddedFunction(func: AppFunction): void {
    this.addFunction.emit(func);
  }


  getFunctionIdx(rowIdx: number, colIdx: number): number {
    return rowIdx * this.functionsCountBySlide + colIdx;
  }

  openFunctionForm(func?: AppFunction): void {
    const dialogRef = this.dialog.open(ParticipationEditFunctionDialogComponent, {
      width: dialogWidth('xl'),
      height: dialogHeight('l'),
      data: {
        function: func ?? FunctionFactory.new({language: this.language.name, type: 'pipeline', header: this.header}),
        theme: this.theme,
        isReadonly: false
      } as IParticipationEditFunctionData
    });
    dialogRef.afterClosed().subscribe((result: (AppFunction | undefined)) => {
      if (result) {
        if (func) {
          func.copy(result);
          this.updateFunction.emit(func);
        } else {
          this.onAddedFunction(result);
        }
      }
    });
  }


  onFunctionDeleted(functionItem: AppFunction): void {
    this.removeFunction.emit(functionItem);
  }

  onFunctionEdit(functionItem: AppFunction): void {
    this.openFunctionForm(functionItem);
  }


  drop(event: CdkDragDrop<AppFunction[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const func = event.previousContainer.data[event.previousIndex];
      func.order = null;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.onAddedFunction(func);
    }
  }

  ngAfterViewInit(): void {
    this.dropLists.changes.subscribe(res => {
      if (this.carousel) {
        const idx = this.dropLists.length - 1;
        this.carousel.select(`slide-${idx >= 0 ? idx : 0}`);
        this._changeDetector.detectChanges();
      }
    });
  }

  private setMatrix(): void {
    this.functionsMatrix = ArrayUtils.toMatrix(this._functions, this.functionsCountBySlide);
    this.functionsMatrix = !this.functionsMatrix.length ? [[]] : this.functionsMatrix;
  }
}
