namespace APP {
	import WIcon = WUX.WIcon;

	export class TXT {
		// Captions
		static readonly OK = 'OK';
		static readonly CLOSE = 'Chiudi';
		static readonly NEW = 'Nuovo';
		static readonly OPEN = 'Modifica';
		static readonly DELETE = 'Elimina';
		static readonly SAVE = 'Salva';
		static readonly SEND = 'Invia';
		static readonly SEND_EMAIL = 'Email';
		static readonly FIND = 'Cerca';
		static readonly FORCE = 'Forza';
		static readonly SEARCH = 'Cerca';
		static readonly CANCEL = 'Annulla';
		static readonly RESET = 'Annulla';
		static readonly PRINT = 'Stampa';
		static readonly PRINT_ALL = 'Stampa Tutto';
		static readonly PREVIEW = 'Anteprima';
		static readonly EXPORT = 'Esporta';
		static readonly IMPORT = 'Importa';
		static readonly HELP = 'Guida';
		static readonly VIEW = 'Vedi';
		static readonly ENABLE = 'Abilita';
		static readonly DISABLE = 'Disabilita';
		static readonly ADD = 'Aggiungi';
		static readonly APPLY = 'Applica';
		static readonly REMOVE = 'Rimuovi';
		static readonly REMOVE_ALL = 'Rim.Tutto';
		static readonly REFRESH = 'Aggiorna';
		static readonly UNDO = 'Annulla';
		static readonly SETTINGS = 'Impostazioni';
		static readonly COPY = 'Copia';
		static readonly CUT = 'Taglia';
		static readonly PASTE = 'Incolla';
		static readonly CONFIRM = 'Conferma';
		static readonly FORWARD = 'Avanti';
		static readonly BACKWARD = 'Indietro';
		static readonly NEXT = 'Prossimo';
		static readonly PREVIOUS = 'Precedente';
		static readonly SELECT = 'Seleziona';
		static readonly SELECT_ALL = 'Sel.Tutto';
		static readonly WORK = 'Lavora';
		static readonly AGGREGATE = 'Aggrega';
		static readonly SET = 'Imposta';
		static readonly DEFAULT = 'Predefinito';
		static readonly REWORK = 'Rielabora';
		static readonly PUSH = 'Spedisci';
		static readonly SUSPEND = 'Sospendi';
		static readonly RESUME = 'Riattiva';
		// Entities
		static readonly CODE = 'Codice';
		static readonly DESCRIPTION = 'Descrizione';
		static readonly GROUP = 'Gruppo';
		static readonly ROLE = 'Ruolo';
		static readonly TYPE = 'Tipo';
	}

	export class MSG {
		static readonly CONF_DELETE = 'Eliminare l\'elemento selezionato?';
		static readonly CONF_DISABLE = 'Disabilitare l\'elemento selezionato?';
		static readonly CONF_ENABLE = 'Abilitare l\'elemento selezionato?';
		static readonly CONF_CANCEL = 'Si vogliono annullare le modifiche apportate?';
		static readonly CONF_PROCEED = 'Si vuole procedere con l\'operazione?';
		static readonly CONF_OVERWRITE = 'Si vuole procedere con la sovrascrittura?';

		static readonly MSG_COMPLETED = 'Operazione completata con successo.';
		static readonly MSG_ERRORS = 'Errore durante l\'elaborazione.';
	}

