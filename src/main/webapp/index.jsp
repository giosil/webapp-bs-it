<%@ page import="org.dew.webapp.util.App, org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>
<%
	// Esegue eventuale login (Ricordami)
	WebUtil.login(request, response);
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Home</title>
		<%@ include file="_imp_page_header.jsp" %>
	</head>
	<body class="page-template page-template-home page">
		<div id="wrapper">
			<%@ include file="_imp_body_header.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">

					<div class="container">
						<article class="page type-page status-publish hentry">
							<header class="header mt-5">
								<h4 class="entry-title">
									<a href="#" title="Home" rel="bookmark">Home</a>
								</h4>
							</header>
							<section class="entry-content">
								<div id="entry-content-home" class="panel-layout">
									<div id="pg-home-0" class="panel-grid panel-has-style">
										<div class="siteorigin-panels-stretch panel-row-style panel-row-style-for-home-0" data-stretch-type="full-stretched" style="margin-left: -371.5px; margin-right: -371.5px; padding-left: 0px; padding-right: 0px; border-left: 0px; border-right: 0px;">
											<div id="pgc-home-0-0" class="panel-grid-cell" style="padding-left: 0px; padding-right: 0px;">
												<div class="widget_text so-panel widget widget_custom_html panel-first-child panel-last-child" data-index="0">
													<div class="textwidget custom-html-widget">
														<div class="row pt-3">
															<div class="col pt-1">
																<p class="m-0 pl-5">
																	<img class="img-responsive m-0" src="./img/aright.png" width="150px" alt="">
																</p>
															</div>
														</div>
														<div class="row">
															<div class="col">
																<p class="m-0 text-center ">
																	<img class="img-responsive m-0" src="./img/logo_app.png" width="200px" alt="">
																</p>
																<h2 class="text-center text-white m-0" style="font-size: 1.5rem;"><%= App.getBrandMotto() %></h2>
															</div>
														</div>
														<div class="row pb-3">
															<div class="col">
																<p class="m-0 text-right pr-5">
																	<img class="img-responsive m-0" src="./img/aleft.png" width="150px" alt="">
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									
									<h1>Il progetto</h1>
									<div class="textwidget">
										<p align="justify">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. </p>
										<p align="justify">Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
										<p align="justify">Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
										<ul>
											<li style="text-align: justify;">item 1;</li>
											<li style="text-align: justify;">item 2;</li>
											<li style="text-align: justify;">item 3.</li>
										</ul>
										<p align="justify">Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
									</div>
									
								</div>
							</section>
						</article>
					</div>

				</section>
			</div>
			
			<%@ include file="_imp_body_footer.jsp" %>
		</div>
		<%@ include file="_imp_page_footer.jsp" %>
	</body>
</html>