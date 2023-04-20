namespace APP {
	
	export const STATUS_STARTUP = 0;
	export const STATUS_VIEW    = 1;
	export const STATUS_EDITING = 2;
	
	export interface User {
		userName: string;
		tokenId: string;
		role?: string;
		lastName?: string;
		firstName?: string;
		email?: string;
		mobile?: string;
		structure?: number;
	}
	
	export interface FHWFile {
		/** Filename */
		f: string;
		/** Date */
		d?: Date;
		/** Type */
		t?: string;
		/** Size */
		s?: number;
	}
	
	export function getUserLogged(): User {
		let userLogged = window ? window['_userLogged'] : undefined;
		if (userLogged && typeof userLogged == 'object') return userLogged as User;
		return { userName: 'public', tokenId: 'public' };
	}
	
	export class ITabella {
		static ID          = 'id';
		static DESCRIZIONE = 'des';
		static DESCRIZ_ALT = 'alt';
		static ID_GRUPPO   = 'idg';
		static DES_GRUPPO  = 'deg';
		static DETTAGLIO   = 'det';
		static ANAGRAFICHE = 'ana';
		static ALLEGATO    = 'all';
		static ATTIVO      = 'att';
	}
	
	export function scrollTo(c: WUX.WComponent | JQuery) {
		if(!c) return;
		let r = (c instanceof WUX.WComponent) ? c.getRoot() : c;
		if(!r || !r.length) return;
		$(window).scrollTop(r.offset().top - 300);
	}
	
	// Funzione da richiamare per quei componenti non gestibili da JQueryValidation o controlli spot
	export function check(e: any, message? : string, focus?: boolean): boolean {
		let id = WUX.getId(e);
		if(!id) return true;
		
		let c = (e instanceof WUX.WComponent) ? e : WUX.getComponent(e);
		let r = c ? c.getRoot() : $('#' + id);
		if(!r || !r.length) return true;
		
		let s = c ? c.getState() : (r.attr('type') == 'checkbox' ? r.prop('checked') : r.val());
		
		let l = $('#' + id + '-error');
		if(s) {
			if(l.length) l.remove();
			return true;
		}
		if(!message) message = 'Campo obbligatorio.';
		if(message == '-') return false;
		
		if(l.length) {
			l.html(message);
			l.show();
			if(focus) {
				if(c) {
					c.focus();
				}
				else {
					r.focus();
				}
			}
			return false;
		}
		r.parent().append('<label id="' + id + '-error" class="error active" for="' + id + '">' + message + '</label>');
		if(focus) {
			if(c) {
				c.focus();
			}
			else {
				r.focus();
			}
		}
		return false;
	}
	
	export function label(text: string, ...styles: (string | WUX.WStyle)[]) {
		if(!text) text = '';
		let la = '';
		let lc = WUX.cls(...styles);
		let ls = WUX.css(...styles);
		if (lc) la += ' class="' + lc + '"';
		if (ls) la += ' style="' + ls + '"';
		return '<label' + la + '>' + text + '</label>'
	}
}

var jrpc = new JRPC("/webapp-bs-it/rpc");
jrpc.setToken(APP.getUserLogged().tokenId);