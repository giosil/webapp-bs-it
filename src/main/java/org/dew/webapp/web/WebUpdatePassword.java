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
class WebUpdatePassword extends HttpServlet 
{
  private static final long serialVersionUID = 3582915268500151521L;
  
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
    String user = request.getParameter("user");
    String curr = request.getParameter("curr");
    String newp = request.getParameter("newp");
    String repp = request.getParameter("repp");
    String errm = null;
    
    if(!App.validatePassword(newp)) {
      errm = "Nuova password non valida. Deve essere di almeno 8 caratteri e contenere lettere, numeri e simboli.";
    }
    else if(repp == null || repp.length() == 0) {
      errm = "Controllo ripetizione password non immesso.";
    }
    else if(!newp.equals(repp)) {
      errm = "Controllo ripetizione password fallito. Verificare i dati immessi.";
    }
    else if(curr != null && curr.length() > 0 && curr.equals(newp)) {
      errm = "La nuova password non pu&ograve; essere uguale a quella corrente.";
    }
    else if(code != null && code.length() > 0) {
      
      try {
        boolean res = WSUtenti.updatePassword(code, newp);
        
        if(!res) errm = "Aggiornamento password non avvenuto. Verificare i dati immessi.";
      }
      catch(Exception ex) {
        errm = "Si &egrave; verificato un errore: " + ex;
      }
      
    }
    else if(user != null && user.length() > 0) {
      
      try {
        boolean res = WSUtenti.updatePassword(user, curr, newp);
        
        if(!res) errm = "Aggiornamento password non avvenuto. Verificare i dati immessi.";
      }
      catch(Exception ex) {
        errm = "Si &egrave; verificato un errore: " + ex;
      }
      
    }
    else {
      
      errm = "Aggiornamento password non avvenuto. Verificare attentamente i dati immessi.";
      
    }
    
    if(errm != null && errm.length() > 0) {
      request.setAttribute("message", errm);
      if(code != null && code.length() > 0) {
        request.setAttribute("code", code);
        
        RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.ACTIVATE_PAGE);
        requestDispatcher.forward(request, response);
      }
      else {
        
        RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.UPD_PASS_PAGE);
        requestDispatcher.forward(request, response);
      }
    }
    else {
      request.setAttribute("title",   "Aggiornamento password");
      request.setAttribute("message", "L'aggiornamento della password &egrave; avvenuto con successo.");
      request.setAttribute("text",    App.SIGNATURE);
      
      RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.MESSAGE_PAGE);
      requestDispatcher.forward(request, response);
    }
  }
}

