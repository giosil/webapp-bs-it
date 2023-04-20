package org.dew.webapp.web;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dew.webapp.util.App;

import org.dew.webapp.ws.WSUtenti;

public 
class WebResetPassword extends HttpServlet 
{
  private static final long serialVersionUID = -3035967612141207610L;
  
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
    String sUsername = request.getParameter("j_username");
    if(sUsername == null || sUsername.length() == 0) {
      sUsername = request.getParameter("username");
    }
    
    boolean reset = false;
    try {
      reset = WSUtenti.resetPassword(sUsername);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    
    request.setAttribute("title", "Reset password");
    if(reset) {
      request.setAttribute("message", "Il suo account &egrave; stato resettato. Ricever&agrave; una mail con le informazioni per la riattivazione.");
    }
    else {
      request.setAttribute("message", "Il suo account <strong>NON</strong> &egrave; stato resettato. Contatti l'amministratore del sistema.");
    }
    
    RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.MESSAGE_PAGE);
    requestDispatcher.forward(request, response);
  }
}
