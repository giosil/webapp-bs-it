<%@ page import="org.dew.webapp.util.WebUtil" contentType="text/html; charset=UTF-8" %>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<link href="design-italia/lib/bootstrap-italia/css/bootstrap-italia.min.css" rel="stylesheet" type="text/css">
<link href="design-italia/lib/bootstrap-italia/css/italia-icon-font.css" rel="stylesheet" type="text/css">
<% WebUtil.writeCSSImport(out, "design-italia/style.css"); %>
<link href="design-italia/lib/bootstrap-italia/css/line-awesome.min.css" rel="stylesheet" type="text/css">
<link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

<link href="css/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet">
<link href="css/plugins/select2/select2.min.css" rel="stylesheet">
<link href="css/plugins/datapicker/datepicker3.css" rel="stylesheet">
<link href="css/plugins/sweetalert/sweetalert.css" rel="stylesheet">
<link href="css/plugins/toastr/toastr.min.css" rel="stylesheet">

<% WebUtil.writeCSSImport(out, "devextreme/css/dx.common.css"); %>
<% WebUtil.writeCSSImport(out, "devextreme/css/dx.light.compact.css"); %>

<% WebUtil.writeCSSImport(out, "css/theme.min.css"); %>
<% WebUtil.writeCSSImport(out, "css/main.min.css"); %>

<% WebUtil.writeUserInfo(request, out); %>
