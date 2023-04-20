package org.dew.webapp.wui;

import org.dew.webapp.bl.User;

public 
class UserMenuManager implements IUserMenuManager
{
  public
  AMenuManager createMenuManager(User user) 
  {
    if(user == null) {
      return PublicMenuManager.getMenuManagerInstance();
    }
    
    String role = user.getRole();
    if(role == null) role = "";
    
    AMenuManager m = new TopMenuManager();
    m.setUser(user);
    
    m.addMenuItem(new MenuItem("profilo",                  "Gestione Profilo",      null, null));
    m.addMenuItem(new MenuItem("profilo.upd_pass",         "Cambio Password",       null, "page_upd_pass.jsp",       "profilo"));
    m.addMenuItem(new MenuItem("profilo.profilo",          "Profilo",               null, "page_profile.jsp",        "profilo"));
    
    if(role.equalsIgnoreCase("admin")) {
      m.addMenuItem(new MenuItem("admin",                 "Amministrazione",        null,                            null));
      m.addMenuItem(new MenuItem("admin.utenti",          "Utenti",                 null, "admin_utenti.jsp",        "admin"));
    }
    
    return m;
  }
}