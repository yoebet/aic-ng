import {EChartsOption} from 'echarts';

export abstract class ChartConfig {

  readonly chartColorsOri = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
    '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
  chartColors = [...this.chartColorsOri];
  startColorIndex = 0;
  chartType = 'bar';
  chartStack = false;
  chartWidth = 800;
  chartHeight = 400;
  chartTranspose = false;
  chartDarkTheme = false;
  transparentBackground = true;
  lightBackgroundColor = '#FAFAFA'; // #FAFAFA, white
  darkBackgroundColor = '#333'; // #404040, #333, black

  chartTitle: string = null;
  chartSubTitle: string = null;
  chartLegend: any = {
    show: false,
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 40,
    bottom: 20
  };
  showChartToolbox = true;

  get chartToolbox(): object {
    if (!this.showChartToolbox) {
      return null;
    }
    return {
      show: true,
      feature: {
        // dataView: {show: true, readOnly: false},
        // magicType: {show: true, type: ['line', 'bar']},
        // restore: {show: true},
        saveAsImage: {
          show: true,
          title: '图片',
          pixelRatio: 2,
          backgroundColor: this.chartDarkTheme ? this.darkBackgroundColor : this.lightBackgroundColor
        }
      }
    };
  }

  colorRollForward(): void {
    const colors = this.chartColors;
    const c = colors.shift();
    colors.push(c);
    this.startColorIndex++;
    if (this.startColorIndex >= colors.length) {
      this.startColorIndex = 0;
    }
    this.refreshChart(true);
  }

  colorRollBackward(): void {
    const colors = this.chartColors;
    const c = colors.pop();
    colors.unshift(c);
    this.startColorIndex--;
    if (this.startColorIndex < 0) {
      this.startColorIndex = colors.length - 1;
    }
    this.refreshChart(true);
  }

  startColorChanged(): void {
    const sci = this.startColorIndex;
    let chartColors = this.chartColorsOri.slice(sci);
    const heads = this.chartColorsOri.slice(0, sci);
    chartColors = chartColors.concat(heads);
    this.chartColors = chartColors;
    this.refreshChart(true);
  }

  redrawChart(): void {
    this.refreshChart(true);
  }

  abstract refreshChart(keepData): void;

  buildOption(): EChartsOption {
    const option: EChartsOption = {
      color: this.chartColors,
      title: this.chartTitle ?
        {
          text: this.chartTitle,
          subtext: this.chartSubTitle
        } : null,
      legend: this.chartLegend,
      tooltip: {
        trigger: this.chartType === 'pie' ? 'item' : 'axis'
      },
      toolbox: this.chartToolbox
    };
    if (this.transparentBackground) {
      option.backgroundColor = 'transparent';
    } else {
      option.backgroundColor = this.chartDarkTheme ? this.darkBackgroundColor : this.lightBackgroundColor;
    }
    return option;
  }

}
