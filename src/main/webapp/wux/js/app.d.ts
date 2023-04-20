declare namespace APP {
    class GUIAdminUte extends WUX.WComponent {
        protected fpFilter: WUX.WFormPanel;
        protected tabResult: WUX.WDXTable;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected container: WUX.WContainer;
        protected cntActions: AppTableActions;
        protected btnToggle: WUX.WButton;
        constructor(id?: string);
        render(): WUX.WContainer;
    }
}
declare namespace APP {
    const STATUS_STARTUP = 0;
    const STATUS_VIEW = 1;
    const STATUS_EDITING = 2;
    interface User {
        userName: string;
        tokenId: string;
        role?: string;
        lastName?: string;
        firstName?: string;
        email?: string;
        mobile?: string;
        structure?: number;
    }
    interface FHWFile {
        f: string;
        d?: Date;
        t?: string;
        s?: number;
    }
    function getUserLogged(): User;
    class ITabella {
        static ID: string;
        static DESCRIZIONE: string;
        static DESCRIZ_ALT: string;
        static ID_GRUPPO: string;
        static DES_GRUPPO: string;
        static DETTAGLIO: string;
        static ANAGRAFICHE: string;
        static ALLEGATO: string;
        static ATTIVO: string;
    }
    function scrollTo(c: WUX.WComponent | JQuery): void;
    function check(e: any, message?: string, focus?: boolean): boolean;
    function label(text: string, ...styles: (string | WUX.WStyle)[]): string;
}
declare var jrpc: JRPC;
declare namespace APP {
    export interface ChartData {
        series?: string;
        values?: string;
        arguments?: string;
        argType?: string;
        data?: any[];
    }
    type CharType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    export class Chart extends WUX.WComponent<CharType, ChartData> {
        title: string;
        subTitle: string;
        palette: any;
        source: any[];
        series: Array<DevExpress.viz.ChartSeries>;
        labels: boolean;
        xTitle: string;
        xRotate: number;
        yTitle: string;
        sTitle: string;
        pSymbol: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
        pSize: number;
        pVisible: boolean;
        constructor(id?: string, type?: CharType, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        protected updateState(nextState: ChartData): void;
        protected componentDidMount(): void;
        getInstance(copt?: DevExpress.viz.dxChartOptions): DevExpress.viz.dxChart;
    }
    export class PieChart extends WUX.WComponent<'donut' | 'doughnut' | 'pie', ChartData> {
        title: string;
        subTitle: string;
        palette: any;
        source: any[];
        series: Array<DevExpress.viz.PieChartSeries>;
        labels: boolean;
        constructor(id?: string, type?: 'donut' | 'doughnut' | 'pie', classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        protected updateState(nextState: ChartData): void;
        protected componentDidMount(): void;
        getInstance(copt?: DevExpress.viz.dxPieChartOptions): DevExpress.viz.dxPieChart;
    }
    export {};
}
declare namespace APP {
    class AppTableActions extends WUX.WComponent {
        left: WUX.WContainer;
        right: WUX.WContainer;
        noActions: boolean;
        constructor(id: string);
        componentDidMount(): void;
    }
    class APPPeriodi extends WUX.WComponent<number, any[]> {
        protected fp: WUX.WFormPanel;
        constructor(id: string, rows: number);
        clear(): this;
        setDefaults(): this;
        protected render(): WUX.WFormPanel;
        protected componentDidMount(): void;
        protected createLinks(i: number): void;
        getState(): any[];
        updateState(nextState: any[]): void;
        idxe(v: any, dr: Date): number;
    }
    class APPSelRuoloUte extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class APPSelComune extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
        componentDidMount(): void;
    }
    class APPArticle extends WUX.WComponent<string, string[]> {
        addSignature: boolean;
        constructor(id?: string, title?: string, text?: string);
        render(): string;
    }
    class APPBtnAttach extends WUX.WComponent<string, string> {
        private _icon;
        private _$u;
        readOnly: boolean;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        render(): JQuery;
        addItem(item: string, s: string): void;
        pop(): string;
    }
}
declare namespace APP {
    export interface OLMapCon {
        attribution?: boolean;
        zoom?: boolean;
    }
    export interface OLMapInt {
        doubleClickZoom?: boolean;
        dragAndDrop?: boolean;
        dragPan?: boolean;
        keyboardPan?: boolean;
        keyboardZoom?: boolean;
        mouseWheelZoom?: boolean;
        pointer?: boolean;
        select?: boolean;
    }
    export interface OLMapCfg {
        lon?: number;
        lat?: number;
        zoom?: number;
        controls?: OLMapCon;
        interactions?: OLMapInt;
    }
    export interface OLMapShare {
        view?: ol.View;
    }
    type OLMarkerColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray';
    export class OLMap extends WUX.WComponent<any, string> {
        _cfg: OLMapCfg;
        imgs: string;
        map: ol.Map;
        view: ol.View;
        controls: ol.Collection<ol.control.Control>;
        interactions: ol.Collection<ol.interaction.Interaction>;
        markers: any[][];
        mrkSrc: ol.source.Vector;
        mrkLay: ol.layer.Vector;
        mrkFea: ol.Feature[];
        polygons: any[][];
        polSrc: ol.source.Vector;
        polLay: ol.layer.Vector;
        polFea: ol.Feature[];
        $popup: JQuery;
        popup: ol.Overlay;
        popupn: string;
        pdx: number;
        pdy: number;
        share: OLMapShare;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        get cfg(): OLMapCfg;
        set cfg(c: OLMapCfg);
        clear(): void;
        clearMarkers(): void;
        clearPolygons(): void;
        addMarker(lon: number, lat: number, name?: string, color?: OLMarkerColor, onhover?: (e: any) => any, onclick?: (e: any) => any): void;
        addPolygon(type: string, coordinates: any[], name?: string, color?: string, onhover?: (e: any) => any, onclick?: (e: any) => any): void;
        addGeometry(json: string, name: string, color?: string, onhover?: (e: any) => any, onclick?: (e: any) => any): void;
        inflate(i: number, nc?: OLMarkerColor): void;
        deflate(i: number, nc?: OLMarkerColor): void;
        center(lon: number, lat: number, zoom: number): void;
        centerOn(o: any, zoom?: number): void;
        hidePopup(hard?: boolean): void;
        showPopup(e: any, p?: 'top' | 'bottom' | 'left' | 'right'): string;
        protected hexToRgba(hex: string, a: string): string;
        protected componentDidMount(): void;
        protected getMarker(f: ol.Feature | ol.render.Feature): any[];
        protected getPolygon(f: ol.Feature | ol.render.Feature): any[];
        protected _addMarker(lon: number, lat: number, name?: string, color?: OLMarkerColor): void;
        protected _addPolygon(type: string, coordinates: any[], name?: string, color?: string): void;
        protected fromLonLat(c: any[], d?: number): any[];
    }
    export {};
}
declare namespace APP {
    import WIcon = WUX.WIcon;
    class TXT {
        static readonly OK = "OK";
        static readonly CLOSE = "Chiudi";
        static readonly NEW = "Nuovo";
        static readonly OPEN = "Modifica";
        static readonly DELETE = "Elimina";
        static readonly SAVE = "Salva";
        static readonly SEND = "Invia";
        static readonly SEND_EMAIL = "Email";
        static readonly FIND = "Cerca";
        static readonly FORCE = "Forza";
        static readonly SEARCH = "Cerca";
        static readonly CANCEL = "Annulla";
        static readonly RESET = "Annulla";
        static readonly PRINT = "Stampa";
        static readonly PRINT_ALL = "Stampa Tutto";
        static readonly PREVIEW = "Anteprima";
        static readonly EXPORT = "Esporta";
        static readonly IMPORT = "Importa";
        static readonly HELP = "Guida";
        static readonly VIEW = "Vedi";
        static readonly ENABLE = "Abilita";
        static readonly DISABLE = "Disabilita";
        static readonly ADD = "Aggiungi";
        static readonly APPLY = "Applica";
        static readonly REMOVE = "Rimuovi";
        static readonly REMOVE_ALL = "Rim.Tutto";
        static readonly REFRESH = "Aggiorna";
        static readonly UNDO = "Annulla";
        static readonly SETTINGS = "Impostazioni";
        static readonly COPY = "Copia";
        static readonly CUT = "Taglia";
        static readonly PASTE = "Incolla";
        static readonly CONFIRM = "Conferma";
        static readonly FORWARD = "Avanti";
        static readonly BACKWARD = "Indietro";
        static readonly NEXT = "Prossimo";
        static readonly PREVIOUS = "Precedente";
        static readonly SELECT = "Seleziona";
        static readonly SELECT_ALL = "Sel.Tutto";
        static readonly WORK = "Lavora";
        static readonly AGGREGATE = "Aggrega";
        static readonly SET = "Imposta";
        static readonly DEFAULT = "Predefinito";
        static readonly REWORK = "Rielabora";
        static readonly PUSH = "Spedisci";
        static readonly SUSPEND = "Sospendi";
        static readonly RESUME = "Riattiva";
        static readonly CODE = "Codice";
        static readonly DESCRIPTION = "Descrizione";
        static readonly GROUP = "Gruppo";
        static readonly ROLE = "Ruolo";
        static readonly TYPE = "Tipo";
    }
    class MSG {
        static readonly CONF_DELETE = "Eliminare l'elemento selezionato?";
        static readonly CONF_DISABLE = "Disabilitare l'elemento selezionato?";
        static readonly CONF_ENABLE = "Abilitare l'elemento selezionato?";
        static readonly CONF_CANCEL = "Si vogliono annullare le modifiche apportate?";
        static readonly CONF_PROCEED = "Si vuole procedere con l'operazione?";
        static readonly CONF_OVERWRITE = "Si vuole procedere con la sovrascrittura?";
        static readonly MSG_COMPLETED = "Operazione completata con successo.";
        static readonly MSG_ERRORS = "Errore durante l'elaborazione.";
    }
    class ICO {
        static readonly TRUE = WIcon.CHECK_SQUARE_O;
        static readonly FALSE = WIcon.SQUARE_O;
        static readonly CLOSE = WIcon.TIMES;
        static readonly OK = WIcon.CHECK;
        static readonly CALENDAR = WIcon.CALENDAR;
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
        static readonly EVENT = WIcon.BOLT;
        static readonly MESSAGE = WIcon.ENVELOPE_O;
        static readonly USER = WIcon.USER_O;
        static readonly GROUP = WIcon.USERS;
        static readonly TOOL = WIcon.WRENCH;
        static readonly DEMOGRAPHIC = WIcon.ADDRESS_CARD;
        static readonly DOCUMENT = WIcon.FILE_TEXT_O;
        static readonly LINKS = WIcon.CHAIN;
        static readonly WARNING = WIcon.WARNING;
        static readonly INFO = WIcon.INFO_CIRCLE;
        static readonly CRITICAL = WIcon.TIMES_CIRCLE;
    }
}
declare namespace APP {
    class GUISample extends WUX.WComponent {
        protected fpMain: WUX.WFormPanel;
        protected btnSave: WUX.WButton;
        protected container: WUX.WContainer;
        protected jqv: JQueryValidation.Validator;
        protected _ma: string[];
        constructor(id?: string);
        render(): WUX.WContainer;
        componentDidMount(): void;
        initValidator(f: JQuery, r?: boolean): void;
    }
}
