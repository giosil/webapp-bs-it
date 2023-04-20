package org.dew.webapp.wui;

public 
class PublicMenuManager
{
  protected static AMenuManager m;
  
  public static
  AMenuManager getMenuManagerInstance()
  {
    if(m != null) return m;
    
    m = new TopMenuManager();
    
    m.addMenuItem(new MenuItem("home",     "Home",    null, "index.jsp"));
    m.addMenuItem(new MenuItem("services", "Servizi", null, "page_services.jsp"));
    
    return m;
  }
}