package org.dew.webapp.web;

import java.security.Principal;

import javax.servlet.ServletException;

import org.dew.webapp.bl.User;
import org.dew.webapp.ws.WSImport;
import org.dew.webapp.ws.WSUtenti;

public 
class WebRPC extends org.rpc.server.RpcServlet
{
  private static final long serialVersionUID = 3539677918763518311L;
  
  @Override
  public 
  void init() 
    throws ServletException 
  {
    rpcExecutor = new org.rpc.server.MultiRpcExecutor();
    
    restAudit  = null;
    restTracer = null;
    
    legacy           = false;
    createRpcContex  = true;
    checkSession     = true;
    checkSessionREST = true;
    restful          = true;
    about            = true;
    
    basicAuth        = true;
    
    sPAR_SESSION_CHECK = "user";
    
    // Gestione
    addWebService(new WSUtenti(),    "UTENTI",    "Gestione utenti");
    addWebService(new WSImport(),    "IMPORT",    "Gestione file da importare");
  }
  
  @Override
  protected
  Principal checkToken(String token)
  {
    if(token != null && token.equals("public")) {
      return new User("public");
    }
    User user = null;
    try {
      user = WSUtenti.checkTokenId(token);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    return user;
  }
  
  @Override
  protected
  Principal authenticate(String username, String password)
  {
    if(username != null && username.equals("public")) {
      return new User("public");
    }
    User user = null;
    try {
      user = WSUtenti.login(username, password);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    return user;
  }
}
