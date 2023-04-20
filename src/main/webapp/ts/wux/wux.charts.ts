namespace WUX {

	export interface WChartData {
		labels?: string[];
		titles?: string[];
		series?: number[][];
	}

	export class WChartJS extends WComponent<'line' | 'bar' | 'pie' | 'doughnut' | 'polarArea', WChartData> {
		chart: Chart;

		protected _opset: boolean;
		protected _options: Chart.ChartOptions;

		title: string;
		legend: boolean;
		colors: string[];
		bg0: string;
		bg1: string;
		bg2: string;
		bc0: string;
		bc1: string;
		bc2: string;
		p0: string;
		p1: string;
		p2: string;
		pbc: string;

		constructor(id: string, type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'polarArea', classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id, 'WChartJS', type, classStyle, style, attributes);
			this.rootTag = 'canvas';

			this.title = '';
			this._opset = false;

			this.legend = type == 'pie' || type == 'doughnut' || type == 'polarArea' ? true : false;
			this.colors = [];

			this.bg0 = WUX.global.chart_bg0;
			this.bg1 = WUX.global.chart_bg1;
			this.bg2 = WUX.global.chart_bg2;

			this.bc0 = WUX.global.chart_bc0;
			this.bc1 = WUX.global.chart_bc1;
			this.bc2 = WUX.global.chart_bc2;

			this.p0 = WUX.global.chart_p0;
			this.p1 = WUX.global.chart_p1;
			this.p2 = WUX.global.chart_p2;

			this.pbc = '#fff';

			this.forceOnChange = true;
		}

		get options(): Chart.ChartOptions {
			return this._options;
		}
		set options(o: Chart.ChartOptions) {
			this._options = o;
			if (o) {
				this._opset = true;
			}
			else {
				this._opset = false;
			}
		}

		onClickChart(h: (e: WEvent) => any): void {
			if (!h) return;
			if (!this.handlers['_click']) this.handlers['_click'] = [];
			this.handlers['_click'].push(h);
		}

		getLabel(e: WUX.WEvent): string {
			if (!this.state) return '';
			if (!e || !e.data) return '';
			let di = e.data.split('_');
			let i = WUtil.toNumber(di[di.length - 1]);
			return WUtil.toString(this.state.labels[i]);
		}

		getValue(e: WUX.WEvent): number {
			if (!this.state) return 0;
			if (!e || !e.data) return 0;
			let di = e.data.split('_');
			let d = di.length > 1 ? WUtil.toNumber(di[0]) : 0;
			let i = WUtil.toNumber(di[di.length - 1]);
			return this.state.series[d][i];
		}

		protected componentDidMount(): void {
			if (this._tooltip) {
				this.root.attr('title', this._tooltip);
			}
			if (this.state) {
				this.buildChart();
			}
		}

		protected buildChart() {
			if (!this.state || !this.root) return;

			// Check and normalize data
			if (!this.state.labels) this.state.labels = [];
			if (!this.state.titles) this.state.titles = [];
			if (!this.state.series) this.state.series = [[]];

			// Check and normalize parameters
			if (!this.props) this.props = 'line';

			// Configure chart
			if (!this._opset || !this._options) {
				if (this.props == 'pie' || this.props == 'doughnut' || this.props == 'polarArea') {
					this.legend = true;
				}
				else {
					if (!this.state.titles || !this.state.titles.length) {
						if (!this.title) this.legend = false;
					}
				}
				this._options = {
					responsive: true,
					maintainAspectRatio: false,
					onClick: (e: MouseEvent, a: any) => {
						let p = this.chart.getElementAtEvent(e) as any[];
						if (!p || !p.length) return;
						let d = WUtil.getString(p[0], '_datasetIndex', '');
						let i = WUtil.getString(p[0], '_index', '');
						this.trigger('_click', d + '_' + i);
					},
					legend: {
						display: this.legend
					}
				};
			}
			// Prepare ChartData
			let cd: Chart.ChartData;
			if (this.props == 'pie' || this.props == 'doughnut' || this.props == 'polarArea') {
				if (!this.colors || !this.colors.length) {
					this.colors = ["#dfefdf", "#e4f4ff", "#ffffcc", "#ffddaa", "#ffccff", "#e6ccff", "#f1e7cb", "#eeeeee", "#d9f2e6", "#d9e6f2"];
				}
				cd = {
					labels: this.state.labels,
					datasets: [{
						backgroundColor: this.colors,
						data: this.state.series[0]
					}]
				};
			}
			else {
				let ds: Chart.ChartDataSets[] = [];
				for (let i = 0; i < this.state.series.length; i++) {
					let lbl = this.state.titles[i];
					if (!lbl) lbl = '';
					ds.push({
						label: lbl,
						backgroundColor: i == 0 ? this.bg0 : i == 1 ? this.bg1 : this.bg2,
						borderColor: i == 0 ? this.bc0 : i == 1 ? this.bc1 : this.bc2,
						pointBackgroundColor: i == 0 ? this.p0 : i == 1 ? this.p1 : this.p2,
						pointBorderColor: this.pbc,
						data: this.state.series[i]
					});
				}
				cd = {
					labels: this.state.labels,
					datasets: ds
				};
			}
			// Build chart
			this.chart = new Chart(
				((this.root[0] as any).getContext('2d')), {
					type: this.props,
					data: cd,
					options: this._options
				}
			);
		}
	}

}