<%@ page import="org.dew.webapp.util.App" contentType="text/html; charset=UTF-8" %>
<footer id="footer" class="it-footer" role="contentinfo">
	<div class="it-footer-main">
		<div class="container">
			<section>
				<div class="row clearfix">
					<div class="col-sm-12">
						<div class="it-brand-wrapper">
							<a href="index.jsp" title="Home" rel="home">
								<img class="icon" src="./img/logo_app.png" alt="App">
								<div class="it-brand-text">
									<h2 class="no_toc"><%= App.getBrandName() %></h2>
									<h3 class="no_toc d-none d-md-block"><%= App.getBrandMotto() %></h3>
								</div>
							</a>
						</div>
					</div>
				</div>
			</section>
			<section>
				<div class="row">
					<div class="container-fluid widget-area">
						<div class="row xoxo">
							<div id="block-7" class="col-lg widget-container widget_block">
								<div class="row">
									<div class="col-md-6 text-center mb-3">
										<h6>Contatti</h6>
										<p> e-mail: <a href="mailto:info@dew.org">info@dew.org</a></p>
									</div>
									<div class="col-md-6 text-center mb-3">
										<h6>Collegamenti:</h6>
										<p class="mb-1">
											<a href="https://www.w3.org/" target="_blank">W3C</a>
										</p>
										<p class="mb-1">
											<a href="https://javascript.info/" target="_blank">JavaScript</a>
										</p>
										<p class="mb-1">
											<a href="https://www.w3.org/Style/CSS/Overview.en.html" target="_blank">CSS</a>
										</p>
										<p class="mb-1">
											<a href="https://getbootstrap.com" target="_blank">Bootstrap</a>
										</p>
										<p class="mb-1">
											<a href="https://www.typescriptlang.org" target="_blank">Typescript</a>
										</p>
									</div>
								</div>
								<hr>
								<div class="row pt-4">
									<div class="col">
										<p class="text-center">
											<a class="m-4" href="page_note_legali.jsp">Note legali</a>
											<a class="m-4" href="page_privacy_policy.jsp">Privacy policy</a>
											<a class="m-4" href="page_cookie_policy.jsp">Cookie policy</a>
											<a class="m-4" href="page_mappa_sito.jsp">Mappa del sito</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</footer>
