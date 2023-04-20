<%@ page import="org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>
<% 
	WebUtil.logout(request, response);
	response.sendRedirect(request.getContextPath());
%>