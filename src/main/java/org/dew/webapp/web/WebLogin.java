package org.dew.webapp.web;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dew.webapp.bl.User;

import org.dew.webapp.util.App;
import org.dew.webapp.util.WebUtil;

public 
class WebLogin extends HttpServlet 
{
  private static final long serialVersionUID = 2981713432753542045L;
  
  public 
  void doGet(HttpServletRequest request, HttpServletResponse response) 
    throws ServletException, IOException 
  {
    doPost(request, response);
  }
  
  public 
  void doPost(HttpServletRequest request, HttpServletResponse response) 
    throws ServletException, IOException 
  {
    User user = WebUtil.login(request, response);
    if(user != null) {
      RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.WELCOME_PAGE);
      requestDispatcher.forward(request, response);
    }
    else {
      RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.LOGIN_PAGE);
      requestDispatcher.forward(request, response);
    }
  }
}