	export class ICO {
		// base
		static readonly TRUE = WIcon.CHECK_SQUARE_O;
		static readonly FALSE = WIcon.SQUARE_O;
		static readonly CLOSE = WIcon.TIMES;
		static readonly OK = WIcon.CHECK;
		static readonly CALENDAR = WIcon.CALENDAR;
		// common form tools
		static readonly AGGREGATE = WIcon.CHAIN;
		static readonly NEW = WIcon.PLUS_SQUARE_O;
		static readonly EDIT = WIcon.EDIT;
		static readonly OPEN = WIcon.EDIT;
		static readonly DELETE = WIcon.TRASH;
		static readonly DETAIL = WIcon.FILE_TEXT_O;
		static readonly SAVE = WIcon.CHECK;
		static readonly FIND = WIcon.SEARCH;
		static readonly FIND_DIFF = WIcon.SEARCH_MINUS;
		static readonly FIND_PLUS = WIcon.SEARCH_PLUS;
		static readonly FORCE = WIcon.CHECK_CIRCLE;
		static readonly FORCE_ALL = WIcon.CHECK_CIRCLE_O;
		static readonly SEARCH = WIcon.SEARCH;
		static readonly CANCEL = WIcon.UNDO;
		static readonly RESET = WIcon.TIMES_CIRCLE;
		static readonly PRINT = WIcon.PRINT;
		static readonly PREVIEW = WIcon.SEARCH_PLUS;
		static readonly EXPORT = WIcon.SHARE_SQUARE_O;
		static readonly IMPORT = WIcon.SIGN_IN;
		static readonly FILE = WIcon.FILE_O;
		static readonly HELP = WIcon.QUESTION_CIRCLE;
		static readonly VIEW = WIcon.FILE_TEXT_O;
		static readonly ENABLE = WIcon.THUMBS_O_UP;
		static readonly DISABLE = WIcon.THUMBS_O_DOWN;
		static readonly ADD = WIcon.PLUS;
		static readonly APPLY = WIcon.CHECK;
		static readonly REMOVE = WIcon.MINUS;
		static readonly REFRESH = WIcon.REFRESH;
		static readonly UNDO = WIcon.UNDO;
		static readonly SETTINGS = WIcon.COG;
		static readonly OPTIONS = WIcon.CHECK_SQUARE;
		static readonly PASSWORD = WIcon.UNDO;
		static readonly COPY = WIcon.COPY;
		static readonly CUT = WIcon.CUT;
		static readonly PASTE = WIcon.PASTE;
		static readonly FORWARD = WIcon.ANGLE_DOUBLE_RIGHT;
		static readonly BACKWARD = WIcon.ANGLE_DOUBLE_LEFT;
		static readonly NEXT = WIcon.FORWARD;
		static readonly PREVIOUS = WIcon.BACKWARD;
		static readonly CONFIRM = WIcon.CHECK;
		static readonly FILTER = WIcon.FILTER;
		static readonly SEND = WIcon.SEND;
		static readonly SEND_EMAIL = WIcon.ENVELOPE_O;
		static readonly WAIT = WIcon.COG;
		static readonly WORK = WIcon.COG;
		static readonly CONFIG = WIcon.COG;
		static readonly LEFT = WIcon.ARROW_CIRCLE_LEFT;
		static readonly RIGHT = WIcon.ARROW_CIRCLE_RIGHT;
		static readonly SELECT_ALL = WIcon.TH_LIST;
		static readonly REWORK = WIcon.REFRESH;
		static readonly PUSH = WIcon.TRUCK;
		static readonly AHEAD = WIcon.ANGLE_DOUBLE_RIGHT;
		static readonly SUSPEND = WIcon.TOGGLE_OFF;
		static readonly RESUME = WIcon.RECYCLE;
		static readonly PAIRING = WIcon.RANDOM;
		static readonly CHECK = WIcon.CHECK_SQUARE_O;
		// common entities
		static readonly EVENT = WIcon.BOLT;
		static readonly MESSAGE = WIcon.ENVELOPE_O;
		static readonly USER = WIcon.USER_O;
		static readonly GROUP = WIcon.USERS;
		static readonly TOOL = WIcon.WRENCH;
		static readonly DEMOGRAPHIC = WIcon.ADDRESS_CARD;
		static readonly DOCUMENT = WIcon.FILE_TEXT_O;
		static readonly LINKS = WIcon.CHAIN;
		// messages
		static readonly WARNING = WIcon.WARNING;
		static readonly INFO = WIcon.INFO_CIRCLE;
		static readonly CRITICAL = WIcon.TIMES_CIRCLE;
	}

}