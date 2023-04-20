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
import org.dew.webapp.ws.WSUtenti;

public 
class WebActivate extends HttpServlet 
{
  private static final long serialVersionUID = -370639966308786089L;
  
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
    String code = request.getParameter("code");
    request.setAttribute("code", code);
    
    if(code == null || code.length() == 0) {
      request.setAttribute("message", "Codice di attivazione non specificato.");
    }
    else {
      User user = null;
      try {
        user = WSUtenti.activate(code);
      }
      catch(Exception ex) {
        request.setAttribute("message", "Si &egrave; verificato un errore: " + ex);
      }
      if(user == null) {
        request.setAttribute("message", "Codice di attivazione non valido.");
      }
      else {
        String tokenId = user.getTokenId();
        
        if(tokenId != null && tokenId.length() >= 0) {
          WebUtil.login(request, response, user);
        }
        else {
          request.setAttribute("message", "Account gi&agrave; attivato. Cliccare su Accedi per accedere alla piattaforma.");
        }
      }
    }
    
    RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.ACTIVATE_PAGE);
    requestDispatcher.forward(request, response);
  }
}
