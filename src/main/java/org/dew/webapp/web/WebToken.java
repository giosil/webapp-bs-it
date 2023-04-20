package org.dew.webapp.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSON;

import org.dew.webapp.bl.User;

import org.dew.webapp.util.WebUtil;

public 
class WebToken extends HttpServlet 
{
  private static final long serialVersionUID = 2346574710451106261L;
  
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
    User user = WebUtil.login(request, response);
    
    Map<String, Object> mapResponse = new HashMap<String, Object>();
    
    String tokenId = user != null ? user.getTokenId() : null;
    
    if(tokenId != null && tokenId.length() > 0) {
      mapResponse.put("access_token", tokenId);
      mapResponse.put("token_type",   "bearer");
      mapResponse.put("expires_in",   43200); // 60 x 60 x 12 (seconds)
    }
    else {
      mapResponse.put("error",             "access_denied");
      mapResponse.put("error_description", "Access denied.");
    }
    
    String content = JSON.stringify(mapResponse);
    
    response.setContentType("application/json;charset=UTF-8");
    response.setContentLength(content.length());
    response.getWriter().println(content);
  }
}
