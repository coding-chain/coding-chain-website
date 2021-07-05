import {Component, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip} from 'ng2-charts';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styles: []
})
export class HomeRootComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['csharp', 'java'];
  public pieChartData: ChartDataSets[] = [
    {data: [10, 10], backgroundColor: ['#ff7043', '#4dd0e1']},
  ];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {

  }

  ngOnInit(): void {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

}
