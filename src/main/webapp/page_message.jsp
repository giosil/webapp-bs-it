<%@ page import="org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	String title   = WebUtil.getStringAttr(request, "title",   "Messaggio");
	String message = WebUtil.getStringAttr(request, "message", "");
	String text    = WebUtil.getStringAttr(request, "text", "");
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Messaggio</title>
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
								<h1 class="entry-title"><%= title %></h1>
							</header>
							<section class="entry-content">
								<div class="textwidget">
									<p><%= message %></p>
									<%= text %>
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