package org.dew.webapp.util;

import java.io.IOException;
import java.io.Writer;

import java.lang.reflect.Method;

import java.security.Principal;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.rpc.util.Base64Coder;
import org.rpc.util.RPCContext;

import org.util.WUtil;

import org.dew.webapp.bl.User;
import org.dew.webapp.ws.WSUtenti;

import org.dew.webapp.wui.AMenuManager;
import org.dew.webapp.wui.IUserMenuManager;
import org.dew.webapp.wui.PublicMenuManager;
import org.dew.webapp.wui.UserMenuManager;

public 
class WebUtil 
{
  public static final String REMEMBER_ME_COOKIE = "REMEMBER_ME_COOKIE";
  
  public static 
  User login(HttpServletRequest request, HttpServletResponse response) 
  {
    User user = null;
    
    String rememberCode = getCookieValue(request, REMEMBER_ME_COOKIE);
    if(rememberCode != null && rememberCode.length() > 0) {
      try {
        user = login(rememberCode);
      }
      catch(Exception ex) {
        request.setAttribute("message",  "Servizio non disponibile");
        return null;
      }
      
      if (user != null) {
        login(request, response, user);
        
        return user;
      } 
    }
    
    String remember = request.getParameter("remember");
    
    String[] credentials = getCredentials(request);
    String sUsername = credentials[0];
    String sPassword = credentials[1];
    
    if(sUsername == null || sUsername.length() == 0) {
      if(sPassword == null || sPassword.length() == 0) {
        return null;
      }
      else {
        request.setAttribute("message", "Utente non specificato");
        return null;
      }
    }
    else if(sPassword == null || sPassword.length() == 0) {
      request.setAttribute("message", "Password non digitata");
      return null;
    }
    
    // Login
    try {
      user = login(sUsername, sPassword, WUtil.toBoolean(remember, false));
    }
    catch(Exception ex) {
      request.setAttribute("username", sUsername);
      request.setAttribute("message",  "Servizio non disponibile");
      return null;
    }
    
    if (user != null) {
      login(request, response, user);
    } 
    else {
      request.setAttribute("username", sUsername);
      request.setAttribute("message",  "Utente non riconosciuto");
    }
    
    return user;
  }
  
  public static 
  User login(String sUsername, String sPassword)
    throws Exception
  {
    return WSUtenti.login(sUsername, sPassword);
  }
  
  public static 
  User login(String sUsername, String sPassword, boolean remember) 
    throws Exception
  {
    return WSUtenti.login(sUsername, sPassword, remember);
  }
  
  public static 
  User login(String sRememberCode) 
    throws Exception
  {
    return WSUtenti.login(sRememberCode);
  }
  
  public static 
  User login(HttpServletRequest request, HttpServletResponse response, User user) 
  {
    if(user == null) return null;
    
    HttpSession httpSession = request.getSession(true);
    httpSession.setAttribute("user", user);
    
    IUserMenuManager userMenuManager = new UserMenuManager();
    if (userMenuManager != null) {
      AMenuManager menuManager = userMenuManager.createMenuManager(user);
      if (menuManager != null) {
        httpSession.setAttribute("menu", menuManager);
      }
    }
    
    String rememberCode = user.getRememberCode();
    if(rememberCode != null && rememberCode.length() > 0 && response != null) {
      Cookie rememberCookie = new Cookie(REMEMBER_ME_COOKIE, rememberCode);
      rememberCookie.setMaxAge(60 * 60 * 24); // A day
      response.addCookie(rememberCookie);
    }
    
    return user;
  }
  
  public static 
  String[] getCredentials(HttpServletRequest request) 
  {
    // From parameters
    String sUsername = request.getParameter("j_username");
    if(sUsername == null || sUsername.length() == 0) {
      sUsername = request.getParameter("username");
    }
    String sPassword = request.getParameter("j_password");
    if(sPassword == null || sPassword.length() == 0) {
      sPassword = request.getParameter("password");
    }
    if(sUsername == null || sUsername.length() == 0) {
      // From header (Basic Authentication)
      final String sAuthorization = request.getHeader("Authorization");
      if(sAuthorization != null && sAuthorization.length() > 8) {
        try{
          String sCredentials = Base64Coder.decodeString(sAuthorization.substring(6));
          int iSep = sCredentials.indexOf(':');
          if(iSep > 0) {
            sUsername = sCredentials.substring(0,iSep);
            sPassword = sCredentials.substring(iSep+1);
          }
        }
        catch(Exception ex) {
          System.err.println("Exception in WebUtil.getCredentials(request): " + ex);
        }
      }
    }
    return new String[] { sUsername, sPassword };
  }
  
