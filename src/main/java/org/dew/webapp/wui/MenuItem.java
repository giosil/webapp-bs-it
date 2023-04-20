package org.dew.webapp.wui;

import java.io.Serializable;

public 
class MenuItem implements Serializable
{
  private static final long serialVersionUID = 8958444513246704172L;
  
  private String id;
  private String text;
  private String icon;
  private String link;
  private String parent;
  private boolean enabled;
  private boolean active;
  
  public MenuItem()
  {
  }
  
  public MenuItem(String id, String text, String icon)
  {
    this.id     = id;
    this.text   = text;
    this.icon   = icon;
  }
  
  public MenuItem(String id, String text, String icon, String link)
  {
    this.id     = id;
    this.text   = text;
    this.icon   = icon;
    this.link   = link;
  }
  
  public MenuItem(String id, String text, String icon, String link, String parent)
  {
    this.id     = id;
    this.text   = text;
    this.icon   = icon;
    this.link   = link;
    this.parent = parent;
  }
  
  public String getId() {
    return id;
  }
  
  public void setId(String id) {
    this.id = id;
  }
  
  public String getText() {
    return text;
  }
  
  public void setText(String text) {
    this.text = text;
  }
  
  public String getIcon() {
    return icon;
  }
  
  public void setIcon(String icon) {
    this.icon = icon;
  }
  
  public String getLink() {
    return link;
  }
  
  public void setLink(String link) {
    this.link = link;
  }
  
  public String getParent() {
    return parent;
  }
  
  public void setParent(String parent) {
    this.parent = parent;
  }
  
  public boolean isEnabled() {
    return enabled;
  }
  
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
  
  public boolean isActive() {
    return active;
  }
  
  public void setActive(boolean active) {
    this.active = active;
  }
  
  public boolean matchLink(String sURI, String sParamMenu) {
    if(sURI == null || sURI.length() == 0) {
      return false;
    }
    if(link == null || link.length() == 0) {
      return false;
    }
    int iSep = link.indexOf('/');
    if(iSep >= 0) {
      return sURI.endsWith(link);
    }
    boolean boResult = sURI.endsWith("/" + link);
    if(!boResult && sParamMenu != null && sParamMenu.length() > 0) {
      return link.startsWith(sParamMenu + ".");
    }
    return boResult;
  }
  
  @Override
  public boolean equals(Object object) {
    if(object instanceof MenuItem) {
      String sId = ((MenuItem) object).getId();
      if(sId == null && id == null) return true;
      return sId.equals(id);
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if(id == null) return 0;
    return id.hashCode();
  }
  
  @Override
  public String toString() {
    return "MenuItem(" + id + ")";
  }
}
