import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {geCtrlValidator, gtCtrlValidator, ltCtrlValidator} from '../../../shared/validators/number.validators';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';

@Component({
  selector: 'app-steps-edit-item',
  templateUrl: './steps-edit-item.component.html',
  styles: []
})
export class StepsEditItemComponent implements OnInit {
  _step: ITournamentEditionStep;
  @Input() maxNameLength = 50;
  @Input() minNameLength = 5;
  @Input() maxDescriptionLength = 500;
  @Input() languages: IProgrammingLanguageNavigation[] = [];

  @Input() set step(step: ITournamentEditionStep){
    this._step = step;
    this.nameCtrl.setValue(step.name);
    this.descriptionCtrl.setValue(step.description);
    this.isOptionalCtrl.setValue(step.isOptional);
    this.minFunctionsCntCtrl.setValue(step.minFunctionsCount);
    this.maxFunctionsCntCtrl.setValue(step.maxFunctionsCount);
    this.languagesCtrl.setValue(step.language.id);
  }
  private stepGrp: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.descriptionCtrl = this._fb.control('', [Validators.maxLength(this.maxDescriptionLength)]);
    this.nameCtrl = this._fb.control('', [Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);
    this.isOptionalCtrl = this._fb.control(true);
    this.maxFunctionsCntCtrl = this._fb.control(true);
    this.minFunctionsCntCtrl = this._fb.control(true);
    this.minFunctionsCntCtrl.setValidators([gtCtrlValidator(this.maxFunctionsCntCtrl), Validators.min(0)]);
    this.maxFunctionsCntCtrl.setValidators([ltCtrlValidator(this.minFunctionsCntCtrl), Validators.min(0)]);
    this.languagesCtrl = this._fb.control([]);

    this.stepGrp = this._fb.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      isOptional: this.isOptionalCtrl,
      language: this.languagesCtrl,
      minFunctionsCount: this.minFunctionsCntCtrl,
      maxFunctionsCount: this.maxFunctionsCntCtrl
    });
  }

  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  isOptionalCtrl: FormControl;
  maxFunctionsCntCtrl: FormControl;
  minFunctionsCntCtrl: FormControl;
  languagesCtrl: FormControl;


  ngOnInit(): void {
    console.log(this.step);
  }

}