  public static 
  User getUser(HttpServletRequest request) 
  {
    if (request == null) return null;
    User user = null;
    HttpSession httpSession = request.getSession();
    if (httpSession != null) {
      Object oUser = httpSession.getAttribute("user");
      if (oUser instanceof User) {
        user = (User) oUser;
      }
    }
    if (user == null) {
      try {
        Principal userPrincipal = request.getUserPrincipal();
        if (userPrincipal != null) {
          if (userPrincipal instanceof User) {
            user = (User) userPrincipal;
          }
          else {
            user = new User(userPrincipal.getName());
          }
        }
      }
      catch (Exception ex) {
        ex.printStackTrace();
      }
    }
    if (user == null) {
      Principal userPrincipal = RPCContext.getUserPrincipal();
      if (userPrincipal != null) {
        if (userPrincipal instanceof User) {
          user = (User) userPrincipal;
        }
        else {
          user = new User(userPrincipal.getName());
        }
      }
    }
    if (user != null) {
      String sLogout = request.getParameter("logout");
      if (sLogout != null && sLogout.equals("1")) {
        logout(request, null);
        return null;
      }
    }
    return user;
  }
  
  public static 
  String getCookieValue(HttpServletRequest request, String name) 
  {
    if(request == null || name == null) return null;
    
    Cookie[] arrayOfCookie = request.getCookies();
    if(arrayOfCookie == null || arrayOfCookie.length == 0) {
      return null;
    }
    for(int i = 0; i < arrayOfCookie.length; i++) {
      Cookie cookie = arrayOfCookie[i];
      String cookieName = cookie.getName();
      if(cookieName != null && cookieName.equals(name)) {
        return cookie.getValue();
      }
    }
    
    return null;
  }
  
