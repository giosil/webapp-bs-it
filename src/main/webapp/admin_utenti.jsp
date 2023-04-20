<%@ page import="org.dew.webapp.bl.User, org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	User user = WebUtil.checkUser(request, response);
	if(user == null) return;
	String debug = request.getParameter("debug");
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Amministrazione utenti</title>
		<%@ include file="_imp_page_header_tight.jsp" %>
	</head>
	<body class="page-template page">
		<div id="wrapper">
			<%@ include file="_imp_body_header_tight.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">
					<h2 id="ptitle">Amministrazione utenti</h2>
					<div id="view-root" class="container"></div>
				</section>
			</div>
			
			<%@ include file="_imp_body_footer.jsp" %>
		</div>
		<%@ include file="_imp_page_footer.jsp" %>
		
		<% WebUtil.writeScriptImport(out, "wux/js/wux.min.js", "wux/js/wux.js", debug); %>
		<% WebUtil.writeScriptImport(out, "wux/js/app.min.js", "wux/js/app.js", debug); %>
		<script>
			WuxDOM.render(new APP.GUIAdminUte(), 'view-root');
		</script>
	</body>
</html>