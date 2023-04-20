<%@ page import="org.dew.webapp.bl.User, org.dew.webapp.util.*" contentType="text/html; charset=UTF-8" %>
<%
	User user   = WebUtil.getUser(request);
	Object code = request.getAttribute("code");
	Object msg  = request.getAttribute("message");
%>
<!DOCTYPE html>
<html lang="it">
	<head>
		<title><%= App.getAppName() %> - Attivazione</title>
		<%@ include file="_imp_page_header.jsp" %>
	</head>
	<body class="page-template page">
		<div id="wrapper">
			<%@ include file="_imp_body_header.jsp" %>
			
			<div id="container">
				<section id="content" role="main" class="container">
					<div class="container">
						<h2>Attivazione</h2>
						<hr>
<% if(msg != null && code == null) { %>

						<% WebUtil.writeErrorMessage(request, out, msg); %>

<% } else if(user != null) { %>

						<p>Benvenuti in Webapp, il suo account &egrave; stato attivato.</p>
						<p>Occorre indicare la password da utilizzare negli accessi successivi:</p>
						<div class="row">
							<div class="col-md-6">
								<form role="form" action="updatePassword" method="POST" id="upd-pwd-form" onsubmit="return valUpdPwdForm()">
									<div class="form-group">
										<label for="newp">Proponi Password:</label>
										<div class="input-group" id="shp1">
										<input type="password" class="form-control" name="newp" id="newp" required autofocus>
										<div class="input-group-addon">
											<a href="javascript:void(0)" onclick="showHidePassword('#shp1')" tabindex="-1"><i class="fa fa-eye-slash" aria-hidden="true"></i></a>
										</div>
										</div>
									</div>
									<div class="form-group">
										<label for="repp">Ripeti Password:</label>
										<div class="input-group" id="shp2">
										<input type="password" class="form-control" name="repp" id="repp" required>
										<div class="input-group-addon">
											<a href="javascript:void(0)" onclick="showHidePassword('#shp2')" tabindex="-1"><i class="fa fa-eye-slash" aria-hidden="true"></i></a>
										</div>
										</div>
									</div>
									<br>
									<a href="javascript:void(0)" onclick="genPassword()" tabindex="-1" style="font-weight: bold;">Password suggerita</a>
									<br>
									<% WebUtil.writeErrorMessage(request, out, msg); %>
									<br>
									<input type="hidden" id="code" name="code" value="<%= code %>">
									<button type="submit" class="btn btn-primary"><i class="fa fa-sign-in"></i> Aggiorna Password</button>
								</form>
							</div>
						</div>
<% } else { %>

						<% WebUtil.writeErrorMessage(request, out, "Il codice di attivazione non &egrave; stato riconosciuto."); %>

<% } %>
					</div>
				</section>
			</div>
			
			<%@ include file="_imp_body_footer.jsp" %>
		</div>
		<%@ include file="_imp_page_footer.jsp" %>
		
		<script>
			function valUpdPwdForm() {
				var f=$('#upd-pwd-form');
				f.validate({
					errorPlacement: function(error, element) {
						if(element.parent().hasClass('input-group')) {
							error.insertAfter(element.parent());
						} else {
							error.insertAfter(element);
						}
					},
					rules:{
						newp:{required:true,pwd:true},
						repp:{equalTo:"#newp"}
					}
				});
				if(!f.valid())return false;
				return true;
			}
			function genPassword() {
				var r = '';
				for(var i = 0; i < 10; i++) {
					var c = 65;
					if(i < 3) {
						c = 65 + Math.floor(Math.random() * 26);
					}
					else if (i < 6) {
						c = 97 + Math.floor(Math.random() * 26);
					}
					else if (i < 8) {
						c = 48 + Math.floor(Math.random() * 10);
					}
					else {
						c = 33 + Math.floor(Math.random() * 15);
					}
					r += String.fromCharCode(c);
				}
				$('#newp').val(r);
				$('#repp').val(r);
				return r;
			}
		</script>
	</body>
</html>