  public static 
  User checkUser(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException 
  {
    if (request == null) return null;
    
    User user = null;
    HttpSession httpSession = request.getSession();
    if (httpSession != null) {
      Object oUser = httpSession.getAttribute("user");
      if (oUser instanceof User) {
        user = (User) oUser;
      }
    }
    if (user == null) {
      try {
        Principal userPrincipal = request.getUserPrincipal();
        if (userPrincipal instanceof User) {
          user = (User) userPrincipal;
        }
        else if (userPrincipal != null) {
          user = new User(userPrincipal.getName());
        }
      } 
      catch (Exception ex) {
        ex.printStackTrace();
      }
    }
    if (user == null) {
      RequestDispatcher requestDispatcher = request.getRequestDispatcher("/" + App.LOGOUT_PAGE);
      requestDispatcher.forward(request, response);
    }
    return user;
  }
  
  public static 
  boolean checkUserRoleAdmin(HttpServletRequest request)
    throws ServletException, IOException 
  {
    return checkUserRole(request, "admin");
  }
  
  public static 
  boolean checkUserRole(HttpServletRequest request, String role)
    throws ServletException, IOException 
  {
    User user = getUser(request);
    if(user == null) return false;
    String userRole = user.getRole();
    if(userRole == null || userRole.length() == 0) {
      if(role == null || role.length() == 0) {
        return true;
      }
      return false;
    }
    return userRole.equals(role);
  }
  
  public static 
  boolean logout(HttpServletRequest request, HttpServletResponse response) 
  {
    if(response != null) {
      // In caso di logout "esplicito" si rimuove il cookie di autologin (Ricordami)
      Cookie cookie = new Cookie(REMEMBER_ME_COOKIE, "");
      cookie.setMaxAge(0);
      response.addCookie(cookie);
    }
    
    // Metodo richiamato tramite invoke poiche' non disponibile in tutte le versioni JavaEE.
    boolean result = invoke(request, "logout");
    HttpSession httpSession = request.getSession();
    if (httpSession != null) {
      httpSession.invalidate();
    }
    return result;
  }
  
  public static 
  void writeUserInfo(HttpServletRequest request, Writer out) 
    throws ServletException, IOException 
  {
    User user = getUser(request);
    if (user == null) return;
    
    int structure = 0;
    List<Integer> structures = user.getStructures();
    if(structures != null && structures.size() == 1) {
      structure = structures.get(0);
    }
    
    String js = "<script>window._userLogged={";
    js += "userName:" + jsString(user.getUserName()) + ",";
    js += "tokenId: " + jsString(user.getTokenId())  + ",";
    js += "role:"     + jsString(user.getRole())     + ",";
    js += "email:"    + jsString(user.getEmail())    + ",";
    js += "mobile:"   + jsString(user.getMobile());
    if(structure != 0) {
      // Deve essere valorizzato solo in caso di unica struttura associata
      js += ",structure:" + structure;
    }
    js += "};</script>";
    out.write(js);
  }
  
  public static 
  void writeErrorMessage(HttpServletRequest request, Writer out, Object message) 
    throws ServletException, IOException 
  {
    String text = WUtil.toString(message, null);
    if(text == null || text.length() == 0) {
      return;
    }
    out.write("<p class=\"error\">" + text + "</p>");
  }
  
  public static
  void writeMenu(HttpServletRequest request, Writer out)
    throws ServletException, IOException 
  {
    if(out == null) return;
    AMenuManager menu = getMenu(request);
    if(menu == null) return;
    menu.write(request, out);
  }
  
  public static 
  AMenuManager getMenu(HttpServletRequest request) 
    throws ServletException, IOException 
  {
    if (request == null) return null;
    HttpSession httpSession = request.getSession();
    if (httpSession != null) {
      boolean refresh = WUtil.toBoolean(httpSession.getAttribute("refresh"), false);
      if (refresh) {
        httpSession.setAttribute("refresh", Boolean.FALSE);
        
        User user = null;
        Object menu = httpSession.getAttribute("menu");
        if (menu instanceof AMenuManager) {
          user = ((AMenuManager) menu).getUser();
        }
        else {
          user = getUser(request);
        }
        
        IUserMenuManager userMenuManager = new UserMenuManager();
        if (userMenuManager != null) {
          AMenuManager menuManager = userMenuManager.createMenuManager(user);
          if (menuManager != null) {
            httpSession.setAttribute("menu", menuManager);
            return menuManager;
          }
        }
      }
      
      Object menu = httpSession.getAttribute("menu");
      if (menu instanceof AMenuManager) {
        return (AMenuManager) menu;
      }
    }
    // Menu pubblico
    return PublicMenuManager.getMenuManagerInstance();
  }
  
  public static
  String getStringAttr(HttpServletRequest request, String name)
    throws ServletException, IOException 
  {
    if(request == null || name == null) return null;
    Object val = request.getAttribute(name);
    return WUtil.toString(val, null);
  }
  
  public static
  String getStringAttr(HttpServletRequest request, String name, String defaultValue)
    throws ServletException, IOException 
  {
    if(request == null || name == null) return defaultValue;
    Object val = request.getAttribute(name);
    return WUtil.toString(val, defaultValue);
  }
  
  public static 
  String jsString(Object value) 
  {
    if(value == null) return "''";
    String sValue = null;
    if(value instanceof Date) {
      sValue = WUtil.formatDate((Date) value, "IT");
    }
    else if(value instanceof Calendar) {
      sValue = WUtil.formatDate((Calendar) value, "IT");
    }
    else {
      sValue = value.toString();
    }
    if(sValue == null || sValue.length() == 0) return "''";
    return "'" + sValue.replace("'", "\\'") + "'";
  }
  
  public static 
  String jsDate(Date value) 
  {
    if(value == null) return "null";
    return "new Date('" + WUtil.formatDate(value, "-") + "')";
  }
  
  public static 
  String jsDate(Calendar value) 
  {
    if(value == null) return "null";
    return "new Date('" + WUtil.formatDate(value, "-") + "')";
  }
  
  public static 
  void writeScriptImport(Writer out, String scriptFile) 
    throws ServletException, IOException 
  {
    if(scriptFile == null || scriptFile.length() == 0) return;
    String html= "<script src=\"" + scriptFile + "?" + App.STARTUP_TIME + "\" type=\"text/javascript\"></script>";
    out.write(html);
  }
  
  public static 
  void writeScriptImport(Writer out, String scriptFile, String debugScriptFile, Object debugParam) 
    throws ServletException, IOException 
  {
    boolean debug = WUtil.toBoolean(debugParam, false);
    
    String html = null;
    if(debug) {
      if(debugScriptFile != null && debugScriptFile.length() > 0) {
        html = "<script src=\"" + debugScriptFile + "?" + App.STARTUP_TIME + "\" type=\"text/javascript\"></script>";
      }
      else if (scriptFile != null && scriptFile.length() > 0) {
        html = "<script src=\"" + scriptFile + "?" + App.STARTUP_TIME + "\" type=\"text/javascript\"></script>";
      }
      else {
        return;
      }
    }
    else {
      if (scriptFile != null && scriptFile.length() > 0) {
        html = "<script src=\"" + scriptFile + "?" + App.STARTUP_TIME + "\" type=\"text/javascript\"></script>";
      }
      else {
        return;
      }
    }
    out.write(html);
  }
  
  public static 
  void writeCSSImport(Writer out, String cssFile) 
    throws ServletException, IOException 
  {
    if(cssFile == null || cssFile.length() == 0) return;
    String html= "<link href=\"" + cssFile + "?" + App.STARTUP_TIME + "\" rel=\"stylesheet\">";
    out.write(html);
  }
  
  private static 
  boolean invoke(Object object, String methodName) 
  {
    boolean result = false;
    try {
      Method method = null;
      Method[] methods = object.getClass().getMethods();
      for (Method m : methods) {
        if (m.getName().equals(methodName)) {
          method = m;
          break;
        }
      }
      if (method != null) {
        method.invoke(object, new Object[0]);
        result = true;
      }
    } 
    catch (Throwable th) {
      th.printStackTrace();
    }
    return result;
  }
}
