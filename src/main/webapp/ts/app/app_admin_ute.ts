namespace APP {
	
	import WUtil = WUX.WUtil;
	
	export class GUIAdminUte extends WUX.WComponent {
		
		protected fpFilter: WUX.WFormPanel;
		protected tabResult: WUX.WDXTable;
		
		protected btnFind: WUX.WButton;
		protected btnReset: WUX.WButton;
		
		protected container: WUX.WContainer;
		// Azioni Base
		protected cntActions: AppTableActions;
		protected btnToggle: WUX.WButton;
		
		constructor(id?: string) {
			super(id ? id : '*', 'GUIAdminUte');
		}
		
		render() {
			this.fpFilter = new WUX.WFormPanel('fpFilter');
			this.fpFilter.addRow();
			this.fpFilter.addComponent('idRuolo',  'Ruolo', new APPSelRuoloUte());
			this.fpFilter.addTextField('email',    'Email');
			this.fpFilter.addTextField('telefono', 'Telefono');
			
			this.btnFind = new WUX.WButton(this.subId('bf'), TXT.FIND, '', WUX.BTN.SM_PRIMARY, 'width: 160px');
			this.btnFind.on('click', (e: JQueryEventObject) => {
				if (this.fpFilter.isBlank()) {
					WUX.showWarning('Specificare almeno un criterio di ricerca.');
					return;
				}
				
				let check = this.fpFilter.checkMandatory(true, true, true);
				if (check) {
					WUX.showWarning('Specificare almeno uno dei seguenti campi: ' + check);
					return;
				}
				
				jrpc.execute('UTENTI.find', [this.fpFilter.getState()], (result: any[]) => {
					this.tabResult.setState(result);
					if (result && result.length) {
						WUX.showSuccess(result.length + ' record trovati');
					}
					else {
						WUX.showWarning('Nessun record trovato');
					}
				});
			});
			this.btnReset = new WUX.WButton(this.subId('br'), TXT.RESET, '', WUX.BTN.SM_SECONDARY, 'width: 160px');
			this.btnReset.on('click', (e: JQueryEventObject) => {
				// Clear filter
				this.fpFilter.clear();
				// Clear result table
				this.tabResult.setState([]);
				// Focus on filter
				this.fpFilter.focus();
			});
			this.btnToggle = new WUX.WButton(this.subId('bt'), TXT.ENABLE, WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
			this.btnToggle.on('click', (e: JQueryEventObject) => {
				this.btnToggle.blur();
				let rd = this.tabResult.getSelectedRowsData();
				if (!rd || !rd.length) {
					WUX.showWarning('Selezione l\'elemento da abilitare / disabilitare');
					return;
				}
				let i = WUtil.getString(rd[0], 'id');
				let s = WUtil.getBoolean(rd[0], 'attivo');
				let n = !s;
				if(!i) return;
				jrpc.execute('UTENTI.setEnabled', [i, n], (result) => {
					if(!result) {
						WUX.showWarning('Utente non aggiornato.');
						return;
					}
					if(n) {
						this.btnToggle.setText(TXT.DISABLE, WUX.WIcon.THUMBS_O_DOWN);
					}
					else {
						this.btnToggle.setText(TXT.ENABLE, WUX.WIcon.THUMBS_O_UP);
					}
					let sr = this.tabResult.getSelectedRows();
					if(sr && sr.length) {
						let r = this.tabResult.getState();
						let x = sr[0];
						r[x]['attivo'] = n;
						this.tabResult.refresh();
						setTimeout(() => { this.tabResult.select([x]); }, 100);
					}
				});
			});
			
			this.cntActions = new AppTableActions('ta');
			this.cntActions.left.add(this.btnToggle);

			let rc = [
				['Username', 'id', 's'],
				['Ruolo', 'idRuolo', 's'],
				['Email', 'email', 's'],
				['Telefono', 'telefono', 's'],
				['Verificato', 'verificato', 'b'],
				['Attivo', 'attivo', 'b'],
				['Primo Accesso', 'dtpa', 't'],
				['Ultimo Accesso', 'dtua', 't'],
				['Accesso', 'dta', 't'],
			];

			this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
			this.tabResult.types = WUtil.col(rc, 2);
			this.tabResult.css({ h: 400 });
			this.tabResult.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number, isSelected?: boolean }) => {
				if (!e.data) return;
				let v = WUtil.getBoolean(e.data, 'verificato');
				let a = WUtil.getBoolean(e.data, 'attivo');
				if (!a) {
					WUX.setCss(e.rowElement, WUX.CSS.ERROR);
				}
				else if (!v) {
					WUX.setCss(e.rowElement, WUX.CSS.WARNING);
				}
			});
			this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {
				let f = WUtil.getFirst(this.tabResult.getSelectedRowsData(), 0);
				if (!f) return;
				let a = WUtil.getBoolean(f, 'attivo');
				if(a) {
					this.btnToggle.setText(TXT.DISABLE, WUX.WIcon.THUMBS_O_DOWN);
				}
				else {
					this.btnToggle.setText(TXT.ENABLE, WUX.WIcon.THUMBS_O_UP);
				}
			});

			this.tabResult.filter = true;
			this.tabResult.exportFile = 'utenti';

			this.container = new WUX.WContainer();
			this.container.attributes = WUX.ATT.STICKY_CONTAINER;
			this.container
				.addRow()
					.addCol('col-md-10')
					.section('Filtro')
						.add(this.fpFilter)
					.addCol('col-md-2')
						.addGroup({ classStyle: 'form-group text-right' }, this.btnFind, this.btnReset)
				.addRow()
					.addGroup({ classStyle: 'table-result-wrapper' }, this.cntActions, this.tabResult);

			return this.container;
		}
	}
}