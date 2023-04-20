package org.dew.webapp.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dew.webapp.ws.WSImport;

public 
class WebAttachment extends HttpServlet 
{
  private static final long serialVersionUID = 9185010054882118133L;
  
  public 
  void doPost(HttpServletRequest request, HttpServletResponse response) 
    throws ServletException, IOException 
  {
    doGet(request, response);
  }
  
  public 
  void doGet(HttpServletRequest request, HttpServletResponse response) 
    throws ServletException, IOException 
  {
    String pathInfo = request.getPathInfo();
    String fileName = getFileName(pathInfo);
    
    if(fileName == null || fileName.length() == 0) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    File file = new File(WSImport.FOLDER_ATTACHMENTS + File.separator + fileName);
    if(!file.exists()) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    response.setContentLength((int)file.length());
    response.setContentType(getContentType(file));
    ServletOutputStream servletOutputStream = response.getOutputStream();
    FileInputStream fis = null;
    try {
      fis = new FileInputStream(file);
      int read = 0;
      byte[] abBuffer = new byte[1024];
      while ((read = fis.read(abBuffer)) > 0) {
        servletOutputStream.write(abBuffer, 0, read);
      }
    }
    finally {
      if(fis != null) try { fis.close(); } catch(Exception ex) {}
    }
  }
  
  protected static 
  String getFileName(String pathInfo) 
  {
    if(pathInfo == null || pathInfo.length() == 0) {
      return null;
    }
    String result = null;
    if (pathInfo.charAt(0) == '/') {
      pathInfo = pathInfo.substring(1); 
    }
    int iBegin = pathInfo.indexOf('/');
    if (iBegin < 0) {
      result = pathInfo;
    } 
    else {
      result = pathInfo.substring(0, iBegin);
    }
    return result;
  }
  
  public static
  String getContentType(File file)
  {
    if(file == null) return "text/plain";
    String fileName = file.getName();
    if(fileName == null || fileName.length() == 0) {
      return "text/plain";
    }
    String result = URLConnection.guessContentTypeFromName(fileName);
    if(result != null && result.length() > 0) {
      return result;
    }
    return "text/plain";
  }
}
