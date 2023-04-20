package org.dew.webapp.web;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.dew.webapp.bl.User;

import org.dew.webapp.ws.WSUtenti;

public
class SessionListener implements HttpSessionListener, HttpSessionAttributeListener
{
  public
  void sessionCreated(HttpSessionEvent httpSessionEvent)
  {
  }
  
  public
  void sessionDestroyed(HttpSessionEvent httpSessionEvent)
  {
    HttpSession httpSession = httpSessionEvent.getSession();
    if(httpSession == null) return;
    
    Object user = httpSession.getAttribute("user");
    if(user instanceof User) {
      WSUtenti.logout((User) user);
    }
  }
  
  public
  void attributeAdded(HttpSessionBindingEvent httpSessionBindingEvent)
  {
  }
  
  public
  void attributeRemoved(HttpSessionBindingEvent httpSessionBindingEvent)
  {
  }
  
  public
  void attributeReplaced(HttpSessionBindingEvent httpSessionBindingEvent)
  {
  }
}

