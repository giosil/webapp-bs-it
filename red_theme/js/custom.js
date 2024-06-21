$(document).ready(function() {
	_init();
	var offset = 120;
	function scrollFunction() {
		if ($(window).scrollTop() > offset && $(window).width() > 767) {
			$(".btn-group.dropdown-user .dropdown-toggle.show").trigger("click")
			if (!$("header").hasClass('ridotto')) {
				$("header").addClass('ridotto');
				return true
			}
		} else {
			if (scrollY === 0) {
				$("header").removeClass('ridotto');
			}
		}
		return false;
	}
	$(window).on('scroll', scrollFunction);
});
function _init() {
	let t = document.getElementById('nav1-items');
	if(t) {
		let items = _item('Homepage',    'index.html');
		items += _item('Configurazione', 'app-conf.html');
		items += _item('Documenti',      'app-docs.html');
		items += _item('Log di sistema', 'app-logs.html');
		items += _item('Informazioni',   'app-info.html');
		t.innerHTML = items;
	}
	var p = location.pathname;
	if(!p || p == '/' || p == '/home' || p.endsWith('/index.html')) {
		let a = document.getElementById('single-spa-application');
		if(a) {
			let cards = `<app-root><app-home><div class="main-background"></div><div class="desktop-wrapper"><div class="motto-wrapper homepage">
				<h1 class="color-white mb-1" style="padding-top: 2rem; font-weight: 700; font-size: 50px;">Portale Bootstrap Italia</h1>
				<h3 class="color-white mb-1" style="font-weight: 400;">Il portale per la pubblica amministrazione.</h3>
			</div><div id="cards" class="widget-wrapper container-fluid row" style="overflow: auto;">`;
			cards += _card('edit.png', 'Configurazione', 'Configurazione sistema',   'app-conf.html');
			cards += _card('docs.png', 'Documenti',      'Documentazione tecnica',   'app-docs.html');
			cards += _card('cal.png',  'Log di sistema', 'Log operazioni',           'app-logs.html');
			cards += _card('card.png', 'Informazioni',   'Informazioni di sistema',  'app-info.html');
			cards += `</div></div></app-home></app-root>`;
			a.innerHTML = cards;
		}
	}
}
function _item(title, href) {
	let p = location.pathname;
	if(!p || p == '/' || p == '/home') p = '/index.html';
	let c = p.endsWith(href) ? 'active' : '';
	return `<li class="nav-item dropdown megamenu"><a href="${href}" aria-expanded="false" class="nav-link dropdown-toggle ${c}" title="${title}"><span>${title}</span></a></li>`;
}
function _card(icon, title, text, href) {
	return `<div class="col-12 col-lg-3"><div class="card-wrapper card-space"><div class="card card-bg"><div class="card-body">
		<div class="categoryicon-top"><svg class="icon"><image xlink:href="./images/icons/${icon}"></image></svg><h5 class="card-title">${title}</h5></div>
		<p class="card-text">${text}</p><a class="read-more" href="${href}" title="${title}"><span class="text">Vai</span><svg class="svg-inline--fa fa-right-long" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="right-long" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M334.5 414c8.8 3.8 19 2 26-4.6l144-136c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 88L32 208c-17.7 0-32 14.3-32 32l0 32c0 17.7 14.3 32 32 32l288 0 0 88c0 9.6 5.7 18.2 14.5 22z"></path></svg><!-- <i class="fas fa-long-arrow-alt-right"></i> Font Awesome fontawesome.com --></a>
	</div></div></div></div>`;
}