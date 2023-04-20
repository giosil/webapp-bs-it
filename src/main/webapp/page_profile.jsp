<%@ page import="org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	User user = WebUtil.checkUser(request, response);
	if(user == null) return;
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Profile</title>
		<%@ include file="_imp_page_header.jsp" %>
	</head>
	<body class="page-template page">
		<div id="wrapper">
			<%@ include file="_imp_body_header.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">
					<div class="container">
						<article class="page type-page status-publish hentry">
							<header class="header">
								<h1 class="entry-title">Profile</h1>
							</header>
							<section class="entry-content">
								<div class="textwidget">
									<p>Welcome,</p>
									<p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.</p>
									<p>Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
									<p>Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
									<p>Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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