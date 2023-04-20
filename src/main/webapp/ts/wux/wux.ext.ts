namespace WUX {

	/**
	 * Wrapper Select2. Required JQuery plugin Select2 4.0.0 (https://select2.org/)
	 */
	export class WSelect2 extends WUX.WComponent implements WISelectable {
		options: Array<string | WEntity>;
		multiple: boolean;
		openOnFocus: boolean;
		prefix: string;
		suffix: string;
		lastChange: number;
		count: number;
		_init: boolean;

		protected dontOpen: boolean;
		protected $cb: JQuery;

		constructor(id: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WSelect2', props, classStyle, style, attributes);
			this.rootTag = 'select';
			// WSelect init
			this.options = options;
			this.multiple = multiple;
			this.openOnFocus = true;
			this.dontOpen = false;
			this.lastChange = 0;
			this.count = options ? options.length : 0;
			this._init = false;
		}

		set visible(b: boolean) {
			this._visible = b;
			if (this.internal) this.internal.visible = b;
			if (this.root && this.root.length) {
				if (!this.$cb) this.$cb = this.root.parent().find('span[role="combobox"]').first();
				if (this._visible) {
					if (this.$cb && this.$cb.length) {
						this.$cb.show();
					}
					else {
						this.root.show();
					}
				}
				else {
					if (this.$cb && this.$cb.length) {
						this.$cb.hide();
					}
					else {
						this.root.hide();
					}
				}
			}
		}

		focus(): this {
			if (!this.mounted) return this;
			if (!this._enabled) return this;
			this.root.focus();
			if (!this.$cb) this.$cb = this.root.parent().find('span[role="combobox"]').first();
			if (this.$cb && this.$cb.length) this.$cb.focus();
			return this;
		}

		getProps(): any {
			if (!this.root) return this.props;
			this.props = [];
			this.root.find('option:selected').each((i: any, e: Element) => {
				let t = $(e).text();
				if (this.prefix) t = this.prefix + ' ' + t;
				if (this.suffix) t = t + ' ' + this.suffix;
				this.props.push(t);
			});
			return this.props;
		}

		getState(): any {
			if (!this.root) return this.state;
			return this.state = this.root.val();
		}

		getValue(): WEntity {
			let id = this.getState();
			if (id == null) return null;
			let text = WUtil.toString(this.getProps());
			if (!text) text = '' + id;
			return { id: id, text: text };
		}

		select(i: number): this {
			if (!this.root) return this;
			let val = this.root.find('option:eq(' + i + ')').val();
			if (val == null) return this;
			this.root.select2('val', val);
			return this;
		}

		selectVal(av: any[], ad?: any[], r?: boolean): this {
			if (!av || !av.length) {
				this.root.val([]).trigger('change');
				return;
			}
			if (r) {
				this.root.empty();
				for (let i = 0; i < av.length; i++) {
					let d = ad ? ad[i] : '' + av[i];
					this.root.append('<option value="' + av[i] + '">' + d + '</option>');
				}
			}
			this.root.select2('val', av);
		}

		setOptions(items: Array<string | WEntity>): this {
			this.options = items;
			if (!this.root) return this;
			this.root.empty();
			let data = [];
			if (this.options) {
				for (let opt of this.options) {
					if (typeof opt == 'string') {
						data.push({id: opt, text: opt});
					}
					else {
						data.push(opt);
					}
				}
			}
			let options: Select2Options = { data: data, placeholder: "", allowClear: true };
			this.init(options);
			return this;
		}

		reload(clear?: boolean): this {
			if (clear) this.setState(null);
			if (!this.mounted) return this;
			this.root.empty();
			this.componentDidMount();
			return this;
		}

		protected render() {
			if (this.multiple) return this.buildRoot(this.rootTag, '', 'multiple="multiple"', 'form-control');
			return this.buildRoot(this.rootTag, '', '', 'form-control');
		}

		protected updateState(nextState: any): void {
			super.updateState(nextState);
			if (!this.root) return;
			if (Array.isArray(this.state) && this.state.length > 1) {
				this.root.append('<option value="' + this.state[0] + '">' + this.state[this.state.length - 1] + '</option>');
				this.root.val(this.state[0]).trigger('change');
			}
			else if (this.state) {
				if (typeof this.state == 'object') {
					let text = this.state.text ? this.state.text : this.state.name;
					if(text == null) text = this.state.id;
					this.root.append('<option value="' + this.state.id + '">' + WUtil.toText(text) + '</option>');
					this.root.val(this.state.id).trigger('change');
				}
				else {
					this.root.val(this.state).trigger('change');
				}
			}
			else {
				this.root.val([]).trigger('change');
			}
			this.dontTrigger = true;
			this.lastChange = new Date().getTime();
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.attr('title', this._tooltip);
			if (this.options) {
				for (let opt of this.options) {
					if (typeof opt == 'string') {
						this.root.append('<option>' + WUtil.toText(opt) + '</option>');
					}
					else {
						this.root.append('<option value="' + opt.id + '">' + WUtil.toText(opt.text) + '</option>');
					}
				}
			}
			let options: Select2Options = { placeholder: "", allowClear: true };
			this.init(options);
		}

		protected init(options: Select2Options) {
			if (this._init) {
				// Fix reset options 
				this.root.empty();
				this.root.next('span.select2').remove();
			}

			this.root.select2(options);
			this.updateState(this.state);

			if (options) {
				if (options.data) {
					this.count = WUtil.size(options.data);
				}
			}
			else {
				this.count = 0;
			}

			// Se si ripete init non si registrano ulteriori eventi
			if (this._init) return;

			this.$cb = this.root.parent().find('span[role="combobox"]').first();
			if (this.$cb.length) {
				this.$cb.on('focus', (e: JQueryEventObject) => {
					if (e.relatedTarget == null) return;
					if (this.dontOpen) {
						this.dontOpen = false;
						return;
					}
					if (this.openOnFocus) setTimeout(() => {
						if (this.multiple) {
							if (this.$cb && this.$cb.length) {
								let $sf = this.$cb.find('input.select2-search__field').first();
								if ($sf && $sf.length && !$sf.is(':focus')) $sf.focus();
							}
						}
						else {
							let d = new Date().getTime() - this.lastChange;
							if (d > 900) this.root.select2('open');
							this.dontOpen = true;
						}
					}, 50);
				});
			}
			else {
				this.root.on('focus', (e: JQueryEventObject) => {
					if (this.dontOpen) {
						this.dontOpen = false;
						return;
					}
					if (this.openOnFocus) setTimeout(() => {
						let d = new Date().getTime() - this.lastChange;
						if (d > 900) this.root.select2('open');
						this.dontOpen = true;
					}, 50);
				});
			}

			if (this.multiple) {
				this.root.on('select2:select', (e: JQueryEventObject) => {
					this.lastChange = new Date().getTime();
					this.trigger('statechange');
				});
				this.root.on('select2:unselect', (e: JQueryEventObject) => {
					setTimeout(() => {
						this.lastChange = new Date().getTime();
						this.trigger('statechange');
					}, 0);
				});
			}
			else {
				this.root.on('change', (e: JQueryEventObject) => {
					this.lastChange = new Date().getTime();
					this.trigger('statechange');
				});
			}
			this._init = true;
		}

		transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean {
			if (dest instanceof WSelect2) {
				dest.setState(this.getValue(), force, callback);
				return true;
			}
			return super.transferTo(dest, force, callback);
		}
	}

	export class WTags extends WComponent<WComponent, any> {
		hideZeroValues: boolean;

		constructor(id: string, comp?: WComponent, classStyle?: string, style?: string | WStyle, attributes?: string | object, type?: string) {
			// WComponent init
			super(id, 'WTags', comp, classStyle, style, attributes);
			if (!this._classStyle) this._classStyle = 'label-default';
			this.hideZeroValues = false;
		}

		protected updateState(nextState: any) {
			super.updateState(nextState);
			this.buildView();
		}

		protected componentDidMount(): void {
			this.buildView();
		}

		protected buildView(): void {
			if (!this.root) return;
			this.root.html('');
			if (!this.state) return;
			if (typeof this.state != 'object') {
				this.state = WUtil.toArray(this.state);
			}
			for (let k in this.state) {
				let v = this.state[k];
				let t = WUX.format(v);
				if (!t) continue;
				if (this.hideZeroValues && (t == '0' || t == 'null')) continue;
				if (t.length > 100) t = t.substring(0, 97) + '...';
				if (typeof this.state[k] == 'boolean') {
					if (this.props instanceof WUX.WFormPanel) {
						let f = this.props.getField(k);
						if (f && f.label) {
							t = f.label + '=' + t;
						}
					}
				}
				this.root.append('<span class="label ' + this._classStyle + '">' + t + '</span>');
			}
		}
	}

	export class WLinkOptions extends WComponent implements WISelectable {
		options: Array<string | WEntity>;

		constructor(id: string, options: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WLinkOptions', props, classStyle, style, attributes);
			this.rootTag = 'span';
			this._style = WUX.css(style, this._baseStyle = 'display:inline-block;');
			// WLinks init
			this.options = options;
		}

		set tooltip(s: string) {
			this._tooltip = s;
			if (this.internal) this.internal.tooltip = s;
			if (!this.options || !this.options.length) return;
			for (let i = 0; i < this.options.length; i++) {
				let $item = $('#' + this.id + '-' + i);
				if (!$item.length) continue;
				if (this._tooltip) $item.attr('title', this._tooltip);
			}
		}

		select(i: number): this {
			return this;
		}

		protected componentDidMount(): void {
			if (!this.options || !this.options.length) return;
			let r = '';
			for (let i = 0; i < this.options.length; i++) {
				let opt = this.options[i];
				if (typeof opt == "string") {
					r += ' <a id="' + this.id + '-' + i + '"> ' + opt + ' </a>';
				}
				else {
					r += ' <a id="' + this.id + '-' + i + '"> ' + opt.text + ' </a>';
				}
				if (i < this.options.length - 1) r += ' | ';
			}
			this.root.html(r);
			for (let i = 0; i < this.options.length; i++) {
				let $item = $('#' + this.id + '-' + i);
				if (!$item.length) continue;
				if (this._tooltip) $item.attr('title', this._tooltip);
				let opt = this.options[i];
				$item.click(() => {
					this.setState(opt);
				});
			}
		}
	}

	export class WButtonSelect extends WComponent<string, string> {
		options: Array<string | WEntity>;
		btnClass: string;

		constructor(id: string, text?: string, options?: Array<string | WEntity>, classStyle: string = 'btn-group', style?: string | WStyle, attributes?: string | object) {
			// WComponent init
			super(id, 'WButtonDropDown', null, classStyle, style, attributes);
			this.updateState(text);
			this.options = options;
		}

		protected componentDidMount(): void {
			if (this._tooltip) this.root.attr('title', this._tooltip);

			if (!this.btnClass) this.btnClass = 'btn btn-gray';
			let btn = WUX.build('button', this.state + ' <span class="caret"></span>', this.btnClass + ' dropdown-toggle', 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"');
			this.root.append(btn);
			let $opt = $('<ul class="dropdown-menu"></ul>');
			this.root.append($opt);
			if (this.options) {
				for (let o of this.options) {
					let ot = typeof o == 'string' ? o : o.text;
					let oi = typeof o == 'string' ? o : o.id;
					let $li = $('<li></li>');
					$opt.append($li);
					let $a = $('<a href="#" data-id="' + oi + '">' + ot + '</a>');
					$li.append($a);
					$a.on('click', (e: JQueryEventObject) => {
						let id = $(e.currentTarget).attr('data-id');
						this.trigger('propschange', WUtil.toString(id));
					});
				}
			}
		}

		protected componentWillUpdate(nextProps: any, nextState: any): void {
			if (!nextState) nextState = '';
			this.root.children('button:first').html(nextState + ' <span class="caret"></span>');
		}
	}

	export interface WGridElement {
		width: number;
		height: number;
		classStyle: string;
		style: string | WStyle;
		ylayout?: boolean;
		components?: Array<WElement>;
		css(s: string | WStyle): this;
		removeClass(className: string): this;
	}

	export class WGridCol implements WGridElement {
		grid: WGrid;
		row: WGridRow;
		index: number;
		width: number;
		height: number;
		classStyle: string;
		style: string | WStyle;
		components: Array<WElement>;
		ylayout: boolean;
		titles: string[];

		constructor(grid: WGrid, row: WGridRow, index: number, width?: number, height?: number, classStyle?: string, style?: string | WStyle, ...components: (WElement)[]) {
			this.grid = grid;
			this.row = row;
			this.index = index;
			this.width = width ? width : 0;
			this.height = height ? height : 0;
			this.classStyle = classStyle;
			this.style = style;
			this.titles = [];
			this.components = components ? components : [];
			for (let component of components) {
				if (component instanceof WComponent && !component.parent) component.parent = this.grid;
			}
		}

		css(s: string | WStyle): this {
			if (!s) return this;
			if (typeof s == 'string') {
				if (s.indexOf(':') > 0) {
					this.style = WUX.style(s);
				}
				else {
					this.classStyle = s;
				}
			}
			else {
				if (s.n) this.classStyle = s.n;
				this.style = s;
			}
			if (this.grid.mounted) WUX.setCss($('#' + this.grid.id + '-' + this.row.index + '-' + this.index), s);
			return this;
		}

		removeClass(className: string): this {
			if (!className) return this;
			if (this.classStyle) this.classStyle = WUX.removeClass(this.classStyle, className);
			if (this.grid.mounted) $('#' + this.grid.id + '-' + this.row.index + '-' + this.index).removeClass(className);
			return this;
		}

		addCol(width?: number, height?: number, ...components: (WElement)[]): WGridCol {
			return this.row.addCol(width, height, ...components);
		}

		addRow(width?: number, height?: number, classStyle?: string, style?: string): WGridRow {
			return this.grid.addRow(width, height, classStyle, style);
		}

		add(component?: WElement): this {
			if (component) this.components.push(component);
			if (component instanceof WComponent && !component.parent) component.parent = this.grid;
			return this;
		}

		cell(...components: (WElement)[]): this {
			this.components = components ? components : [];
			for (let component of components) {
				if (component instanceof WComponent && !component.parent) component.parent = this.grid;
			}
			return this;
		}

		y(): this {
			this.ylayout = true;
			return this;
		}

		tip(...titles: string[]): this {
			this.titles = titles ? titles : [];
			return this;
		}

		title(k?: number): string {
			if (!this.titles || !this.titles.length) return '';
			if (!k) return this.titles[0];
			if (this.titles.length > k) return this.titles[k];
			return '';
		}
	}

	export class WGridRow implements WGridElement {
		grid: WGrid;
		index: number;
		width: number;
		height: number;
		classStyle: string;
		style: string | WStyle;
		cols: WGridCol[];
		ref: string;
		attributes: string;

		constructor(grid: WGrid, index: number, width?: number, height?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			this.grid = grid;
			this.index = index;
			this.width = width ? width : 0;
			this.height = height ? height : 0;
			this.classStyle = classStyle;
			this.style = style;
			this.cols = [];
			this.attributes = WUX.attributes(attributes);
		}

		css(s: string | WStyle): this {
			if (!s) return this;
			if (typeof s == 'string') {
				if (s.indexOf(':') > 0) {
					this.style = WUX.style(s);
				}
				else {
					this.classStyle = s;
				}
			}
			else {
				if (s.n) this.classStyle = s.n;
				this.style = s;
			}
			if (this.grid.mounted) WUX.setCss($('#' + this.grid.id + '-' + this.index), s);
			return this;
		}

		removeClass(className: string): this {
			if (!className) return this;
			if (this.classStyle) this.classStyle = WUX.removeClass(this.classStyle, className);
			if (this.grid.mounted) $('#' + this.grid.id + '-' + this.index).removeClass(className);
			return this;
		}

		addCol(width?: number, height?: number, ...components: (WElement)[]): WGridCol {
			if (!width && this.grid.rows.length > 1) {
				if (this.grid.rows[0].cols.length > this.cols.length) {
					width = this.grid.rows[0].cols[this.cols.length].width;
				}
			}
			let col = new WGridCol(this.grid, this, this.cols.length, width, height, '', '', ...components);
			this.cols.push(col);
			return col;
		}

		addRow(width?: number, height?: number, classStyle?: string, style?: string | WStyle): WGridRow {
			return this.grid.addRow(width, height, classStyle, style);
		}
	}

	export class WGrid extends WComponent<any, any> {
		rows: WGridRow[];
		rowsStyle: string | WStyle;
		colsStyle: string | WStyle;
		headStyle: string | WStyle;
		footStyle: string | WStyle;
		ydivStyle: string | WStyle;
		textStyle: string | WStyle;
		overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';

		constructor(id?: string, classStyle?: string, style?: string, attributes?: string | object, props?: any) {
			// WComponent init
			super(id ? id : '*', 'WGrid', props, classStyle, style, attributes);
			// WGrid init
			this.rows = [];
			this.overflow = 'auto';
		}

		getWidth(): number {
			let maxw = 0;
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				let wro = 0;
				for (let j = 0; j < row.cols.length; j++) {
					let w = row.cols[j].width;
					wro += w ? w : 50;
				}
				if (wro > maxw) maxw = wro;
			}
			return maxw;
		}

		getHeight(): number {
			let r = 0;
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				if (row.height) {
					r += row.height
					continue;
				}
				let maxh = 0;
				for (let j = 0; j < row.cols.length; j++) {
					if (row.cols[j].height > maxh) maxh = row.cols[j].height;
				}
				if (maxh == 0) maxh = 25;
				r += maxh;
			}
			return r;
		}

		getRowIndex(ref: string): number {
			if (!this.rows || !this.rows.length) return -1;
			for (let i = 0; i < this.rows.length; i++) {
				if (this.rows[i].ref == ref) return i;
			}
			return -1;
		}

		removeAll(): this {
			this.rows = [];
			return this;
		}

		addRow(width?: number, height?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object): WGridRow {
			let row = new WGridRow(this, this.rows.length, width, height, classStyle, style, attributes);
			this.rows.push(row);
			return row;
		}

		addCol(width?: number, height?: number, ...components: (WElement)[]): WGridCol {
			return this.row().addCol(width, height, ...components);
		}

		add(component?: WElement): WGridCol {
			if (!component) return this.col();
			return this.col().add(component);
		}

		y(): WGridCol {
			return this.col().y();
		}

		tip(...titles: string[]): WGridCol {
			return this.col().tip(...titles);
		}

		row(r?: number): WGridRow {
			if (!r && this.rows.length <= r) return undefined;
			if (!this.rows.length) this.addRow();
			if (r === undefined || r === null) r = this.rows.length - 1;
			return this.rows[r];
		}

		col(r?: number, c?: number): WGridCol {
			let rrow = this.row(r);
			if (!rrow) return undefined;
			if (!c && rrow.cols.length <= c) return undefined;
			if (!rrow.cols.length) rrow.addCol();
			if (c === undefined || c === null) c = rrow.cols.length - 1;
			return rrow.cols[c];
		}

		find(component?: WElement): [number, number, number] {
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.cols.length; j++) {
					let col = row.cols[j];
					for (let k = 0; k < col.components.length; k++) {
						if (WUX.same(col.components[k], component)) return [i, j, k];
					}
				}
			}
			return [-1, -1, -1];
		}

		element(row: number): JQuery;
		element(row: number, col: number): JQuery;
		element(row: number, col: number, idx: number): WElement;
		element(row: number, col?: number, idx?: number): WElement {
			if (col === undefined || col === null) return $('#' + this.id + '-' + row);
			if (idx === undefined || idx === null) return $('#' + this.id + '-' + row + '-' + col);
			let gcol = this.col(row, col);
			if (!gcol) return undefined;
			if (gcol.components.length > idx) return gcol.components[idx];
			return undefined;
		}

		html(row: number, col: number, k: number, h: string): boolean {
			if (!this.mounted) return false;
			if (row >= 0 && this.rows.length <= row) return false;
			if (col >= 0 && this.rows[row].cols.length <= col) return false;
			let gcol = this.rows[row].cols[col];
			let cid = this.id + '-' + row + '-' + col;
			if (gcol.ylayout) {
				$('#' + cid + '-' + k).html(h);
			}
			else {
				$('#' + cid).html(h);
			}
			return true;
		}

		cell(row: number, col: number, ...ac: (WElement)[]): boolean {
			if (row >= 0 && this.rows.length <= row) return false;
			if (col >= 0 && this.rows[row].cols.length <= col) return false;
			let gcol = this.rows[row].cols[col];
			if (this.mounted) {
				if (ac && ac.length == 1) gcol.ylayout = false;
				let cid = this.id + '-' + row + '-' + col;
				if (gcol.ylayout) {
					for (let k = 0; k < gcol.components.length; k++) {
						$('#' + cid + '-' + k).html('');
					}
				}
				else {
					$('#' + cid).html('');
				}
				if (ac) {
					for (let k = 0; k < ac.length; k++) {
						if (gcol.ylayout) cid = this.id + '-' + row + '-' + col + '-' + k;
						let c = ac[k];
						if (c instanceof WComponent) {
							c.mount($('#' + cid));
							if (!c.parent) c.parent = this;
						}
						else {
							$('#' + cid).append(c);
						}
					}
				}
			}
			gcol.cell(...ac);
			return true;
		}

		protected make(): string {
			if (!this.overflow) this.overflow = 'auto';
			let r = '';
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				let firstRow = i == 0;
				let lastRow = i == this.rows.length - 1;
				if (row.attributes) {
					r += '<div id="' + this.id + '-' + i + '"' + this.buildRowStyle(row, firstRow, lastRow) + this.buildClass(row) + ' ' + row.attributes + '>';
				}
				else {
					r += '<div id="' + this.id + '-' + i + '"' + this.buildRowStyle(row, firstRow, lastRow) + this.buildClass(row) + '>';
				}
				for (let j = 0; j < row.cols.length; j++) {
					let col = row.cols[j];
					let cid = this.id + '-' + i + '-' + j;
					if (col.ylayout) {
						r += '<span' + this.buildColStyle(col, firstRow, lastRow, false, row.height) + this.buildClass(col) + ' id="' + cid + '">';
						let dh = Math.round(100 / col.components.length);
						for (let k = 0; k < col.components.length; k++) {
							let divs = WUX.css(this.ydivStyle, this.isText(col.components[k]) ? this.textStyle : '');
							let ct = col.title(k);
							let dt = ct ? ' title="' + ct + '"' : '';
							r += '<div id="' + this.id + '-' + i + '-' + j + '-' + k + '" + style="width:100%;height:' + dh + '%;' + divs + '"' + dt + '></div>';
						}
						r += '</span>';
					}
					else {
						let ct = col.title();
						let st = ct ? ' title="' + ct + '"' : '';
						if (col.width == 0 && j == row.cols.length - 1) {
							r += '<div' + this.buildColStyle(col, firstRow, lastRow, true, row.height) + this.buildClass(col) + ' id="' + cid + '"' + st + '></div>';
						}
						else {
							r += '<span' + this.buildColStyle(col, firstRow, lastRow, false, row.height) + this.buildClass(col) + ' id="' + cid + '"' + st + '></span>';
						}
					}
				}
				r += '</div>';
			}
			return r;
		}

		protected componentDidMount(): void {
			for (let i = 0; i < this.rows.length; i++) {
				let row = this.rows[i];
				for (let j = 0; j < row.cols.length; j++) {
					let col = row.cols[j];
					for (let k = 0; k < col.components.length; k++) {
						let c = col.components[k];
						let cid = this.id + '-' + i + '-' + j;
						if (col.ylayout) cid += '-' + k;
						if (c instanceof WComponent) {
							c.mount($('#' + cid));
						}
						else {
							$('#' + cid).append(c);
						}
					}
				}
			}
		}

		componentWillUnmount(): void {
			for (let row of this.rows) {
				for (let col of row.cols) {
					for (let c of col.components) {
						if (c instanceof WComponent) c.unmount();
					}
				}
			}
		}

		protected buildRowStyle(e: WGridElement, fistRow: boolean, lastRow: boolean): string {
			let s = '';
			if (e.width < 0) {
				s = WUX.css(this.rowsStyle, { d: 'table', h: e.height }, e.style);
			}
			else {
				s = WUX.css(this.rowsStyle, { w: e.width, h: e.height }, e.style);
			}
			if (s.indexOf('overflow') > 0) return ' style="' + s + '"';
			if (e.width || e.height) return ' style="' + s + 'overflow:' + this.overflow + ';"';
			return ' style="' + s + 'overflow:hidden;"';
		}

		protected buildColStyle(e: WGridElement, fistRow: boolean, lastRow: boolean, fill?: boolean, h?: number): string {
			let styles: (string | WStyle)[] = [];
			if (!this.ydivStyle || !e.ylayout) {
				styles.push(this.colsStyle);
			}
			if (fistRow && this.headStyle) {
				styles.push(this.headStyle);
			}
			else if (lastRow && this.footStyle) {
				styles.push(this.footStyle);
			}
			if (!e.ylayout && this.isAllText(e.components)) {
				styles.push(this.textStyle);
			}
			styles.push(e.style);
			styles.push({ w: e.width, h: e.height ? e.height : h });
			let s = css(...styles);
			if (fill) {
				if (s.indexOf('overflow') > 0) return ' style="' + s + '"';
				return ' style="' + s + 'overflow:' + this.overflow + ';"';
			}
			else {
				if (s.indexOf('overflow') > 0) return ' style="' + s + 'float:left;"';
				return ' style="' + s + 'float:left;overflow:hidden;"';
			}
		}

		protected buildClass(e: WGridElement): string {
			return e.classStyle ? ' class="' + e.classStyle + '"' : '';
		}

		protected isAllText(ae: WElement[]): boolean {
			if (!ae) return false;
			for (let e of ae) {
				if (!this.isText(e)) return false;
			}
			return true;
		}

		protected isText(e: WElement): boolean {
			if (typeof e == 'string') {
				if (!e) return false;
				if (e.indexOf('<') < 0) return true;
				if (e.indexOf('<di') >= 0) return false;
				if (e.indexOf('<in') >= 0) return false;
				if (e.indexOf('<se') >= 0) return false;
				if (e.indexOf('<bu') >= 0) return false;
				if (e.indexOf('<im') >= 0) return false;
				if (e.indexOf('<ta') >= 0) return false;
				if (e.indexOf('<if') >= 0) return false;
				if (e.indexOf('<a') >= 0) return false;
				return true;
			}
			return false;
		}
	}

	export class WFullDialog<P = any, S = any> extends WComponent<P, S> {
		cntRoot: WContainer;
		cntMain: WContainer;
		cntContent: WContainer;
		cntHeader: WContainer;
		cntBody: WContainer;
		cntFooter: WContainer;
		// GUI
		protected _title: string;
		protected tagTitle: string;
		btnCloseHeader: WButton;
		btnOK: WButton;
		btnCancel: WButton;
		txtCancel: string;
		buttons: WButton[];
		// Flag
		ok: boolean;
		cancel: boolean;
		isShown: boolean;
		// Control
		parentHandler: (e?: JQueryEventObject) => any;
		// Internal flags
		protected phHidden: boolean;

		static fullDialogsShown: WFullDialog[] = [];

		constructor(id: string, name: string = 'WFullDialog', btnOk = true, btnClose = true, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			super(id, name, undefined, classStyle, style, attributes);
			this.buttons = [];
			this.tagTitle = 'h3';
			if (btnClose) {
				if (!btnOk) this.txtCancel = RES.CLOSE;
				this.buttonCancel();
			}
			if (btnOk) this.buttonOk();
			this.ok = false;
			this.cancel = false;
			this.isShown = false;
			// Auto-mount
			if (this.id && this.id != '*') {
				if ($('#' + this.id).length) $('#' + this.id).remove();
			}
			WuxDOM.onRender((e: WEvent) => {
				if (this.mounted) return;
				this.mount(e.element);
			});
		}

		onShownModal(handler: (e?: JQueryEventObject) => any) {
			if (!this.handlers['_pageshown']) this.handlers['_pageshown'] = [];
			this.handlers['_pageshown'].push(handler);
		}

		onHiddenModal(handler: (e?: JQueryEventObject) => any) {
			if (!this.handlers['_pagehidden']) this.handlers['_pagehidden'] = [];
			this.handlers['_pagehidden'].push(handler);
		}

		get header(): WContainer {
			if (this.cntHeader) return this.cntHeader;
			this.cntHeader = new WContainer('', 'modal-header');
			this.btnCloseHeader = new WButton(this.subId('bhc'), '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>', undefined, 'close');
			this.btnCloseHeader.on('click', (e: JQueryEventObject) => {
				this.close();
			});
			this.cntHeader.add(this.btnCloseHeader);
			return this.cntHeader;
		}

		get body(): WContainer {
			if (this.cntBody) return this.cntBody;
			this.cntBody = new WContainer('', WUX.cls('modal-body', this._classStyle), '', this._attributes);
			return this.cntBody;
		}

		get footer(): WContainer {
			if (this.cntFooter) return this.cntFooter;
			this.cntFooter = new WContainer('', 'modal-footer');
			return this.cntFooter;
		}

		get title(): string {
			return this._title;
		}
		set title(s: string) {
			if (this._title && this.cntHeader) {
				this._title = s;
				this.cntHeader.getRoot().children(this.tagTitle + ':first').text(s);
			}
			else {
				this._title = s;
				this.header.add(this.buildTitle(s));
			}
		}

		protected onClickOk(): boolean {
			return true;
		}

		protected onClickCancel(): boolean {
			return true;
		}

		protected buildBtnOK(): WButton {
			return new WButton(this.subId('bfo'), RES.OK, '', BTN.INFO + ' button-sm', '', '');
		}

		protected buildBtnCancel(): WButton {
			if (this.txtCancel) {
				return new WButton(this.subId('bfc'), this.txtCancel, '', BTN.SECONDARY + ' button-sm', '', '');
			}
			return new WButton(this.subId('bfc'), RES.CANCEL, '', BTN.SECONDARY + ' button-sm', '', '');
		}

		buttonOk(): WButton {
			if (this.btnOK) return this.btnOK;
			this.btnOK = this.buildBtnOK();
			this.btnOK.on('click', (e: JQueryEventObject) => {
				if (this.onClickOk()) {
					this.ok = true;
					this.cancel = false;
					this.hide();
				}
			});
			this.buttons.push(this.btnOK);
		}

		buttonCancel(): WButton {
			if (this.btnCancel) return this.btnCancel;
			this.btnCancel = this.buildBtnCancel();
			this.btnCancel.on('click', (e: JQueryEventObject) => {
				if (this.onClickCancel()) {
					this.ok = false;
					this.cancel = true;
					this.hide();
				}
			});
			this.buttons.push(this.btnCancel);
		}

		show(parent: WComponent, handler?: (e?: JQueryEventObject) => any): void {
			if (!this.beforeShow()) return;
			this.ok = false;
			this.cancel = false;
			this.parent = parent;
			this.parentHandler = handler;
			if (!this.mounted) WuxDOM.mount(this);
			if (this.root && this.root.length) {
				if (WFullDialog.fullDialogsShown.length) {
					// Hide previous full dialog
					WFullDialog.fullDialogsShown[WFullDialog.fullDialogsShown.length - 1].visible = false;
				}
				else {
					// Hide view
					this.hideView();
				}
				// Show FullDialog
				this.cntRoot.visible = true;
				this.isShown = true;
				this.onShown();
				WFullDialog.fullDialogsShown.push(this);
				// Trigger event
				if (!this.handlers['_pageshown']) return;
				for (let h of this.handlers['_pageshown']) {
					h(this.createEvent('_pageshown'));
				}
			}
		}

		hide(e?: JQueryEventObject): void {
			if (this.root && this.root.length) {
				this.cntRoot.visible = false;
				this.isShown = false;
				this.onHidden();
				WFullDialog.fullDialogsShown.pop();
				if (WFullDialog.fullDialogsShown.length) {
					// Show previous full dialog
					WFullDialog.fullDialogsShown[WFullDialog.fullDialogsShown.length - 1].visible = true;
				}
				else {
					// Show view
					this.showView();
				}
				if (this.parentHandler) {
					this.parentHandler(e);
					this.parentHandler = null;
				}
				if (!this.handlers['_pagehidden']) return;
				for (let h of this.handlers['_pagehidden']) {
					h(this.createEvent('_pagehidden'));
				}
			}
		}

		protected showView() {
			if (this.parent) {
				let rc = WUX.getRootComponent(this.parent);
				if (rc) rc.visible = true;
			}
			if (this.phHidden) {
				let $ph = WUX.getPageHeader();
				if ($ph && $ph.length) $ph.show();
				this.phHidden = false;
			}
		}

		protected hideView() {
			this.phHidden = false;
			if (this.parent) {
				let rc = WUX.getRootComponent(this.parent);
				if (rc) rc.visible = false;
			}
			let $ph = WUX.getPageHeader();
			if ($ph && $ph.length && $ph.is(':visible')) {
				$ph.hide();
				this.phHidden = true;
			}
		}

		close(): void {
			this.ok = false;
			this.cancel = false;
			this.hide();
		}

		selection(table: WITable, warn?: string): boolean {
			if (!table) return false;
			let sr = table.getSelectedRows();
			if (!sr || !sr.length) {
				if (warn) WUX.showWarning(warn);
				return false;
			}
			let sd = table.getSelectedRowsData();
			if (!sd || !sd.length) {
				if (warn) WUX.showWarning(warn);
				return false;
			}
			if (this.props == null || typeof this.props == 'number') {
				let idx: any = sr[0];
				this.setProps(idx);
			}
			this.setState(sd[0]);
			return true;
		}

		protected beforeShow(): boolean {
			return true;
		}

		protected onShown() {
		}

		protected onHidden() {
		}

		protected render() {
			this.isShown = false;
			this.cntRoot = new WContainer(this.id, 'inmodal');
			this.cntRoot.visible = false;
			this.cntMain = this.cntRoot.addContainer('', 'modal-dialog', WUX.css(this._style, { w: '100%', m: 0, z: 'auto' }));
			this.cntContent = this.cntMain.addContainer('', 'modal-content');
			if (this.cntHeader) this.cntContent.addContainer(this.cntHeader);
			if (this.cntBody) this.cntContent.addContainer(this.cntBody);
			for (let btn of this.buttons) this.footer.add(btn);
			if (this.cntFooter) this.cntContent.addContainer(this.cntFooter);
			return this.cntRoot;
		}

		componentWillUnmount(): void {
			this.isShown = false;
			if (this.btnCloseHeader) this.btnCloseHeader.unmount();
			if (this.btnCancel) this.btnCancel.unmount();
			if (this.cntFooter) this.cntFooter.unmount();
			if (this.cntBody) this.cntBody.unmount();
			if (this.cntHeader) this.cntHeader.unmount();
			if (this.cntContent) this.cntContent.unmount();
			if (this.cntMain) this.cntMain.unmount();
			if (this.cntRoot) this.cntRoot.unmount();
		}

		protected buildTitle(title: string): string {
			if (!this.tagTitle) this.tagTitle = 'h3';
			return '<' + this.tagTitle + '>' + WUtil.toText(title) + '</' + this.tagTitle + '>';
		}
	}

	export class WLookupDialog extends WDialog<any, any[]> {
		fp: WUX.WFormPanel;
		table: WUX.WITable;
		keys: any[];
		selected: any;
		lookup: (params: any[], rh: (result: any) => void, eh?: (error: JRPCError) => void) => void;
		startup: boolean;
		lc: string = 'Codice';
		ld: string = 'Descrizione';

		constructor(id: string, title: string, keys: any[], tbl?: WUX.WITable, onlyTable?: boolean) {
			super(id, 'WLookupDialog');

			this.title = title;

			if (!onlyTable) {
				this.fp = new WUX.WFormPanel(this.subId('fp'));
				this.fp.addRow();
				this.fp.addTextField('c', this.lc);
				this.fp.addRow();
				this.fp.addTextField('d', this.ld);
				this.fp.on('statechange', (e: WUX.WEvent) => {
					if (this.lookup) {
						this.lookup(this.getFilter(), (result) => {
							this.table.setState(result);
						});
					}
				});
			}

			if (tbl) {
				if (!tbl.id) tbl.id = this.subId('tbl');
				if (!tbl.header || !tbl.header.length) tbl.header = [this.lc, this.ld];
				this.table = tbl;
				this.table.keys = keys;
			}
			else {
				this.table = new WUX.WTable(this.subId('tbl'), [this.lc, this.ld], keys);
			}

			this.table.widths[0] = 200;
			if (onlyTable) {
				this.table.filter = true;
			}
			this.table.css({ h: 360 });
			this.table.onDoubleClick((e: { element?: JQuery }) => {
				let rd = this.table.getSelectedRowsData();
				this.selected = rd && rd.length ? rd[0] : undefined;
				if (this.selected) {
					this.hide();
					this.trigger('_selected', this.selected);
				}
			});

			if (onlyTable) {
				this.body
					.addRow()
					.addCol('12', { pt: 8, pb: 8 })
					.add(this.table);
			}
			else {
				this.body
					.addRow()
					.addCol('12')
					.add(this.fp)
					.addRow()
					.addCol('12', { pt: 8, pb: 8 })
					.add(this.table);
			}
		}

		protected updateState(nextState: any[]): void {
			super.updateState(nextState);
			if (this.table) {
				this.table.setState(this.state);
			}
		}

		setFilter(params: any[]): void {
			if (!this.fp) return;
			this.fp.setValue('c', WUtil.getItem(params, 0));
			this.fp.setValue('d', WUtil.getItem(params, 1));
		}

		getFilter(): any[] {
			let r = [];
			if (!this.fp) {
				r.push('');
				r.push('');
				return r;
			}
			r.push(this.fp.getValue('c'));
			r.push(this.fp.getValue('d'));
			return r;
		}

		onSelected(handler: (e: WEvent) => any): void {
			if (!this.handlers['_selected']) this.handlers['_selected'] = [];
			this.handlers['_selected'].push(handler);
		}

		protected onShown() {
			this.startup = true;
			this.table.refresh();
			if (this.fp) {
				let d = this.fp.getValue('d');
				if (d) {
					this.fp.focusOn('d');
				}
				else {
					this.fp.focusOn('c');
				}
			}
		}

		protected onClickOk(): boolean {
			let rd = this.table.getSelectedRowsData();
			this.selected = rd && rd.length ? rd[0] : undefined;
			if (!this.selected) {
				WUX.showWarning('Selezionare un elemento.');
				return;
			}
			setTimeout(() => {
				this.trigger('_selected', this.selected);
			}, 100);
			return true;
		}
	}

	export class WMenu extends WUX.WComponent {
		handler: (e: JQueryEventObject) => any;
		data: any;
		items: WUX.WEntity[];
		title: string;

		constructor(id?: string, classStyle: string = 'btn-group') {
			super(id ? id : '*', 'WMenu', '', classStyle);
			this.items = [];
			this.title = 'Seleziona';
		}

		addItem(item: WUX.WEntity): this;
		addItem(id: string, icon: WUX.WIcon | string, text: string, bdef?: boolean): this;
		addItem(id: WUX.WEntity | string, icon?: WUX.WIcon | string, text?: string, bdef?: boolean): this {
			if (typeof id == 'string') {
				this.items.push({ id: id, icon: icon, text: text, marked: bdef });
			}
			else {
				this.items.push(id);
			}
			return this;
		}

		addSep(): this {
			this.items.push({ id: '', type: 'b' });
			return this;
		}

		addSection(name: string): this {
			this.items.push({ id: '', type: 's', text: name });
			return this;
		}

		onClick(handler?: (e: JQueryEventObject) => any) {
			this.handler = handler;
		}

		protected buildItem(node: JQuery, code: string, icon: string, text: string, bdef?: boolean) {
			let $li = $('<li></li>');
			$li.appendTo(node);
			let $a: JQuery;
			if (bdef) {
				$a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;<strong>' + text + '</strong></a>')
			}
			else {
				$a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;' + text + '</a>')
			}
			$a.appendTo($li);
			$a.on('click', (e: JQueryEventObject) => {
				e.data = this.data;
				e.key = code;
				this.handler(e);
			});
		}

		protected componentDidMount(): void {
			if (this.title == null) this.title = 'Seleziona';
			let dt = $('<a class="btn btn-link btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + this.title + ' <span class="caret"></span></a>');
			dt.appendTo(this.root);
			let dm = $('<ul class="dropdown-menu dropdown-menu-right"></ul>');
			dm.appendTo(this.root);

			if (!this.items) this.items = [];
			for (let item of this.items) {
				if (!item.type || item.type == 'i') {
					this.buildItem(dm, item.id, item.icon, item.text, item.marked);
				}
				else if (item.type == 'b') {
					dm.append($('<li role="separator" class="divider"></li>'));
				}
				else if (item.type == 's') {
					dm.append($('<li class="dropdown-header">' + item.text + '</li>'));
				}
			}
		}
	}
}