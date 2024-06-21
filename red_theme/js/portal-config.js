window.BSIT={
	counter: 0,
	triggerReadyState: (info) => {
		console.log(`${info.appName} ready!`);
		window.dispatchEvent(new CustomEvent('app:app-ready', info));
		let cc = new CustomEvent('config-change', {detail: {baseUrl:"https://gateway.portal.dew/app"}});
		window.dispatchEvent(cc);
		let sc = new CustomEvent('session-change', {detail: {accessToken:"1", userInfo:null, isClientCredentials:true, medico:false}});
		window.dispatchEvent(sc);
	},
	showLoader: () => {
		window.BSIT.counter++;
		document.body.classList.add('loading');
	},
	hideLoader: () => {
		if (--window.BSIT.counter <= 0) {
			document.body.classList.remove('loading');
			if (window.BSIT.counter < 0) {
				window.BSIT.counter = 0;
			}
		}
	},
	notify: (notification) => {
		const div = document.createElement('div');
		const counterId = Number($("[id*='api-notification-'").last().attr("data-id")) + 1 || 0;
		if (notification.dismissable == null || notification.dismissable == undefined) {
			notification.dismissable = true;
		}
		switch (notification.state) {
			case 'error':
				notification.icon = "it-close-circle";
				break;
			case 'success':
				notification.icon = "it-check-circle";
				break;
			case 'warning':
				notification.icon = "it-error";
				break;
			default:
				notification.icon = "it-info-circle";
				break;
		}
		const element = `<div role="alert" class="notification with-icon mt-3 ${!notification.dismissable ? '' : 'dismissable'} ${notification.state || 'info'} show"
			style="display: block;" id="api-notification-${counterId}" data-bs-toggle="notification" data-bs-target="#api-notification-${counterId}" data-id="${counterId}" data-bs-timeout="5000">
			<h5>
				${notification.title}
				<svg class="icon"><use href="bootstrap-italia/svg/sprite.svg#${notification.icon}" xlink:href="/fse-portal/bootstrap-italia/svg/sprite.svg#${notification.icon}"></use></svg>
			</h5>
			<p>${notification.message}</p>
			<button type="button" class="notification-close btn btn- ${!notification.dismissable ? 'd-none' : ''}">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" role="img">
					<path d="M12.7 12l3.7 3.6-.8.8-3.6-3.7-3.6 3.7-.8-.8 3.7-3.6-3.7-3.6.8-.8 3.6 3.7 3.6-3.7.8.8z"></path>
					<path fill="none" d="M0 0h24v24H0z"></path>
				</svg>
				<span class="sr-only">Chiudi notifica: ${notification.title}</span>
			</button>
		</div>`;
		div.innerHTML = element;
		document.getElementById('notification-center').append(div.firstChild);
		setTimeout(() => {
			document.getElementById('notification-center').innerHTML = '';
		}, notification.duration || 5000);
	}
};
