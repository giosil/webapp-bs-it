<%@ page import="org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	String debug = request.getParameter("debug");
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Mappa del sito</title>
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
								<h1 class="entry-title">Mappa del sito</h1>
							</header>
							<section class="entry-content">
								<div class="textwidget">
									<h3>Pagine</h3>
									<p>&nbsp;</p>
									<ul>
										<li><a href="index.jsp">Home</a></li>
										<li><a href="page_note_legali.jsp">Note Legali</a></li>
										<li><a href="page_privacy_policy.jsp">Privacy policy</a></li>
										<li><a href="page_cookie_policy.jsp">Cookie policy</a></li>
									</ul>
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