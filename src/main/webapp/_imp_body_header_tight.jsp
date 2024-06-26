<%@ page import="org.dew.webapp.bl.User, org.dew.webapp.util.App, org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>
<%
	User _user = WebUtil.getUser(request);
%>
<header id="header" class="fixed-top" role="banner">
	<div class="it-header-wrapper">
		<div class="it-header-slim-wrapper">
			<div class="container">
				<div class="row">
					<div class="col-md-5 d-none d-md-block">
						<div class="it-header-slim-wrapper-content">
							<div class="row">
								<img src="./img/logo_app.png" alt="brand" style="width:60px;height:60px;">
								<a href="index.jsp" title="Home" rel="home" style="text-decoration:none">
									<h2 class="no_toc" style="padding-top:8px;padding-left:16px"><%= App.getBrandName() %></h2>
								</a>
							</div>
						</div>
					</div>
					<div class="col-md-5 d-none d-md-block">
						<div class="it-header-slim-wrapper-content">
							<div class="row">
								<div class="box_loghi">
									<img class="logo_header_img" src="./img/logo_html5.png" alt="#" title="HTML 5">
									<img class="logo_header_img" src="./img/logo_css.png" alt="#" title="CSS 3">
									<img class="logo_header_img" src="./img/logo_js.png" alt="#" title="Javascript">
									<img class="logo_header_img" src="./img/logo_bs.png" alt="#" title="Bootstrap">
									<img class="logo_header_img" src="./img/logo_jquery.png" alt="#" title="jQuery">
									<img class="logo_header_img" src="./img/logo_ts.png" alt="#" title="Typescript">
								</div>
							</div>
						</div>
					</div>
				<% if(_user == null) { %>
					<div class="col-md-2" style="text-align:-webkit-right;text-align:-moz-right;padding:10px 0px 0px 0px;">
						<button id="btnLogin" class="btn-sm btn-primary" type="button" title="Accedi" onclick="location.href='<%= App.LOGIN_PAGE %>'"><i class="fa fa-sign-in"></i> Accedi</button>
					</div>
				<% } else { %>
					<div class="col-md-2" style="text-align:-webkit-right;text-align:-moz-right;padding:10px 0px 0px 0px;">
						<button id="btnLogout" class="btn-sm btn-primary" type="button" title="Logout" onclick="location.href='<%= App.LOGOUT_PAGE %>'"><i class="fa fa-sign-out"></i> Logout</button>
					</div>
				<% } %>
				</div>
			</div>
		</div>
		<div class="it-nav-wrapper">
			<% WebUtil.writeMenu(request, out); %>
		</div>
	</div>
</header>
