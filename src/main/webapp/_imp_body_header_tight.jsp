<%@ page import="org.dew.webapp.bl.User, org.dew.webapp.util.App, org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>
<%
	User _user = WebUtil.getUser(request);
%>
<header id="header" class="fixed-top" role="banner">
	<div class="it-header-wrapper">
		<div class="it-header-center-wrapper">
			<div class="container">
				<div class="row">
					<div class="col-md-12">
						<div class="it-header-center-content-wrapper">
							<div class="row ">
								<div class="it-brand-wrapper" style="padding-right: 2rem;">
									<a href="index.jsp" title="Home" rel="home">
										<img class="icon" src="./img/logo_app.png" alt="brand"style="margin: 0; padding: 0"/>
									</a>
								</div>
								<div class="box_loghi d-none d-md-block">
									<img class="logo_header_img" src="./img/logo_html5.png" alt="#" title="HTML 5">
									<img class="logo_header_img" src="./img/logo_css.png" alt="#" title="CSS 3">
									<img class="logo_header_img" src="./img/logo_js.png" alt="#" title="Javascript">
									<img class="logo_header_img" src="./img/logo_bs.png" alt="#" title="Bootstrap">
									<img class="logo_header_img" src="./img/logo_jquery.png" alt="#" title="jQuery">
									<img class="logo_header_img" src="./img/logo_ts.png" alt="#" title="Typescript">
								</div>
							</div>
							<div class="it-right-zone">
								<div style="text-align: -webkit-right;text-align: -moz-right;">
								<% if(_user == null) { %>
									<button id="btnLogin" class="btn btn-primary btn-sm btn-md-lg" type="button" title="Accedi" onclick="location.href='<%= App.LOGIN_PAGE %>'"><i class="fa fa-sign-in"></i> Accedi</button>
								<% } else { %>
									<button id="btnLogout" class="btn btn-primary btn-sm btn-md-lg" type="button" title="Logout" onclick="location.href='<%= App.LOGOUT_PAGE %>'"><i class="fa fa-sign-out"></i> Logout</button>
								<% } %>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="it-nav-wrapper">
			<% WebUtil.writeMenu(request, out); %>
		</div>
	</div>
</header>
