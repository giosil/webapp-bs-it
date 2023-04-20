<%@ page import="org.dew.webapp.bl.User, org.dew.webapp.util.App, org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>
<%
	User user = WebUtil.getUser(request);
	if(user != null) {
		response.sendRedirect(App.WELCOME_PAGE);
		return;
	}
	Object msg = request.getAttribute("message");
	String usr = WebUtil.getStringAttr(request, "username");
	String iua = usr != null && usr.length() > 0 ? " value=\"" + usr.replace("\"", "\\\"") + "\"" : " autofocus";
	String ipa = usr != null && usr.length() > 0 ? " autofocus" : "";
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Login</title>
		<%@ include file="_imp_page_header.jsp" %>
	</head>
	<body class="page-template page">
		<div id="wrapper">
			<%@ include file="_imp_body_header.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">
					<div class="container" style="padding-top: 1.5rem;">
						<h2>Login</h2>
						<hr>
						<div class="row">
							<div class="col-md-6">
								<form role="form" action="login" method="POST" id="loginForm">
									<div class="form-group">
										<label for="j_username">Utente o indirizzo email</label>
										<input type="text" class="form-control" placeholder="Username" id="j_username" name="j_username" required<%= iua %>>
									</div>
									<div class="form-group">
										<label for="j_password">Password:</label>
										<div class="input-group" id="shp1">
										<input type="password" class="form-control" placeholder="Password" name="j_password" id="j_password" required<%= ipa %>>
										<div class="input-group-addon">
											<a href="javascript:void(0)" onclick="showHidePassword('#shp1')" tabindex="-1"><i class="fa fa-eye-slash" aria-hidden="true"></i></a>
										</div>
										</div>
									</div>
									<br>
									<% WebUtil.writeErrorMessage(request, out, msg); %>
									<div class="row">
										<div class="col-md-1">
											<input type="checkbox" class="form-control" name="remember" id="remember" value="1" style="height:16px;">
										</div>
										<div class="col-md-5">
											<label for="remember" style="cursor: pointer;"> Ricordami</label>
										</div>
										<div class="col-md-6" style='text-align:right;'>
											<a href="javascript:void(0)" onclick="resetPassword()" tabindex="-1" style="font-weight: bold;">Ho dimenticato la password</a>
										</div>
									</div>
									<br>
									<br>
									<button type="submit" class="btn btn-primary"><i class="fa fa-sign-in"></i> Accedi</button>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>
			
			<%@ include file="_imp_body_footer.jsp" %>
		</div>
		<%@ include file="_imp_page_footer.jsp" %>
		
		<script>
			function resetPassword() {
				var $u = $('#j_username');
				var un = $u.val();
				if(!un) {
					var $v = $("#loginForm").validate();
					var er = { j_username: "Riportare il nome utente o l'email per il reset dell'account." };
					$v.showErrors(er);
					$u.focus();
					return;
				}
				location.href='resetPassword?j_username=' + encodeURIComponent(un);
			}
		</script>
	</body>
</html>