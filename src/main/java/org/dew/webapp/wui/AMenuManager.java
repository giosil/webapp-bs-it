package org.dew.webapp.wui;

import java.io.Serializable;
import java.io.Writer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.util.WUtil;

import org.dew.webapp.bl.User;

public abstract
class AMenuManager implements Serializable
{
  private static final long serialVersionUID = 8853759658171486886L;
  
  protected String title;
  protected String cached;
  protected User   user;
  protected Map<String,MenuItem>       mapItems = new HashMap<String,MenuItem>();
  protected Map<String,List<MenuItem>> mapMenu  = new HashMap<String,List<MenuItem>>();
  protected String prefixResources = "";
  
  public AMenuManager()
  {
  }
  
  public AMenuManager(String title)
  {
    this.title = title;
  }
  
  public String getTitle() {
    return title;
  }
  
  public void setTitle(String title) {
    this.title = title;
  }
  
  public User getUser() {
    return user;
  }
  
  public void setUser(User user) {
    this.user = user;
  }
  
  public String getPrefixResources() {
    return prefixResources;
  }
  
  public void setPrefixResources(String prefixResources) {
    this.prefixResources = prefixResources;
  }
  
  public void setMenuItems(List<MenuItem> menuItems) {
    clear();
    if(menuItems == null || menuItems.size() == 0) {
      return;
    }
    for(int i = 0; i < menuItems.size(); i++) {
      MenuItem menuItem = menuItems.get(i);
      if(menuItem == null) continue;
      addMenuItem(menuItem);
    }
  }
  
  public MenuItem getMenuItemById(String id) {
    if(id == null || id.length() == 0) return null;
    if(mapItems == null || mapItems.isEmpty()) return null;
    return mapItems.get(id);
  }
  
  public MenuItem getMenuItemByLink(String link) {
    if(link == null || link.length() == 0) return null;
    if(mapItems == null || mapItems.isEmpty()) return null;
    Iterator<MenuItem> iterator = mapItems.values().iterator();
    while(iterator.hasNext()) {
      MenuItem menuItem = iterator.next();
      if(menuItem.matchLink(link,null)) {
        return menuItem;
      }
    }
    return null;
  }
  
  public List<MenuItem> search(String sText) {
    List<MenuItem> listResult = new ArrayList<MenuItem>();
    if(sText == null || sText.length() == 0) return listResult;
    String sTextLC = sText.toLowerCase();
    Iterator<MenuItem> iterator = mapItems.values().iterator();
    while(iterator.hasNext()) {
      MenuItem menuItem = iterator.next();
      String sMenuItemId   = menuItem.getId();
      String sMenuItemText = menuItem.getText();
      String sItemTextLC   = (sMenuItemId + "|" + sMenuItemText).toLowerCase();
      if(sItemTextLC.indexOf(sTextLC) >= 0) {
        listResult.add(menuItem);
      }
    }
    return listResult;
  }
  
  public void addMenuItem(MenuItem menuItem) {
    this.cached = null;
    if(menuItem == null) return;
    String sId = menuItem.getId();
    if(sId == null || sId.length() == 0) return;
    
    boolean enabled = false;
    if(user != null) {
      boolean boFoundChildren = false;
      boolean boAllChildrenDisabled = true;
      Map<String,Object> resources = user.getResources();
      if(resources != null && resources.size() > 0) {
        enabled = false;
        if(prefixResources == null) prefixResources = "";
        Iterator<String> iteratorKeys = resources.keySet().iterator();
        while(iteratorKeys.hasNext()) {
          String key = iteratorKeys.next();
          if(key.equals(prefixResources + sId)) {
            enabled = WUtil.toBoolean(resources.get(key), false);
            break;
          }
          if(key.startsWith(prefixResources + sId + ".")) {
            enabled = true;
            boFoundChildren = true;
            boolean itemEnabled = WUtil.toBoolean(resources.get(key), false);
            if(itemEnabled) {
              boAllChildrenDisabled = false;
            }
          }
        }
      }
      else {
        enabled = true;
      }
      if(boFoundChildren && boAllChildrenDisabled) {
        enabled = false;
      }
    }
    else {
      enabled = true;
    }
    if(!enabled) return;
    
    String sParent = menuItem.getParent();
    if(sParent == null || sParent.length() == 0) {
      sParent = ".";
    }
    if(mapMenu == null) {
      mapMenu = new HashMap<String,List<MenuItem>>(); 
    }
    if(mapItems == null) {
      mapItems = new HashMap<String,MenuItem>(); 
    }
    mapItems.put(sId, menuItem);
    List<MenuItem> listOfMenuItem = mapMenu.get(sParent);
    if(listOfMenuItem == null) {
      listOfMenuItem = new ArrayList<MenuItem>();
      mapMenu.put(sParent, listOfMenuItem);
    }
    listOfMenuItem.add(menuItem);
  }
  
  public void clear() {
    if(mapItems == null) {
      mapItems = new HashMap<String,MenuItem>(); 
    }
    else {
      mapItems.clear();
    }    
    if(mapMenu == null) {
      mapMenu = new HashMap<String,List<MenuItem>>(); 
    }
    else {
      mapMenu.clear();
    }
    this.cached = null;
  }
  
  public void clearCache() {
    this.cached = null;
  }
  
  public List<MenuItem> getMainMenu() {
    if(mapMenu == null || mapMenu.size() == 0) {
      return new ArrayList<MenuItem>();
    }
    List<MenuItem> listResult = mapMenu.get(".");
    if(listResult != null) {
      return listResult;
    }
    Iterator<String> iterator = mapMenu.keySet().iterator();
    while(iterator.hasNext()) {
      String key = iterator.next();
      listResult = mapMenu.get(key);
      if(listResult != null) {
        return listResult;
      }
    }
    return new ArrayList<MenuItem>();
  }
  
  public List<MenuItem> getChildren(MenuItem menuItem) {
    if(menuItem == null) {
      return new ArrayList<MenuItem>();
    }
    String sId = menuItem.getId();
    if(sId == null || sId.length() == 0) {
      sId = ".";
    }
    List<MenuItem> listResult = mapMenu.get(sId);
    if(listResult != null) {
      return listResult;
    }
    return new ArrayList<MenuItem>();
  }
  
  public void write(HttpServletRequest request, Writer out) {
    if(out == null) return;
    String menu = build(request);
    if(menu == null || menu.length() == 0) return;
    try {
      out.write(menu);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
  }
  
  public abstract String build(HttpServletRequest request);
  
  public abstract String buildSubMenu(HttpServletRequest request);
  
  public abstract List<MenuItem> getBreadcrumb(HttpServletRequest request);
  
  public String getBodyClass() {
    return "";
  }
  
  @Override
  public boolean equals(Object object) {
    if(object instanceof AMenuManager) {
      String sTitle = ((AMenuManager) object).getTitle();
      if(sTitle == null && title == null) return true;
      return sTitle.equals(title);
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if(title == null) return 0;
    return title.hashCode();
  }
  
  @Override
  public String toString() {
    return "AMenuManager(" + title + ")";
  }
}
