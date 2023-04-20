package org.dew.webapp.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.util.WUtil;

public 
class App 
{
  public static long STARTUP_TIME = System.currentTimeMillis();
  
  public static String LOG_FOLDER = System.getProperty("user.home") + File.separator + "log";
  public static String CFG_FOLDER = System.getProperty("user.home") + File.separator + "cfg";
  public static String CFG_FILE   = CFG_FOLDER + File.separator + "webapp.cfg";
  
  public static Properties config = new Properties();
  
  private static boolean configFileLoaded = false;
  private static String resultLoading = "OK";
  
  public final static String CONF_MAIL_LOOKUP    = "mail.lookup";
  public final static String CONF_MAIL_SMTP      = "mail.smtp.host";
  public final static String CONF_MAIL_PORT      = "mail.smtp.port";
  public final static String CONF_MAIL_STLS      = "mail.smtp.starttls.enable";
  public final static String CONF_MAIL_FROM      = "mail.from";
  public final static String CONF_MAIL_USER      = "mail.user";
  public final static String CONF_MAIL_PASS      = "mail.password";
  public final static String CONF_MAIL_SMTP_AUTH = "mail.smtp.auth";
  
  public final static String CONF_URL_WEBAPP     = "app.url";
  
  public final static String DEFAULT_USER_ROLE   = "user";
  
  static {
    try {
      InputStream in = new FileInputStream(CFG_FILE);
      config = new Properties();
      config.load(in);
      in.close();
      configFileLoaded = true;
      resultLoading = "File " + CFG_FILE + " loaded.";
    }
    catch(FileNotFoundException ex) {
      resultLoading = "File " + CFG_FILE + " not found.";
    }
    catch(IOException ioex) {
      resultLoading = "IOException during load " + CFG_FILE + ": " + ioex;
    }
  }
  
  public static final String LOGIN_PAGE    = "login.jsp";
  public static final String LOGOUT_PAGE   = "logout.jsp";
  
  public static final String WELCOME_PAGE  = "page_welcome.jsp";
  public static final String MESSAGE_PAGE  = "page_message.jsp";
  public static final String ACTIVATE_PAGE = "page_activate.jsp";
  public static final String UPD_PASS_PAGE = "page_upd_pass.jsp";
  
  public static final String SIGNATURE     = "<p>Have fun,</p><p>&nbsp;</p><p><em>Staff dew</em></p>";
  
  public static final int MAX_ROWS = 1000;
  
  public static
  String getAppName()
  {
    return "Webapp";
  }
  
  public static
  String getBrandName()
  {
    return "Webapp";
  }
  
  public static
  String getBrandMotto()
  {
    return "a dew app";
  }
  
  public static
  String getAppVersion()
  {
    return "1.0";
  }
  
  public static
  void reloadConfig()
    throws Exception
  {
    Properties properties = new Properties();
    InputStream in = null;
    try {
      in = new FileInputStream(CFG_FILE);
      properties.load(in);
    }
    finally {
      in.close();
    }
    config = properties;
  }
  
  public static
  boolean isConfigFileLoaded()
  {
    return configFileLoaded;
  }
  
  public static
  String getResultLoading()
  {
    return resultLoading;
  }
  
  public static
  String getProperty(String key)
  {
    return config.getProperty(key);
  }
  
  public static
  String getProperty(String key, String defaultValue)
  {
    return config.getProperty(key, defaultValue);
  }
  
  public static
  Date getDateProperty(String key, Date defaultValue)
  {
    return WUtil.toDate(config.getProperty(key), defaultValue);
  }
  
  public static
  List<String> getListProperty(String key)
  {
    return WUtil.toListOfString(config.getProperty(key)); 
  }
  
  public static
  boolean getBooleanProperty(String key, boolean defaultValue)
  {
    return WUtil.toBoolean(config.getProperty(key), defaultValue);
  }
  
  public static
  int getIntProperty(String key, int defaultValue)
  {
    return WUtil.toInt(config.getProperty(key), defaultValue);
  }
  
  public static
  double getDoubleProperty(String key, double defaultValue)
  {
    return WUtil.toDouble(config.getProperty(key), defaultValue);
  }
  
  public static
  Properties loadProperties(String fileName)
    throws Exception
  {
    Properties result = new Properties();
    InputStream inputStream = null;
    try {
      inputStream = Thread.currentThread().getContextClassLoader().getResource(fileName).openStream();
      result.load(inputStream);
    }
    finally {
      if(inputStream != null) try { inputStream.close(); } catch(Exception ex) {}
    }
    return result;
  }
  
