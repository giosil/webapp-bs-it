namespace APP {
	
	import WUtil = WUX.WUtil;
	
	export class GUISample extends WUX.WComponent {
		protected fpMain: WUX.WFormPanel;
		protected btnSave: WUX.WButton;
		
		protected container: WUX.WContainer;
		
		protected jqv: JQueryValidation.Validator;
		
		// Campi obbligatori (mandatory)
		protected _ma: string[] = ['ragioneSociale', 'email'];
		
		constructor(id?: string) {
			super(id ? id : '*', 'GUISample');
		}
		
		render() {
			this.fpMain = new WUX.WFormPanel('fpMain');
			this.fpMain.addRow();
			this.fpMain.addTextField('ragioneSociale', 'Ragione Sociale');
			this.fpMain.addRow();
			this.fpMain.addTextField('email', 'Email');
			this.fpMain.addTextField('telefono', 'Telefono');
			
			this.fpMain.setMandatory(...this._ma);
			
			this.btnSave = new WUX.WButton(this.subId('btnSave'), TXT.SAVE, WUX.WIcon.CHECK, WUX.BTN.PRIMARY);
			this.btnSave.on('click', (e: JQueryEventObject) => {
				// Validazione tramite JQueryValidation
				let f = this.fpMain.getRoot();
				this.initValidator(f);
				let n = !f.valid(); // Flag non valido
				
				// Il focus automatico di JQueryValidation sembra non funzionare: 
				// si esegue scrollTop per visualizzare la form.
				if(n) scrollTo(this.fpMain);
				
				// Sui campi Select2 la validazione sembra non funzionare 
				// malgrado l'implementazione di work around (ignore: null).
				// n = !check(this.selCNa, 'Selezionare il comune di nascita.', !n) || n;
				
				if(n) {
					WUX.showWarning('Controllare i valori immessi');
					return;
				}
				
				// Ulteriore meccanismo di validazione
				let cm = this.fpMain.checkMandatory(true, true, false);
				if (cm) {
					WUX.showWarning('Specificare i seguenti campi: ' + cm);
					return;
				}
				
				$(window).scrollTop(0);
				
				let a = new APPArticle('art-sample', 'Sample');
				a.addSignature = true;
				
				let m: string[] = [];
				m.push('La ringraziamo per il tempo dedicato.');
				a.setState(m);
				
				let t = WUX.getPageTitle();
				if(t && t.length) t.hide();
				
				WuxDOM.replace(this, a);
			});
			
			this.container = new WUX.WContainer();
			this.container
				.addRow()
					.addCol('col-md-12')
						.section('Dati principali')
						.add(this.fpMain)
				.addRow()
					.addCol('col-md-12', {a: 'center', pt: 16})
						.add(this.btnSave);
			
			return this.container;
		}

		componentDidMount(): void {
			this.initValidator(this.fpMain.getRoot());
		}

		initValidator(f: JQuery, r?: boolean) {
			if(!f || !f.length) return;
			// Nel caso venga richiamato con condizioni diverse
			// occorre rimuovere le regole tramite f.removeData('validator').
			f.removeData('validator');
			this.jqv = f.validate({
				ignore: null,
				rules: {
					// 'fpMain-partitaIVA': { required: true, piva: true},
					// 'fpMain-codiceFiscale': { required: true, codfis: true},
					'fpMain-ragioneSociale': { required: true },
					'fpMain-email': { required: true, email: true },
					'fpMain-telefono': { required: false, minlength: 6, maxlength: 15, digits: true},
				}
			});
			if(r) this.jqv.resetForm();
		}
	}
}