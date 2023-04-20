package org.dew.webapp.wui;

import org.dew.webapp.bl.User;

public 
interface IUserMenuManager 
{
  public AMenuManager createMenuManager(User user);
}