  public static
  String loadTextResource(String fileName)
    throws Exception
  {
    if(fileName == null || fileName.length() == 0) {
      return null;
    }
    int iFileSep = fileName.indexOf('/');
    if(iFileSep < 0) iFileSep = fileName.indexOf('\\');
    InputStream is = null;
    if(iFileSep < 0) {
      URL url = Thread.currentThread().getContextClassLoader().getResource(fileName);
      if(url == null) return null;
      is = url.openStream();
    }
    else {
      is = new FileInputStream(fileName);
    }
    try {
      int n;
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      byte[] buff = new byte[1024];
      while((n = is.read(buff)) > 0) baos.write(buff, 0, n);
      return new String(baos.toByteArray());
    }
    finally {
      if(is != null) try{ is.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  String getMailUser()
  {
    return config.getProperty(CONF_MAIL_USER);
  }
  
  public static
  String getMailPassword()
  {
    return config.getProperty(CONF_MAIL_PASS);
  }
  
  public static
  String getURLActivation(String code)
  {
    String result = config.getProperty(CONF_URL_WEBAPP);
    if(result == null || result.length() < 3) {
      result = "http://localhost:8080/webapp-bs-it/";
    }
    if(!result.endsWith("/")) result += "/";
    result += "activate";
    if(code != null && code.length() > 0) {
      result += "?code=" + code;
    }
    return result;
  }
  
  public static
  boolean validatePassword(String password)
  {
    if(password == null || password.length() < 8) {
      return false;
    }
    boolean atLeastADigit  = false;
    boolean atLeastALetter = false;
    boolean atLeastASymbol = false;
    for(int i = 0; i < password.length(); i++) {
      char c = password.charAt(i);
      if(Character.isDigit(c))  {
        atLeastADigit  = true;
      }
      else if(Character.isLetter(c)) {
        atLeastALetter = true;
      }
      else {
        atLeastASymbol = true;
      }
    }
    return atLeastADigit && atLeastALetter && atLeastASymbol;
  }
  
  public static 
  String buildHTMLEmail(String head, String body, String foot, String ltxt, String lurl) 
  {
    String result = null;
    try {
      if(ltxt != null && ltxt.length() > 0) {
        result = loadTextResource("template_email_link.html");
      }
      else {
        result = loadTextResource("template_email.html");
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    
    if(head == null) head = "";
    if(body == null) body = "";
    if(foot == null) foot = "";
    if(ltxt == null) ltxt = "";
    if(lurl == null) lurl = "";
    
    if(result == null || result.length() < 10) {
      // Implementazione di default
      StringBuilder sb = new StringBuilder();
      sb.append("<!DOCTYPE html><html><body>");
      sb.append("<h1>" + head + "</h1>");
      sb.append(body);
      if(ltxt != null && ltxt.length() > 0) {
        sb.append("<p>&nbsp;</p>");
        sb.append("<a href=\"" + lurl + "\">" + ltxt + "</a>");
      }
      sb.append("<p>&nbsp;</p>");
      sb.append(foot);
      sb.append("</body></html>");
      return sb.toString();
    }
    
    result = result.replace("[head]", head);
    result = result.replace("[body]", body);
    result = result.replace("[foot]", foot);
    result = result.replace("[ltxt]", ltxt);
    result = result.replace("[lurl]", lurl);
    return result;
  }
  
  public static 
  String buildActivateEmail(String code) 
  {
    String head = "Welcome,";
    String body = "<p>Lorem ipsum dolor sit amet...</p>";
    body += "<p>Click on:</p>";
    String foot = "<p>Have fun,</p><p><i>Staff</i></p>";
    
    return buildHTMLEmail(head, body, foot, "Attivazione account", getURLActivation(code));
  }
  
  public static 
  String buildActivateEmailAuto(String code) 
  {
    String head = "Welcome,";
    String body = "<p>Lorem ipsum dolor sit amet...</p>";
    
    String foot = "<p>Have fun,</p><p><i>Staff</i></p>";
    
    return buildHTMLEmail(head, body, foot, "Attivazione account", getURLActivation(code));
  }
  
  public static 
  String buildAlreadyRegisteredEmail() 
  {
    String head = "Welcome,";
    String body = "<p>Lorem ipsum dolor sit amet...</p>";
    
    String foot = "<p>Have fun,</p><p><i>Staff</i></p>";
    
    return buildHTMLEmail(head, body, foot, null, null);
  }
  
  public static 
  String buildResetPasswordEmail(String code) 
  {
    String head = "Reset,";
    String body = "<p>Lorem ipsum dolor sit amet...</p>";
    body += "<p>Click on:</p>";
    String foot = "<p>Have fun,</p><p><i>Staff</i></p>";
    
    return buildHTMLEmail(head, body, foot, "Imposta nuova password", getURLActivation(code));
  }
}
