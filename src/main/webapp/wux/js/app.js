var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    var GUIAdminUte = (function (_super) {
        __extends(GUIAdminUte, _super);
        function GUIAdminUte(id) {
            return _super.call(this, id ? id : '*', 'GUIAdminUte') || this;
        }
        GUIAdminUte.prototype.render = function () {
            var _this = this;
            this.fpFilter = new WUX.WFormPanel('fpFilter');
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idRuolo', 'Ruolo', new APP.APPSelRuoloUte());
            this.fpFilter.addTextField('email', 'Email');
            this.fpFilter.addTextField('telefono', 'Telefono');
            this.btnFind = new WUX.WButton(this.subId('bf'), APP.TXT.FIND, '', WUX.BTN.SM_PRIMARY, 'width: 160px');
            this.btnFind.on('click', function (e) {
                if (_this.fpFilter.isBlank()) {
                    WUX.showWarning('Specificare almeno un criterio di ricerca.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare almeno uno dei seguenti campi: ' + check);
                    return;
                }
                jrpc.execute('UTENTI.find', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                    if (result && result.length) {
                        WUX.showSuccess(result.length + ' record trovati');
                    }
                    else {
                        WUX.showWarning('Nessun record trovato');
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), APP.TXT.RESET, '', WUX.BTN.SM_SECONDARY, 'width: 160px');
            this.btnReset.on('click', function (e) {
                _this.fpFilter.clear();
                _this.tabResult.setState([]);
                _this.fpFilter.focus();
            });
            this.btnToggle = new WUX.WButton(this.subId('bt'), APP.TXT.ENABLE, WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnToggle.on('click', function (e) {
                _this.btnToggle.blur();
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da abilitare / disabilitare');
                    return;
                }
                var i = WUtil.getString(rd[0], 'id');
                var s = WUtil.getBoolean(rd[0], 'attivo');
                var n = !s;
                if (!i)
                    return;
                jrpc.execute('UTENTI.setEnabled', [i, n], function (result) {
                    if (!result) {
                        WUX.showWarning('Utente non aggiornato.');
                        return;
                    }
                    if (n) {
                        _this.btnToggle.setText(APP.TXT.DISABLE, WUX.WIcon.THUMBS_O_DOWN);
                    }
                    else {
                        _this.btnToggle.setText(APP.TXT.ENABLE, WUX.WIcon.THUMBS_O_UP);
                    }
                    var sr = _this.tabResult.getSelectedRows();
                    if (sr && sr.length) {
                        var r = _this.tabResult.getState();
                        var x_1 = sr[0];
                        r[x_1]['attivo'] = n;
                        _this.tabResult.refresh();
                        setTimeout(function () { _this.tabResult.select([x_1]); }, 100);
                    }
                });
            });
            this.cntActions = new APP.AppTableActions('ta');
            this.cntActions.left.add(this.btnToggle);
            var rc = [
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
            this.tabResult.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var v = WUtil.getBoolean(e.data, 'verificato');
                var a = WUtil.getBoolean(e.data, 'attivo');
                if (!a) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
                else if (!v) {
                    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                }
            });
            this.tabResult.onSelectionChanged(function (e) {
                var f = WUtil.getFirst(_this.tabResult.getSelectedRowsData(), 0);
                if (!f)
                    return;
                var a = WUtil.getBoolean(f, 'attivo');
                if (a) {
                    _this.btnToggle.setText(APP.TXT.DISABLE, WUX.WIcon.THUMBS_O_DOWN);
                }
                else {
                    _this.btnToggle.setText(APP.TXT.ENABLE, WUX.WIcon.THUMBS_O_UP);
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
        };
        return GUIAdminUte;
    }(WUX.WComponent));
    APP.GUIAdminUte = GUIAdminUte;
})(APP || (APP = {}));
var APP;
(function (APP) {
    APP.STATUS_STARTUP = 0;
    APP.STATUS_VIEW = 1;
    APP.STATUS_EDITING = 2;
    function getUserLogged() {
        var userLogged = window ? window['_userLogged'] : undefined;
        if (userLogged && typeof userLogged == 'object')
            return userLogged;
        return { userName: 'public', tokenId: 'public' };
    }
    APP.getUserLogged = getUserLogged;
    var ITabella = (function () {
        function ITabella() {
        }
        ITabella.ID = 'id';
        ITabella.DESCRIZIONE = 'des';
        ITabella.DESCRIZ_ALT = 'alt';
        ITabella.ID_GRUPPO = 'idg';
        ITabella.DES_GRUPPO = 'deg';
        ITabella.DETTAGLIO = 'det';
        ITabella.ANAGRAFICHE = 'ana';
        ITabella.ALLEGATO = 'all';
        ITabella.ATTIVO = 'att';
        return ITabella;
    }());
    APP.ITabella = ITabella;
    function scrollTo(c) {
        if (!c)
            return;
        var r = (c instanceof WUX.WComponent) ? c.getRoot() : c;
        if (!r || !r.length)
            return;
        $(window).scrollTop(r.offset().top - 300);
    }
    APP.scrollTo = scrollTo;
    function check(e, message, focus) {
        var id = WUX.getId(e);
        if (!id)
            return true;
        var c = (e instanceof WUX.WComponent) ? e : WUX.getComponent(e);
        var r = c ? c.getRoot() : $('#' + id);
        if (!r || !r.length)
            return true;
        var s = c ? c.getState() : (r.attr('type') == 'checkbox' ? r.prop('checked') : r.val());
        var l = $('#' + id + '-error');
        if (s) {
            if (l.length)
                l.remove();
            return true;
        }
        if (!message)
            message = 'Campo obbligatorio.';
        if (message == '-')
            return false;
        if (l.length) {
            l.html(message);
            l.show();
            if (focus) {
                if (c) {
                    c.focus();
                }
                else {
                    r.focus();
                }
            }
            return false;
        }
        r.parent().append('<label id="' + id + '-error" class="error active" for="' + id + '">' + message + '</label>');
        if (focus) {
            if (c) {
                c.focus();
            }
            else {
                r.focus();
            }
        }
        return false;
    }
    APP.check = check;
    function label(text) {
        var styles = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            styles[_i - 1] = arguments[_i];
        }
        if (!text)
            text = '';
        var la = '';
        var lc = WUX.cls.apply(WUX, styles);
        var ls = WUX.css.apply(WUX, styles);
        if (lc)
            la += ' class="' + lc + '"';
        if (ls)
            la += ' style="' + ls + '"';
        return '<label' + la + '>' + text + '</label>';
    }
    APP.label = label;
})(APP || (APP = {}));
var jrpc = new JRPC("/webapp-bs-it/rpc");
jrpc.setToken(APP.getUserLogged().tokenId);
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    var Chart = (function (_super) {
        __extends(Chart, _super);
        function Chart(id, type, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'Chart', type, classStyle, style, attributes) || this;
            _this.labels = false;
            _this.forceOnChange = true;
            return _this;
        }
        Chart.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this.source = [];
            this.series = [];
            if (!this.state)
                return;
            var d = this.state.data;
            if (!d || !d.length)
                return;
            var s = this.state.series;
            var v = this.state.values;
            if (!v)
                return;
            var a = this.state.arguments;
            if (!a)
                return;
            var t = this.state.argType;
            var noS = !s || s == a;
            if (noS) {
                this.series.push({
                    "valueField": "s0", "name": this.sTitle ? this.sTitle : s
                });
            }
            var arrayS = [];
            var arrayA = [];
            for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                var dr = d_1[_i];
                if (!noS) {
                    var serVal = dr[s];
                    if (serVal && arrayS.indexOf(serVal) < 0) {
                        var idx = arrayS.length;
                        arrayS.push(serVal);
                        this.series.push({
                            "valueField": "s" + idx, "name": serVal
                        });
                    }
                }
                var argVal = dr[a];
                if (argVal && arrayA.indexOf(argVal) < 0) {
                    arrayA.push(argVal);
                }
            }
            for (var _a = 0, arrayA_1 = arrayA; _a < arrayA_1.length; _a++) {
                var ai = arrayA_1[_a];
                var sr = {};
                if (t == 'd') {
                    var d_3 = WUtil.toDate(ai);
                    sr["a"] = d_3 ? WUX.formatDate(d_3) : ai;
                }
                else {
                    sr["a"] = ai;
                }
                for (var _b = 0, d_2 = d; _b < d_2.length; _b++) {
                    var dr = d_2[_b];
                    var argVal = dr[a];
                    if (argVal != ai)
                        continue;
                    var value = dr[v];
                    if (!value)
                        value = 0;
                    if (noS) {
                        sr["s0"] = value;
                    }
                    else {
                        var serVal = dr[s];
                        var idx = arrayS.indexOf(serVal);
                        if (idx < 0)
                            continue;
                        sr["s" + idx] = value;
                    }
                }
                this.source.push(sr);
            }
        };
        Chart.prototype.componentDidMount = function () {
            if (this._tooltip) {
                this.root.attr('title', this._tooltip);
            }
            if (!this.title)
                this.title = '';
            if (!this.source)
                this.source = [];
            if (!this.series)
                this.series = [];
            if (!this.props)
                this.props = 'bar';
            var opt = {
                dataSource: this.source,
                commonSeriesSettings: {
                    argumentField: 'a',
                    type: this.props,
                    label: {
                        visible: this.labels,
                    },
                    point: {
                        symbol: this.pSymbol,
                        size: this.pSize,
                        visible: this.pVisible
                    }
                },
                series: this.series,
                title: this.title,
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center',
                },
                export: {
                    enabled: true,
                },
                tooltip: {
                    enabled: true,
                }
            };
            if (this.palette) {
                opt.palette = this.palette;
            }
            if (this.xRotate) {
                opt.argumentAxis = {
                    label: {
                        displayMode: "rotate",
                        rotationAngle: this.xRotate
                    }
                };
            }
            if (this.subTitle) {
                opt.title = {
                    text: this.title,
                    subtitle: {
                        text: this.subTitle
                    }
                };
            }
            if (this.xTitle) {
                opt.argumentAxis = {
                    title: {
                        text: this.xTitle
                    }
                };
            }
            if (this.yTitle) {
                opt.valueAxis = {
                    title: {
                        text: this.yTitle
                    }
                };
            }
            $('#' + this.id).dxChart(opt);
        };
        Chart.prototype.getInstance = function (copt) {
            if (!this.mounted)
                return null;
            if (copt)
                this.root.dxChart(copt);
            return this.root.dxChart('instance');
        };
        return Chart;
    }(WUX.WComponent));
    APP.Chart = Chart;
    var PieChart = (function (_super) {
        __extends(PieChart, _super);
        function PieChart(id, type, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'PieChart', type, classStyle, style, attributes) || this;
            _this.labels = false;
            _this.forceOnChange = true;
            return _this;
        }
        PieChart.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this.source = [];
            this.series = [];
            if (!this.state)
                return;
            var d = this.state.data;
            if (!d || !d.length)
                return;
            var v = this.state.values;
            if (!v)
                return;
            var a = this.state.arguments;
            if (!a)
                this.state.series;
            if (!a)
                return;
            var arrayA = [];
            var mapAV = {};
            var tot = 0;
            for (var _i = 0, d_4 = d; _i < d_4.length; _i++) {
                var r = d_4[_i];
                var val = WUtil.getNumber(r, v);
                tot += val;
                var arg = WUtil.getString(r, a);
                if (!arg)
                    continue;
                if (arrayA.indexOf(arg) < 0) {
                    arrayA.push(arg);
                }
                var pv = WUtil.getNumber(mapAV, arg);
                mapAV[arg] = pv + val;
            }
            for (var _a = 0, arrayA_2 = arrayA; _a < arrayA_2.length; _a++) {
                var arg = arrayA_2[_a];
                var val = WUtil.getNumber(mapAV, arg);
                var prc = tot ? val * 100 / tot : 0;
                this.source.push({ "a": arg, "v": WUtil.round2(prc) });
            }
            this.series.push({
                argumentField: "a",
                valueField: "v",
                label: {
                    visible: this.labels,
                    connector: {
                        visible: this.labels,
                        width: 1
                    }
                }
            });
        };
        PieChart.prototype.componentDidMount = function () {
            if (this._tooltip) {
                this.root.attr('title', this._tooltip);
            }
            if (!this.title)
                this.title = '';
            if (!this.source)
                this.source = [];
            if (!this.series)
                this.series = [];
            if (!this.props)
                this.props = 'pie';
            var opt = {
                dataSource: this.source,
                series: this.series,
                title: this.title,
                legend: {
                    verticalAlignment: 'bottom',
                    horizontalAlignment: 'center',
                },
                export: {
                    enabled: true,
                },
                tooltip: {
                    enabled: true,
                }
            };
            if (this.palette) {
                opt.palette = this.palette;
            }
            if (this.subTitle) {
                opt.title = {
                    text: this.title,
                    subtitle: {
                        text: this.subTitle
                    }
                };
            }
            $('#' + this.id).dxPieChart(opt);
        };
        PieChart.prototype.getInstance = function (copt) {
            if (!this.mounted)
                return null;
            if (copt)
                this.root.dxPieChart(copt);
            return this.root.dxPieChart('instance');
        };
        return PieChart;
    }(WUX.WComponent));
    APP.PieChart = PieChart;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    var AppTableActions = (function (_super) {
        __extends(AppTableActions, _super);
        function AppTableActions(id) {
            var _this = _super.call(this, id, 'AppTableActions', null, 'table-actions-wrapper') || this;
            _this.left = new WUX.WContainer(_this.subId('l'), 'left-actions');
            _this.right = new WUX.WContainer(_this.subId('r'), 'right-actions');
            return _this;
        }
        AppTableActions.prototype.componentDidMount = function () {
            var $i = $('<div class="table-actions clearfix"></div>');
            this.root.append($i);
            if (this.noActions)
                return;
            this.left.mount($i);
            this.right.mount($i);
        };
        return AppTableActions;
    }(WUX.WComponent));
    APP.AppTableActions = AppTableActions;
    var APPPeriodi = (function (_super) {
        __extends(APPPeriodi, _super);
        function APPPeriodi(id, rows) {
            return _super.call(this, id, 'APPPeriodi', rows) || this;
        }
        APPPeriodi.prototype.clear = function () {
            this.setState(null);
            return this;
        };
        APPPeriodi.prototype.setDefaults = function () {
            this.fp.clear();
            this.fp.setValue('d0', WUtil.getCurrDate());
            this.fp.setValue('a0', WUtil.getCurrDate(0, 0, 1, false, true));
            return this;
        };
        APPPeriodi.prototype.render = function () {
            if (!this.props)
                this.props = 1;
            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.nextOnEnter = true;
            for (var i = 0; i < this.props; i++) {
                this.fp.addRow();
                this.fp.addDateField('d' + i, 'Dal &nbsp;' + WUX.buildIcon(WUX.WIcon.TRASH, '', '', 0, 'active-cell'));
                this.fp.addDateField('a' + i, 'Al');
                this.fp.addDateField('e' + i, 'Escluso dal &nbsp;' + WUX.buildIcon(WUX.WIcon.TRASH, '', '', 0, 'active-cell'));
                this.fp.addDateField('f' + i, 'fino al');
                this.fp.setTooltip('d' + i, 'Dalla data');
                this.fp.setTooltip('e' + i, 'Escluso dal');
            }
            return this.fp;
        };
        APPPeriodi.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            if (!this.props)
                this.props = 1;
            for (var i = 0; i < this.props; i++) {
                this.createLinks(i);
            }
        };
        APPPeriodi.prototype.createLinks = function (i) {
            var _this = this;
            var fd = this.fp.getField('d' + i);
            if (fd) {
                var ld = $('label[for="' + fd.id + '"]');
                if (ld.length) {
                    ld.css('cursor', 'pointer');
                    ld.on('click', function (e) {
                        _this.fp.setValue('d' + i, null);
                        _this.fp.setValue('a' + i, null);
                    });
                }
            }
            var fe = this.fp.getField('e' + i);
            if (fe) {
                var le = $('label[for="' + fe.id + '"]');
                if (le.length) {
                    le.css('cursor', 'pointer');
                    le.on('click', function (e) {
                        _this.fp.setValue('e' + i, null);
                        _this.fp.setValue('f' + i, null);
                    });
                }
            }
        };
        APPPeriodi.prototype.getState = function () {
            this.state = [];
            if (!this.props)
                return this.state;
            var r = 0;
            var v = this.fp.getState();
            for (var i = 0; i < this.props; i++) {
                var di = WUtil.getDate(v, 'd' + i);
                var ai = WUtil.getDate(v, 'a' + i);
                var ei = WUtil.getDate(v, 'e' + i);
                var fi = WUtil.getDate(v, 'f' + i);
                if (di && ai) {
                    r++;
                    var p1 = {};
                    p1["id"] = WUtil.toNumber(di) + '_' + WUtil.toNumber(ai);
                    p1["data_inizio"] = di;
                    p1["data_fine"] = ai;
                    p1["esc_periodo"] = false;
                    p1["riga"] = r;
                    this.state.push(p1);
                }
                if (ei && fi) {
                    r++;
                    var p2 = {};
                    p2["id"] = WUtil.toNumber(ei) + '_' + WUtil.toNumber(fi);
                    p2["data_inizio"] = ei;
                    p2["data_fine"] = fi;
                    p2["esc_periodo"] = true;
                    p2["riga"] = r;
                    this.state.push(p2);
                }
            }
            return this.state;
        };
        APPPeriodi.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this.fp.clear();
            if (WUtil.isEmpty(this.state)) {
                return;
            }
            var v = {};
            var x = -1;
            for (var i = 0; i < this.state.length; i++) {
                var p = this.state[i];
                if (!p)
                    continue;
                var di = WUtil.getDate(p, 'data_inizio');
                var df = WUtil.getDate(p, 'data_fine');
                var e = WUtil.getBoolean(p, 'esc_periodo');
                if (!e) {
                    if (di && df) {
                        x++;
                        v["d" + x] = di;
                        v["a" + x] = df;
                    }
                }
            }
            for (var i = 0; i < this.state.length; i++) {
                var p = this.state[i];
                if (!p)
                    continue;
                var di = WUtil.getDate(p, 'data_inizio');
                var df = WUtil.getDate(p, 'data_fine');
                var e = WUtil.getBoolean(p, 'esc_periodo');
                if (e) {
                    if (di && df) {
                        x = this.idxe(v, di);
                        v["e" + x] = di;
                        v["f" + x] = df;
                    }
                }
            }
            this.fp.setState(v);
        };
        APPPeriodi.prototype.idxe = function (v, dr) {
            var d = WUtil.toNumber(dr);
            var x = -1;
            for (var i = 0; i < this.props; i++) {
                var d0 = WUtil.toNumber(v["e" + i]);
                var d1 = WUtil.toNumber(v["f" + i]);
                if (d >= d0 && d <= d1) {
                    x = i;
                    break;
                }
            }
            if (x < 0)
                x = 0;
            for (var i = x; i < this.props; i++) {
                if (!v["e" + i])
                    return i;
            }
            return 0;
        };
        return APPPeriodi;
    }(WUX.WComponent));
    APP.APPPeriodi = APPPeriodi;
    var APPSelRuoloUte = (function (_super) {
        __extends(APPSelRuoloUte, _super);
        function APPSelRuoloUte(id, multiple) {
            var _this = _super.call(this, id, [], multiple) || this;
            _this.name = 'APPSelRuoloUte';
            _this.options = [
                { id: '', text: '' },
                { id: 'admin', text: 'Amministratore' },
                { id: 'user', text: 'Ruolo Base' }
            ];
            return _this;
        }
        return APPSelRuoloUte;
    }(WUX.WSelect2));
    APP.APPSelRuoloUte = APPSelRuoloUte;
    var APPSelComune = (function (_super) {
        __extends(APPSelComune, _super);
        function APPSelComune(id, multiple) {
            var _this = _super.call(this, id, [], multiple) || this;
            _this.name = 'APPSelComune';
            return _this;
        }
        APPSelComune.prototype.componentDidMount = function () {
            var options = {
                ajax: {
                    dataType: "json",
                    delay: 400,
                    processResults: function (result, params) {
                        return {
                            results: result
                        };
                    },
                    transport: function (params, success, failure) {
                        jrpc.execute("COMUNI.lookup", [params.data], success);
                        return undefined;
                    }
                },
                placeholder: "",
                allowClear: true,
                minimumInputLength: 3
            };
            this.init(options);
        };
        return APPSelComune;
    }(WUX.WSelect2));
    APP.APPSelComune = APPSelComune;
    var APPArticle = (function (_super) {
        __extends(APPArticle, _super);
        function APPArticle(id, title, text) {
            var _this = _super.call(this, id ? id : '*', 'APPArticle', title, 'page type-page status-publish hentry') || this;
            _this.rootTag = 'article';
            if (text) {
                _this.state = [];
                _this.state.push(text);
            }
            return _this;
        }
        APPArticle.prototype.render = function () {
            var r = '<header class="header">';
            if (this.props) {
                r += '<h1 class="entry-title">' + this.props + '</h1>';
            }
            r += '<section class="entry-content"><div class="textwidget">';
            if (this.state) {
                for (var _i = 0, _a = this.state; _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (!t) {
                        r += '<p>&nbsp;</p>';
                    }
                    else {
                        r += '<p>' + t + '</p>';
                    }
                }
            }
            if (this.addSignature) {
                r += '<p>Have fun,</p>';
                r += '<p>&nbsp;</p>';
                r += '<p><em>Staff</em></p>';
            }
            r += '</div></section>';
            return this.buildRoot(this.rootTag, r);
        };
        return APPArticle;
    }(WUX.WComponent));
    APP.APPArticle = APPArticle;
    var APPBtnAttach = (function (_super) {
        __extends(APPBtnAttach, _super);
        function APPBtnAttach(id, text, icon, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'APPBtnAttach', text, classStyle, style, attributes) || this;
            _this._icon = icon;
            return _this;
        }
        APPBtnAttach.prototype.render = function () {
            var i = WUX.buildIcon(this._icon);
            if (i)
                i += ' ';
            if (!this._classStyle) {
                this._classStyle = "btn btn-primary dropdown-toggle";
            }
            else if (this._classStyle.indexOf('dropdown-toggle') < 0) {
                this._classStyle += ' dropdown-toggle';
            }
            var $r = $(WUX.build('div', '', this._style, this._attributes, this.id, 'btn-group'));
            $r.append(WUX.build('button', i + this.props + ' &nbsp;<i class="fa fa-caret-down"></i>', '', 'data-toggle="dropdown" aria-expanded="false"', '', this._classStyle));
            this._$u = $('<ul class="dropdown-menu"></ul>');
            $r.append(this._$u);
            if (!this.readOnly) {
                this.addItem('<i class="fa fa-upload"></i> &nbsp;Importa', 'i');
                this.addItem('<i class="fa fa-eraser"></i> &nbsp;Rimuovi', 'r');
            }
            this.addItem('<i class="fa fa-eye"></i> &nbsp;Vedi', 'v');
            return $r;
        };
        APPBtnAttach.prototype.addItem = function (item, s) {
            var _this = this;
            if (!this._$u)
                return;
            var $li = $('<li></li>');
            this._$u.append($li);
            var $a = $('<a>' + item + '</a>');
            $li.append($a);
            $a.click(function () {
                _this.setState(s);
            });
        };
        APPBtnAttach.prototype.pop = function () {
            var r = this.state;
            this.state = null;
            return r;
        };
        return APPBtnAttach;
    }(WUX.WComponent));
    APP.APPBtnAttach = APPBtnAttach;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var WUtil = WUX.WUtil;
    var OLMap = (function (_super) {
        __extends(OLMap, _super);
        function OLMap(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'OLMap', null, classStyle, style ? style : 'width:100%;height:600px', attributes) || this;
            _this.imgs = '/foodhub/img/';
            _this.pdx = 0;
            _this.pdy = 0;
            _this._cfg = {};
            _this.markers = [];
            _this.mrkFea = [];
            _this.polygons = [];
            _this.polFea = [];
            return _this;
        }
        Object.defineProperty(OLMap.prototype, "cfg", {
            get: function () {
                return this._cfg;
            },
            set: function (c) {
                this._cfg = c;
            },
            enumerable: false,
            configurable: true
        });
        OLMap.prototype.clear = function () {
            this.clearMarkers();
            this.clearPolygons();
        };
        OLMap.prototype.clearMarkers = function () {
            this.markers = [];
            this.mrkFea = [];
            if (this.mounted && this.mrkLay) {
                this.map.removeLayer(this.mrkLay);
                this.mrkSrc = null;
                this.mrkLay = null;
                this.hidePopup();
            }
        };
        OLMap.prototype.clearPolygons = function () {
            this.polygons = [];
            this.polFea = [];
            if (this.mounted && this.polLay) {
                this.map.removeLayer(this.polLay);
                this.polSrc = null;
                this.polLay = null;
                this.hidePopup();
            }
        };
        OLMap.prototype.addMarker = function (lon, lat, name, color, onhover, onclick) {
            this.markers.push([lon, lat, name, color, onhover, onclick]);
            if (this.mounted) {
                this.hidePopup(false);
                this._addMarker(lon, lat, name, color);
            }
        };
        OLMap.prototype.addPolygon = function (type, coordinates, name, color, onhover, onclick) {
            this.polygons.push([type, coordinates, name, color, onhover, onclick]);
            if (this.mounted) {
                this.hidePopup(false);
                this._addPolygon(type, coordinates, name, color);
            }
        };
        OLMap.prototype.addGeometry = function (json, name, color, onhover, onclick) {
            if (!json)
                return;
            try {
                var g = JSON.parse(json);
                if (!g)
                    return;
                var t = WUtil.getString(g, "type");
                if (!t)
                    return;
                var c = WUtil.getArray(g, "coordinates");
                if (!c || !c.length)
                    return;
                if (t == 'Point') {
                    this.addMarker(c[0], c[1], name, color, onhover, onclick);
                }
                else {
                    this.addPolygon(t, c, name, color, onhover, onclick);
                }
            }
            catch (err) {
                console.error(err + ' in addGeometry ' + json);
            }
        };
        OLMap.prototype.inflate = function (i, nc) {
            if (i < 0 && i >= this.mrkFea.length)
                return;
            var mi = this.markers[i];
            var mf = this.mrkFea[i];
            if (!mi || !mf)
                return;
            var c = mi[3];
            if (nc)
                c = nc;
            if (!c)
                c = 'blue';
            mf.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: this.imgs + 'marker-' + c + '.png',
                    scale: 1,
                })
            }));
        };
        OLMap.prototype.deflate = function (i, nc) {
            if (i < 0 && i >= this.mrkFea.length)
                return;
            var mi = this.markers[i];
            var mf = this.mrkFea[i];
            if (!mi || !mf)
                return;
            var c = mi[3];
            if (nc)
                c = nc;
            if (!c)
                c = 'blue';
            mf.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: this.imgs + 'marker-' + c + '.png',
                    scale: 0.6,
                })
            }));
        };
        OLMap.prototype.center = function (lon, lat, zoom) {
            this.hidePopup(true);
            if (!lon && !lat)
                return;
            if (this.view) {
                this.view.setCenter(ol.proj.fromLonLat([lon, lat]));
                this.view.setZoom(zoom);
            }
            else {
                this._cfg.lon = lon;
                this._cfg.lat = lat;
                this._cfg.zoom = zoom;
            }
        };
        OLMap.prototype.centerOn = function (o, zoom) {
            if (zoom === void 0) { zoom = 16; }
            var lon = 0;
            var lat = 0;
            if (typeof o == 'number') {
                if (!this.markers)
                    return;
                if (o < 0 || o >= this.markers.length)
                    return;
                var m = this.markers[o];
                lon = m[0];
                lat = m[1];
            }
            else {
                lon = WUtil.getNumber(o, "lon");
                lat = WUtil.getNumber(o, "lat");
            }
            if (!lon && !lat)
                return;
            this.center(lon, lat, zoom);
        };
        OLMap.prototype.hidePopup = function (hard) {
            this.$popup.popover('hide');
            this.popupn = '';
            if (hard) {
                this.map.removeOverlay(this.popup);
                this.$popup.remove();
                var s = '';
                if (this.pdx)
                    s += 'margin-left:' + this.pdx + 'px;';
                if (this.pdy)
                    s += 'margin-top:' + this.pdy + 'px;';
                if (s)
                    s = ' style="' + s + '"';
                this.$popup = $('<div id="' + this.subId('man-popup') + '"' + s + '></div>').appendTo('body');
                this.popup = new ol.Overlay({
                    element: this.$popup.get(0),
                    positioning: 'bottom-center',
                    stopEvent: false,
                });
                this.map.addOverlay(this.popup);
            }
        };
        OLMap.prototype.showPopup = function (e, p) {
            if (p === void 0) { p = 'top'; }
            var n = '';
            var f = e ? this.map.forEachFeatureAtPixel(e.pixel, function (f) { return f; }) : null;
            if (f) {
                n = f.get('name');
                if (n == this.popupn)
                    return n;
            }
            if (this.popupn)
                this.hidePopup(true);
            this.popupn = n;
            if (n) {
                this.popup.setPosition(e.coordinate);
                this.$popup.popover({
                    placement: p,
                    html: true,
                    content: n,
                });
                this.$popup.popover('show');
            }
            return n;
        };
        OLMap.prototype.hexToRgba = function (hex, a) {
            var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!res)
                return '';
            var r = parseInt(res[1], 16);
            var g = parseInt(res[2], 16);
            var b = parseInt(res[3], 16);
            if (!a)
                a = '1.0';
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        };
        OLMap.prototype.componentDidMount = function () {
            var _this = this;
            if (!this._cfg.lon)
                this._cfg.lon = 12.4846;
            if (!this._cfg.lat)
                this._cfg.lat = 41.8977;
            if (!this._cfg.zoom)
                this._cfg.zoom = 9;
            if (this.share) {
                if (this.share.view) {
                    this.view = this.share.view;
                }
                else {
                    this.view = new ol.View({
                        center: ol.proj.fromLonLat([this._cfg.lon, this._cfg.lat]),
                        zoom: this._cfg.zoom
                    });
                    this.share.view = this.view;
                }
            }
            else {
                this.view = new ol.View({
                    center: ol.proj.fromLonLat([this._cfg.lon, this._cfg.lat]),
                    zoom: this._cfg.zoom
                });
            }
            if (this._cfg.controls) {
                this.controls = ol.control.defaults.defaults(this._cfg.controls);
            }
            if (this._cfg.interactions) {
                this.interactions = ol.interaction.defaults.defaults(this._cfg.interactions);
            }
            this.map = new ol.Map({
                target: this.id,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: this.view,
                controls: this.controls,
                interactions: this.interactions
            });
            this.$popup = $('#' + this.subId('man-popup'));
            if (!this.$popup.length) {
                var s = '';
                if (this.pdx)
                    s += 'margin-left:' + this.pdx + 'px;';
                if (this.pdy)
                    s += 'margin-top:' + this.pdy + 'px;';
                if (s)
                    s = ' style="' + s + '"';
                this.$popup = $('<div id="' + this.subId('man-popup') + '"' + s + '></div>').appendTo('body');
            }
            this.popup = new ol.Overlay({
                element: this.$popup.get(0),
                positioning: 'bottom-center',
                stopEvent: false,
            });
            this.map.addOverlay(this.popup);
            this.map.on('click', function (e) {
                _this.hidePopup(true);
                var f = _this.map.forEachFeatureAtPixel(e.pixel, function (f) { return f; });
                var m = _this.getMarker(f);
                if (m) {
                    var h = m[5];
                    if (h) {
                        e["lon"] = m[0];
                        e["lat"] = m[1];
                        e["name"] = m[2];
                        h(e);
                    }
                }
                var p = _this.getPolygon(f);
                if (p) {
                    var h = p[5];
                    if (h)
                        h(e);
                }
            });
            this.map.on('pointermove', function (e) {
                var x = document.getElementById(_this.map.getTarget());
                var f = _this.map.forEachFeatureAtPixel(e.pixel, function (f) { return f; });
                var m = _this.getMarker(f);
                var c = false;
                if (m) {
                    var h = m[4];
                    if (m[5])
                        c = true;
                    if (h) {
                        e["lon"] = m[0];
                        e["lat"] = m[1];
                        e["name"] = m[2];
                        h(e);
                    }
                }
                var p = _this.getPolygon(f);
                if (p) {
                    var h = p[4];
                    if (p[5])
                        c = true;
                    if (h)
                        h(e);
                }
                x.style.cursor = c ? 'pointer' : '';
            });
            if (this.markers) {
                for (var _i = 0, _a = this.markers; _i < _a.length; _i++) {
                    var m = _a[_i];
                    this._addMarker(m[0], m[1], m[2], m[3]);
                }
            }
            if (this.polygons) {
                for (var _b = 0, _c = this.polygons; _b < _c.length; _b++) {
                    var p = _c[_b];
                    this._addPolygon(p[0], p[1], p[2], p[3]);
                }
            }
        };
        OLMap.prototype.getMarker = function (f) {
            if (f && this.markers) {
                var name_1 = f.get('name');
                var idx = WUtil.indexOf(this.markers, 2, name_1);
                if (idx >= 0)
                    return this.markers[idx];
            }
            return null;
        };
        OLMap.prototype.getPolygon = function (f) {
            if (f && this.polygons) {
                var name_2 = f.get('name');
                var idx = WUtil.indexOf(this.polygons, 2, name_2);
                if (idx >= 0)
                    return this.polygons[idx];
            }
            return null;
        };
        OLMap.prototype._addMarker = function (lon, lat, name, color) {
            var mf = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
                name: name,
            });
            if (!color)
                color = 'blue';
            mf.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: this.imgs + 'marker-' + color + '.png',
                    scale: 0.6,
                })
            }));
            this.mrkFea.push(mf);
            if (this.mrkSrc && this.mrkLay) {
                this.mrkSrc.addFeature(mf);
            }
            else {
                this.mrkSrc = new ol.source.Vector({
                    features: this.mrkFea
                });
                this.mrkLay = new ol.layer.Vector({
                    source: this.mrkSrc
                });
                this.map.addLayer(this.mrkLay);
            }
        };
        OLMap.prototype._addPolygon = function (type, coordinates, name, color) {
            if (!type)
                type = 'MultiPolygon';
            if (!color)
                color = '#ff0000';
            var pf;
            if (type == 'Polygon') {
                if (WUtil.starts(color, '#')) {
                    color = this.hexToRgba(color, '0.4');
                }
                coordinates = this.fromLonLat(coordinates, 3);
                pf = new ol.Feature({
                    geometry: new ol.geom.Polygon(coordinates),
                    name: name,
                });
                pf.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1,
                    }),
                    fill: new ol.style.Fill({
                        color: color,
                    })
                }));
            }
            else if (type == 'LineString') {
                coordinates = this.fromLonLat(coordinates, 2);
                pf = new ol.Feature({
                    geometry: new ol.geom.LineString(coordinates),
                    name: name,
                });
                pf.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 3,
                    })
                }));
            }
            else if (type == 'MultiLineString') {
                coordinates = this.fromLonLat(coordinates, 3);
                pf = new ol.Feature({
                    geometry: new ol.geom.MultiLineString(coordinates),
                    name: name,
                });
                pf.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 3,
                    })
                }));
            }
            else {
                if (WUtil.starts(color, '#')) {
                    color = this.hexToRgba(color, '0.4');
                }
                coordinates = this.fromLonLat(coordinates, 4);
                pf = new ol.Feature({
                    geometry: new ol.geom.MultiPolygon(coordinates),
                    name: name,
                });
                pf.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1,
                    }),
                    fill: new ol.style.Fill({
                        color: color,
                    })
                }));
            }
            this.polFea.push(pf);
            if (this.polSrc && this.polLay) {
                this.polSrc.addFeature(pf);
            }
            else {
                this.polSrc = new ol.source.Vector({
                    features: this.polFea
                });
                this.polLay = new ol.layer.Vector({
                    source: this.polSrc
                });
                this.map.addLayer(this.polLay);
            }
        };
        OLMap.prototype.fromLonLat = function (c, d) {
            if (d === void 0) { d = 1; }
            if (d == 1) {
                var ll = ol.proj.fromLonLat(c);
                c[0] = ll[0];
                c[1] = ll[1];
            }
            else if (d == 2) {
                for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                    var c0 = c_1[_i];
                    var ll = ol.proj.fromLonLat(c0);
                    c0[0] = ll[0];
                    c0[1] = ll[1];
                }
            }
            else if (d == 3) {
                for (var _a = 0, c_2 = c; _a < c_2.length; _a++) {
                    var c0 = c_2[_a];
                    for (var _b = 0, c0_1 = c0; _b < c0_1.length; _b++) {
                        var c1 = c0_1[_b];
                        var ll = ol.proj.fromLonLat(c1);
                        c1[0] = ll[0];
                        c1[1] = ll[1];
                    }
                }
            }
            else if (d == 4) {
                for (var _c = 0, c_3 = c; _c < c_3.length; _c++) {
                    var c0 = c_3[_c];
                    for (var _d = 0, c0_2 = c0; _d < c0_2.length; _d++) {
                        var c1 = c0_2[_d];
                        for (var _e = 0, c1_1 = c1; _e < c1_1.length; _e++) {
                            var c2 = c1_1[_e];
                            var ll = ol.proj.fromLonLat(c2);
                            c2[0] = ll[0];
                            c2[1] = ll[1];
                        }
                    }
                }
            }
            return c;
        };
        return OLMap;
    }(WUX.WComponent));
    APP.OLMap = OLMap;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var WIcon = WUX.WIcon;
    var TXT = (function () {
        function TXT() {
        }
        TXT.OK = 'OK';
        TXT.CLOSE = 'Chiudi';
        TXT.NEW = 'Nuovo';
        TXT.OPEN = 'Modifica';
        TXT.DELETE = 'Elimina';
        TXT.SAVE = 'Salva';
        TXT.SEND = 'Invia';
        TXT.SEND_EMAIL = 'Email';
        TXT.FIND = 'Cerca';
        TXT.FORCE = 'Forza';
        TXT.SEARCH = 'Cerca';
        TXT.CANCEL = 'Annulla';
        TXT.RESET = 'Annulla';
        TXT.PRINT = 'Stampa';
        TXT.PRINT_ALL = 'Stampa Tutto';
        TXT.PREVIEW = 'Anteprima';
        TXT.EXPORT = 'Esporta';
        TXT.IMPORT = 'Importa';
        TXT.HELP = 'Guida';
        TXT.VIEW = 'Vedi';
        TXT.ENABLE = 'Abilita';
        TXT.DISABLE = 'Disabilita';
        TXT.ADD = 'Aggiungi';
        TXT.APPLY = 'Applica';
        TXT.REMOVE = 'Rimuovi';
        TXT.REMOVE_ALL = 'Rim.Tutto';
        TXT.REFRESH = 'Aggiorna';
        TXT.UNDO = 'Annulla';
        TXT.SETTINGS = 'Impostazioni';
        TXT.COPY = 'Copia';
        TXT.CUT = 'Taglia';
        TXT.PASTE = 'Incolla';
        TXT.CONFIRM = 'Conferma';
        TXT.FORWARD = 'Avanti';
        TXT.BACKWARD = 'Indietro';
        TXT.NEXT = 'Prossimo';
        TXT.PREVIOUS = 'Precedente';
        TXT.SELECT = 'Seleziona';
        TXT.SELECT_ALL = 'Sel.Tutto';
        TXT.WORK = 'Lavora';
        TXT.AGGREGATE = 'Aggrega';
        TXT.SET = 'Imposta';
        TXT.DEFAULT = 'Predefinito';
        TXT.REWORK = 'Rielabora';
        TXT.PUSH = 'Spedisci';
        TXT.SUSPEND = 'Sospendi';
        TXT.RESUME = 'Riattiva';
        TXT.CODE = 'Codice';
        TXT.DESCRIPTION = 'Descrizione';
        TXT.GROUP = 'Gruppo';
        TXT.ROLE = 'Ruolo';
        TXT.TYPE = 'Tipo';
        return TXT;
    }());
    APP.TXT = TXT;
    var MSG = (function () {
        function MSG() {
        }
        MSG.CONF_DELETE = 'Eliminare l\'elemento selezionato?';
        MSG.CONF_DISABLE = 'Disabilitare l\'elemento selezionato?';
        MSG.CONF_ENABLE = 'Abilitare l\'elemento selezionato?';
        MSG.CONF_CANCEL = 'Si vogliono annullare le modifiche apportate?';
        MSG.CONF_PROCEED = 'Si vuole procedere con l\'operazione?';
        MSG.CONF_OVERWRITE = 'Si vuole procedere con la sovrascrittura?';
        MSG.MSG_COMPLETED = 'Operazione completata con successo.';
        MSG.MSG_ERRORS = 'Errore durante l\'elaborazione.';
        return MSG;
    }());
    APP.MSG = MSG;
    var ICO = (function () {
        function ICO() {
        }
        ICO.TRUE = WIcon.CHECK_SQUARE_O;
        ICO.FALSE = WIcon.SQUARE_O;
        ICO.CLOSE = WIcon.TIMES;
        ICO.OK = WIcon.CHECK;
        ICO.CALENDAR = WIcon.CALENDAR;
        ICO.AGGREGATE = WIcon.CHAIN;
        ICO.NEW = WIcon.PLUS_SQUARE_O;
        ICO.EDIT = WIcon.EDIT;
        ICO.OPEN = WIcon.EDIT;
        ICO.DELETE = WIcon.TRASH;
        ICO.DETAIL = WIcon.FILE_TEXT_O;
        ICO.SAVE = WIcon.CHECK;
        ICO.FIND = WIcon.SEARCH;
        ICO.FIND_DIFF = WIcon.SEARCH_MINUS;
        ICO.FIND_PLUS = WIcon.SEARCH_PLUS;
        ICO.FORCE = WIcon.CHECK_CIRCLE;
        ICO.FORCE_ALL = WIcon.CHECK_CIRCLE_O;
        ICO.SEARCH = WIcon.SEARCH;
        ICO.CANCEL = WIcon.UNDO;
        ICO.RESET = WIcon.TIMES_CIRCLE;
        ICO.PRINT = WIcon.PRINT;
        ICO.PREVIEW = WIcon.SEARCH_PLUS;
        ICO.EXPORT = WIcon.SHARE_SQUARE_O;
        ICO.IMPORT = WIcon.SIGN_IN;
        ICO.FILE = WIcon.FILE_O;
        ICO.HELP = WIcon.QUESTION_CIRCLE;
        ICO.VIEW = WIcon.FILE_TEXT_O;
        ICO.ENABLE = WIcon.THUMBS_O_UP;
        ICO.DISABLE = WIcon.THUMBS_O_DOWN;
        ICO.ADD = WIcon.PLUS;
        ICO.APPLY = WIcon.CHECK;
        ICO.REMOVE = WIcon.MINUS;
        ICO.REFRESH = WIcon.REFRESH;
        ICO.UNDO = WIcon.UNDO;
        ICO.SETTINGS = WIcon.COG;
        ICO.OPTIONS = WIcon.CHECK_SQUARE;
        ICO.PASSWORD = WIcon.UNDO;
        ICO.COPY = WIcon.COPY;
        ICO.CUT = WIcon.CUT;
        ICO.PASTE = WIcon.PASTE;
        ICO.FORWARD = WIcon.ANGLE_DOUBLE_RIGHT;
        ICO.BACKWARD = WIcon.ANGLE_DOUBLE_LEFT;
        ICO.NEXT = WIcon.FORWARD;
        ICO.PREVIOUS = WIcon.BACKWARD;
        ICO.CONFIRM = WIcon.CHECK;
        ICO.FILTER = WIcon.FILTER;
        ICO.SEND = WIcon.SEND;
        ICO.SEND_EMAIL = WIcon.ENVELOPE_O;
        ICO.WAIT = WIcon.COG;
        ICO.WORK = WIcon.COG;
        ICO.CONFIG = WIcon.COG;
        ICO.LEFT = WIcon.ARROW_CIRCLE_LEFT;
        ICO.RIGHT = WIcon.ARROW_CIRCLE_RIGHT;
        ICO.SELECT_ALL = WIcon.TH_LIST;
        ICO.REWORK = WIcon.REFRESH;
        ICO.PUSH = WIcon.TRUCK;
        ICO.AHEAD = WIcon.ANGLE_DOUBLE_RIGHT;
        ICO.SUSPEND = WIcon.TOGGLE_OFF;
        ICO.RESUME = WIcon.RECYCLE;
        ICO.PAIRING = WIcon.RANDOM;
        ICO.CHECK = WIcon.CHECK_SQUARE_O;
        ICO.EVENT = WIcon.BOLT;
        ICO.MESSAGE = WIcon.ENVELOPE_O;
        ICO.USER = WIcon.USER_O;
        ICO.GROUP = WIcon.USERS;
        ICO.TOOL = WIcon.WRENCH;
        ICO.DEMOGRAPHIC = WIcon.ADDRESS_CARD;
        ICO.DOCUMENT = WIcon.FILE_TEXT_O;
        ICO.LINKS = WIcon.CHAIN;
        ICO.WARNING = WIcon.WARNING;
        ICO.INFO = WIcon.INFO_CIRCLE;
        ICO.CRITICAL = WIcon.TIMES_CIRCLE;
        return ICO;
    }());
    APP.ICO = ICO;
})(APP || (APP = {}));
var APP;
(function (APP) {
    var GUISample = (function (_super) {
        __extends(GUISample, _super);
        function GUISample(id) {
            var _this = _super.call(this, id ? id : '*', 'GUISample') || this;
            _this._ma = ['ragioneSociale', 'email'];
            return _this;
        }
        GUISample.prototype.render = function () {
            var _a;
            var _this = this;
            this.fpMain = new WUX.WFormPanel('fpMain');
            this.fpMain.addRow();
            this.fpMain.addTextField('ragioneSociale', 'Ragione Sociale');
            this.fpMain.addRow();
            this.fpMain.addTextField('email', 'Email');
            this.fpMain.addTextField('telefono', 'Telefono');
            (_a = this.fpMain).setMandatory.apply(_a, this._ma);
            this.btnSave = new WUX.WButton(this.subId('btnSave'), APP.TXT.SAVE, WUX.WIcon.CHECK, WUX.BTN.PRIMARY);
            this.btnSave.on('click', function (e) {
                var f = _this.fpMain.getRoot();
                _this.initValidator(f);
                var n = !f.valid();
                if (n)
                    APP.scrollTo(_this.fpMain);
                if (n) {
                    WUX.showWarning('Controllare i valori immessi');
                    return;
                }
                var cm = _this.fpMain.checkMandatory(true, true, false);
                if (cm) {
                    WUX.showWarning('Specificare i seguenti campi: ' + cm);
                    return;
                }
                $(window).scrollTop(0);
                var a = new APP.APPArticle('art-sample', 'Sample');
                a.addSignature = true;
                var m = [];
                m.push('La ringraziamo per il tempo dedicato.');
                a.setState(m);
                var t = WUX.getPageTitle();
                if (t && t.length)
                    t.hide();
                WuxDOM.replace(_this, a);
            });
            this.container = new WUX.WContainer();
            this.container
                .addRow()
                .addCol('col-md-12')
                .section('Dati principali')
                .add(this.fpMain)
                .addRow()
                .addCol('col-md-12', { a: 'center', pt: 16 })
                .add(this.btnSave);
            return this.container;
        };
        GUISample.prototype.componentDidMount = function () {
            this.initValidator(this.fpMain.getRoot());
        };
        GUISample.prototype.initValidator = function (f, r) {
            if (!f || !f.length)
                return;
            f.removeData('validator');
            this.jqv = f.validate({
                ignore: null,
                rules: {
                    'fpMain-ragioneSociale': { required: true },
                    'fpMain-email': { required: true, email: true },
                    'fpMain-telefono': { required: false, minlength: 6, maxlength: 15, digits: true },
                }
            });
            if (r)
                this.jqv.resetForm();
        };
        return GUISample;
    }(WUX.WComponent));
    APP.GUISample = GUISample;
})(APP || (APP = {}));
//# sourceMappingURL=app.js.map