package org.dew.webapp.wui;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

public 
class TopMenuManager extends AMenuManager 
{
  private static final long serialVersionUID = 9190327418214366710L;
  
  @Override
  public String build(HttpServletRequest request) 
  {
    StringBuilder sb = new StringBuilder(350 + 100 * mapItems.size());
    
    String sRequestURI = request.getRequestURI();
    String sParamMenu  = request.getParameter("m");
    
    sb.append("<div id=\"main-menu\" class=\"it-header-navbar-wrapper\">");
    sb.append("<nav class=\"menu-main\" role=\"navigation\">");
    sb.append("<div class=\"container\">");
    sb.append("<div class=\"row\">");
    sb.append("<div class=\"col-12\">");
    sb.append("<input type=\"checkbox\" id=\"show-menu-main\" role=\"button\">");
    sb.append("<label for=\"show-menu-main\" class=\"show-menu-main\">Menu</label>");
    sb.append("<ul id=\"menu-main-menu\" class=\"nav\">");
    List<MenuItem> listMainMenu = getMainMenu();
    if (listMainMenu != null && listMainMenu.size() > 0) {
      for (int i = 0; i < listMainMenu.size(); i++) {
        MenuItem menuItem = listMainMenu.get(i);
        if (menuItem == null) continue;
        
        String sText = menuItem.getText();
        if (sText == null || sText.length() == 0) {
          sText = menuItem.getId();
        }
        String sLink = menuItem.getLink();
        if (sLink == null || sLink.length() == 0) {
          sLink = "#";
        }
        
        StringBuilder sbc = null;
        List<MenuItem> listChildren = getChildren(menuItem);
        if (listChildren != null && listChildren.size() > 0) {
          sbc = new StringBuilder(75 * listChildren.size());
          sbc.append("<li class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children\">");
          sbc.append("<a href=\"" + sLink + "\">" + sText + "</a>");
          sbc.append("<ul class=\"sub-menu\">");
          for (int j = 0; j < listChildren.size(); j++) {
            MenuItem menuItemChild = listChildren.get(j);
            if (menuItemChild == null) continue;
            
            String sTextChild = menuItemChild.getText();
            if (sTextChild == null || sTextChild.length() == 0) {
              sTextChild = menuItemChild.getId();
            }
            String sLinkChild = menuItemChild.getLink();
            if (sLinkChild == null || sLinkChild.length() == 0) {
              sLinkChild = "#";
            }
            
            boolean boMatch = menuItemChild.matchLink(sRequestURI, sParamMenu);
            if (boMatch) {
              menuItemChild.setActive(true);
            }
            else {
              menuItemChild.setActive(false);
            }
            
            sbc.append("<li class=\"menu-item menu-item-type-post_type menu-item-object-page\">");
            sbc.append("<a href=\"" + sLinkChild + "\">" + sTextChild + "</a>");
            sbc.append("</li>");
          }
          sbc.append("</ul>");
          sbc.append("</li>");
        } else {
          sbc = new StringBuilder(120);
          sbc.append("<li class=\"menu-item menu-item-type-post_type menu-item-object-page\">");
          sbc.append("<a href=\"" + sLink + "\">" + sText + "</a>");
          sbc.append("</li>");
        }
        sb.append(sbc.toString());
      }
    }
    sb.append("</ul>");
    sb.append("</div>");
    sb.append("</div>");
    sb.append("</div>");
    sb.append("</nav>");
    sb.append("</div>");
    return sb.toString();
  }
  
  @Override
  public 
  String buildSubMenu(HttpServletRequest request)
  {
    // Non vi sono sottemnu separati da quello principale (gerarchico).
    return "";
  }
  
  @Override
  public 
  List<MenuItem> getBreadcrumb(HttpServletRequest request) 
  {
    List<MenuItem> listResult = new ArrayList<MenuItem>(2);
    
    String sRequestURI = request.getRequestURI();
    MenuItem menuItem = getMenuItemByLink(sRequestURI);
    if (menuItem == null) return listResult;
    
    MenuItem menuItemPar = null;
    String sParentId = menuItem.getParent();
    if (sParentId != null && sParentId.length() > 0) {
      menuItemPar = getMenuItemById(sParentId);
    }
    if (menuItemPar != null) {
      listResult.add(menuItemPar);
    }
    listResult.add(menuItem);
    return listResult;
  }
}