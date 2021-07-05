import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip} from 'ng2-charts';
import {IProgrammingLanguage} from '../../models/programming-languages/responses';
import {ObjectUtils} from '../../utils/object.utils';
import {Theme} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-languages-stats',
  templateUrl: './languages-stats.component.html',
  styles: []
})
export class LanguagesStatsComponent implements OnInit, OnChanges {

  @Input() languages: IProgrammingLanguage[];
  @Input() height = '50px';
  @Input() width = '100px';
  @Input() theme: Theme = 'light';

  public pieChartOptions: ChartOptions = {
    legend: {display: false}
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: ChartDataSets[] = [];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
  }

  ngOnInit(): void {
    this.initChartOptions();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChartOptions();
  }

  private initChartOptions(): void {
    const groupedLanguages = ObjectUtils.groupBy(this.languages, l => l.id);
    const data = [];
    const backgroundColor: string[] = [];
    groupedLanguages.forEach((value, key) => {
      data.push(value.length);
      this.pieChartLabels.push(value[0].label);
      backgroundColor.push(this.theme === 'dark' ? value[0].color.dark : value[0].color.light);
    });
    this.pieChartData = [
      {data, backgroundColor},
    ];
  }
}
