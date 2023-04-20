namespace APP {

	import WUtil = WUX.WUtil;

	export class AppTableActions extends WUX.WComponent {
		left: WUX.WContainer;
		right: WUX.WContainer;
		noActions: boolean;
		
		constructor(id: string) {
			super(id, 'AppTableActions', null, 'table-actions-wrapper');
			this.left  = new WUX.WContainer(this.subId('l'), 'left-actions');
			this.right = new WUX.WContainer(this.subId('r'), 'right-actions');
		}
		
		componentDidMount(): void {
			let $i = $('<div class="table-actions clearfix"></div>');
			this.root.append($i);
			if(this.noActions) return;
			this.left.mount($i);
			this.right.mount($i);
		}
	}
	
	export class APPPeriodi extends WUX.WComponent<number, any[]> {
		protected fp: WUX.WFormPanel;

		constructor(id: string, rows: number) {
			super(id, 'APPPeriodi', rows);
		}

		clear(): this {
			this.setState(null);
			return this;
		}

		setDefaults(): this {
			this.fp.clear();
			this.fp.setValue('d0', WUtil.getCurrDate());
			this.fp.setValue('a0', WUtil.getCurrDate(0, 0, 1, false, true));
			return this;
		}

		protected render() {
			if(!this.props) this.props = 1;
			this.fp = new WUX.WFormPanel(this.subId('fp'));
			this.fp.nextOnEnter = true;
			for(let i = 0; i < this.props; i++) {
				this.fp.addRow();
				this.fp.addDateField('d' + i, 'Dal &nbsp;' + WUX.buildIcon(WUX.WIcon.TRASH, '', '', 0, 'active-cell'));
				this.fp.addDateField('a' + i, 'Al');
				this.fp.addDateField('e' + i, 'Escluso dal &nbsp;' + WUX.buildIcon(WUX.WIcon.TRASH, '', '', 0, 'active-cell'));
				this.fp.addDateField('f' + i, 'fino al');
				
				// Necessario per non riportare nel title l'icona
				this.fp.setTooltip('d' + i, 'Dalla data');
				this.fp.setTooltip('e' + i, 'Escluso dal');
			}
			return this.fp;
		}

		protected componentDidMount(): void {
			super.componentDidMount();
			if(!this.props) this.props = 1;
			for(let i = 0; i < this.props; i++) {
				this.createLinks(i);
			}
		}

		protected createLinks(i: number) {
			let fd = this.fp.getField('d' + i);
			if (fd) {
				let ld = $('label[for="' + fd.id + '"]');
				if(ld.length) {
					ld.css('cursor', 'pointer');
					ld.on('click', (e: JQueryEventObject) => {
						this.fp.setValue('d' + i, null);
						this.fp.setValue('a' + i, null);
					});
				}
			}
			let fe = this.fp.getField('e' + i);
			if (fe) {
				let le = $('label[for="' + fe.id + '"]');
				if(le.length) {
					le.css('cursor', 'pointer');
					le.on('click', (e: JQueryEventObject) => {
						this.fp.setValue('e' + i, null);
						this.fp.setValue('f' + i, null);
					});
				}
			}
		}

		getState(): any[] {
			this.state = [];
			if(!this.props) return this.state;
			let r = 0;
			let v = this.fp.getState();
			for(let i = 0; i < this.props; i++) {
				let di = WUtil.getDate(v, 'd' + i);
				let ai = WUtil.getDate(v, 'a' + i);
				let ei = WUtil.getDate(v, 'e' + i);
				let fi = WUtil.getDate(v, 'f' + i);
				if(di && ai) {
					r++;
					let p1 = {};
					p1["id"] = WUtil.toNumber(di) + '_' + WUtil.toNumber(ai);
					p1["data_inizio"] = di;
					p1["data_fine"] = ai;
					p1["esc_periodo"] = false;
					p1["riga"] = r;
					this.state.push(p1);
				}
				if(ei && fi) {
					r++;
					let p2 = {};
					p2["id"] = WUtil.toNumber(ei) + '_' + WUtil.toNumber(fi);
					p2["data_inizio"] = ei;
					p2["data_fine"] = fi;
					p2["esc_periodo"] = true;
					p2["riga"] = r;
					this.state.push(p2);
				}
			}
			return this.state;
		}

		updateState(nextState: any[]) {
			super.updateState(nextState);
			this.fp.clear();
			if(WUtil.isEmpty(this.state)) {
				return;
			}
			let v = {};
			let x = -1;
			// Si valorizzano prima gli intervalli inclusi
			for(let i = 0; i < this.state.length; i++) {
				let p = this.state[i];
				if(!p) continue;
				let di = WUtil.getDate(p, 'data_inizio');
				let df = WUtil.getDate(p, 'data_fine');
				let e  = WUtil.getBoolean(p, 'esc_periodo');
				if(!e) {
					if(di && df) {
						x++;
						v["d" + x] = di;
						v["a" + x] = df;
					}
				}
			}
			// Si valorizzano poi gli intervalli esclusi
			for(let i = 0; i < this.state.length; i++) {
				let p = this.state[i];
				if(!p) continue;
				let di = WUtil.getDate(p, 'data_inizio');
				let df = WUtil.getDate(p, 'data_fine');
				let e  = WUtil.getBoolean(p, 'esc_periodo');
				if(e) {
					if(di && df) {
						x = this.idxe(v, di);
						v["e" + x] = di;
						v["f" + x] = df;
					}
				}
			}
			this.fp.setState(v);
		}

		idxe(v: any, dr: Date): number {
			let d = WUtil.toNumber(dr);
			let x = -1;
			for(let i = 0; i < this.props; i++) {
				let d0 = WUtil.toNumber(v["e" + i]);
				let d1 = WUtil.toNumber(v["f" + i]);
				if(d >= d0 && d <= d1) {
					x = i;
					break;
				}
			}
			if(x < 0) x = 0;
			for(let i = x; i < this.props; i++) {
				if(!v["e" + i]) return i;
			}
			return 0;
		}
	}

	export class APPSelRuoloUte extends WUX.WSelect2 {
		constructor(id?: string, multiple?: boolean) {
			super(id, [], multiple);
			this.name = 'APPSelRuoloUte';
			this.options = [
				{ id: '',  text: '' },
				{ id: 'admin', text: 'Amministratore' },
				{ id: 'user',  text: 'Ruolo Base' }
			];
		}
	}
	
	export class APPSelComune extends WUX.WSelect2 {
		constructor(id?: string, multiple?: boolean) {
			super(id, [], multiple);
			this.name = 'APPSelComune';
		}

		componentDidMount(): void {
			let options: Select2Options = {
				ajax: {
					dataType: "json",
					delay: 400,
					processResults: function(result, params) {
						return {
							results: result
						};
					},
					transport: function(params: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null): JQueryXHR {
						jrpc.execute("COMUNI.lookup", [params.data], success);
						return undefined;
					}
				},
				placeholder: "",
				allowClear: true,
				minimumInputLength: 3
			};
			this.init(options);
		}
	}

	export class APPArticle extends WUX.WComponent<string, string[]> {
		addSignature: boolean;

		constructor(id?: string, title?: string, text?: string) {
			super(id ? id : '*', 'APPArticle', title, 'page type-page status-publish hentry');
			this.rootTag = 'article';
			if(text) {
				this.state = [];
				this.state.push(text);
			}
		}

		render() {
			let r = '<header class="header">';
			if(this.props) {
				r += '<h1 class="entry-title">' + this.props + '</h1>';
			}
			r += '<section class="entry-content"><div class="textwidget">';
			if(this.state) {
				for(let t of this.state) {
					if(!t) {
						r += '<p>&nbsp;</p>';
					}
					else {
						r += '<p>' + t + '</p>';
					}
				}
			}
			if(this.addSignature) {
				r += '<p>Have fun,</p>';
				r += '<p>&nbsp;</p>';
				r += '<p><em>Staff</em></p>';
			}
			r += '</div></section>';
			return this.buildRoot(this.rootTag, r);
		}
	}
	
	export class APPBtnAttach extends WUX.WComponent<string, string> {
		private _icon: string;
		private _$u: JQuery;
		readOnly: boolean;
		
		constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'APPBtnAttach', text, classStyle, style, attributes);
			this._icon = icon;
		}
		
		render() {
			let i = WUX.buildIcon(this._icon);
			if(i) i += ' ';
			if(!this._classStyle) {
				this._classStyle = "btn btn-primary dropdown-toggle";
			}
			else if(this._classStyle.indexOf('dropdown-toggle') < 0) {
				this._classStyle += ' dropdown-toggle';
			}
			
			let $r = $(WUX.build('div', '', this._style, this._attributes, this.id, 'btn-group'));
			$r.append(WUX.build('button', i + this.props + ' &nbsp;<i class="fa fa-caret-down"></i>', '', 'data-toggle="dropdown" aria-expanded="false"', '', this._classStyle));
			
			this._$u = $('<ul class="dropdown-menu"></ul>')
			$r.append(this._$u);
			
			if(!this.readOnly) {
				this.addItem('<i class="fa fa-upload"></i> &nbsp;Importa', 'i');
				this.addItem('<i class="fa fa-eraser"></i> &nbsp;Rimuovi', 'r');
			}
			this.addItem('<i class="fa fa-eye"></i> &nbsp;Vedi', 'v');
			
			return $r;
		}
		
		addItem(item: string, s: string) {
			if(!this._$u) return;
			let $li = $('<li></li>');
			this._$u.append($li);
			let $a = $('<a>' + item + '</a>');
			$li.append($a);
			$a.click(() => {
				this.setState(s);
			});
		}
		
		pop(): string {
			let r = this.state;
			// In questo modo quando si riclicca sulla
			// stessa voce viene generato l'evento statechange.
			this.state = null;
			return r;
		}
	}
}