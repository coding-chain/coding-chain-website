import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {gtCtrlValidator, ltCtrlValidator} from '../../../shared/validators/number.validators';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {getDefaultMonacoEditorConfig} from '../../../shared/utils/monaco.utils';
import {Theme} from '../../../core/services/theme.service';

@Component({
  selector: 'app-steps-edit-detail',
  templateUrl: './steps-edit-detail.component.html',
  styles: []
})
export class StepsEditDetailComponent implements OnInit {

  @Input() stepGrp: FormGroup;
  @Input() step: ITournamentEditionStep;
  @Input() maxDescriptionLength = 500;
  @Input() theme: Theme;
  descriptionCtrl: FormControl;
  maxFunctionsCntCtrl: FormControl;
  minFunctionsCntCtrl: FormControl;
  editorOptions: MonacoEditorConstructionOptions;

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.editorOptions = getDefaultMonacoEditorConfig(this.step.language.name, this.theme);
    this.editorOptions.readOnly = this.step.isPublished;
    this.maxFunctionsCntCtrl = this._fb.control(this.step.maxFunctionsCount);
    this.minFunctionsCntCtrl = this._fb.control(this.step.minFunctionsCount);
    this.minFunctionsCntCtrl.setValidators([gtCtrlValidator(this.maxFunctionsCntCtrl), Validators.min(0)]);
    this.maxFunctionsCntCtrl.setValidators([ltCtrlValidator(this.minFunctionsCntCtrl), Validators.min(0)]);
    this.descriptionCtrl = this._fb.control(this.step.description, [Validators.maxLength(this.maxDescriptionLength)]);

    this.stepGrp.setControl('maxFunctions', this.maxFunctionsCntCtrl);
    this.stepGrp.setControl('minFunctions', this.minFunctionsCntCtrl);
    this.stepGrp.setControl('description', this.descriptionCtrl);


    if (this.step.isPublished) {
      this.stepGrp.disable();
    }
  }

}
