package org.dew.webapp.web;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import java.sql.Connection;

import java.util.Iterator;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.PropertyConfigurator;

import org.dew.webapp.util.App;
import org.dew.webapp.util.ConnectionManager;
import org.dew.webapp.util.Maintenance;

public
class InitBackEnd extends HttpServlet
{
  private static final long serialVersionUID = -1817573144179976478L;
  
  private final static String LOGGER_CFG = "logger.cfg";
  
  private Properties loggerCfg;
  private String checkInit;
  
  public
  void init()
    throws ServletException
  {
    if(App.LOG_FOLDER != null && App.LOG_FOLDER.length() > 0) {
      try {
        File logFolder = new File(App.LOG_FOLDER);
        if(!logFolder.exists()) {
          logFolder.mkdirs();
        }
      }
      catch(Exception ex) {
        System.out.println("Exception in mkdirs " + App.LOG_FOLDER);
      }
    }
    
    try {
      InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(LOGGER_CFG);
      if(is != null) {
        loggerCfg = new Properties();
        loggerCfg.load(is);
        changeLogFilePath(loggerCfg);
        PropertyConfigurator.configure(loggerCfg);
        
        checkInit = "OK";
      }
    }
    catch (IOException ex) {
      checkInit = ex.toString();
    }
    
    Maintenance.createAppConfig(false);
  }
  
  protected
  void changeLogFilePath(Properties properties)
  {
    if(properties == null) return;
    
    Iterator<Object> iterator = properties.keySet().iterator();
    while(iterator.hasNext()){
      String sKey = iterator.next().toString();
      String sValue = properties.getProperty(sKey);
      if(sKey.endsWith(".File") && sValue != null) {
        if(!sValue.startsWith(".") && !sValue.startsWith("/")) {
          properties.put(sKey, App.LOG_FOLDER + File.separator + sValue);
        }
      }
    }
  }
  
  public
  void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    String checkConn = "OK";
    try {
      checkConnection();
    }
    catch(Exception ex) {
      checkConn = ex.toString();
      checkConn += "<br>";
      checkConn += "if server run on a developer environment set VM parameter: <i>-Dondebug=1</i>";
    }
    
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    out.println("<html>");
    out.println("<head><title>" + App.getAppName() + " " + App.getAppVersion() + "</title></head>");
    out.println("<body>");
    out.println("<b>Logger initialization: " + checkInit + "</b>");
    out.println("<br><br>");
    out.println("<b>Configuration: " + App.getResultLoading() + "</b>");
    out.println("<br><br>");
    out.println("<b>Check DBMS Connection: " + checkConn + "</b>");
    out.println("<br><br>");
    out.println("</body>");
    out.println("</html>");
  }
  
  public
  void destroy()
  {
  }
  
  public
  void checkConnection()
    throws Exception
  {
    Connection conn = ConnectionManager.getDefaultConnection();
    
    conn.close();
  }
}
