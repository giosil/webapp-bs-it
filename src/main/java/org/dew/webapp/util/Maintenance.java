package org.dew.webapp.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

public 
class Maintenance 
{
  public static final int CONF_PROFILE_0 = 0;
  public static final int CONF_PROFILE_1 = 1;
  
  public static int CONF_PROFILE = CONF_PROFILE_1;
  
  public static
  void main(String[] args)
  {
    try {
      System.out.println("Maintenance...");
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    System.out.println("End.");
  }
  
  public static 
  boolean createAppConfig(boolean replace) 
  {
    if(App.CFG_FOLDER == null || App.CFG_FOLDER.length() == 0) {
      return false;
    }
    if(!App.CFG_FOLDER.startsWith("/")) {
      return false;
    }
    
    File cfgFile = new File(App.CFG_FILE);
    if(cfgFile.exists()) {
      if(replace) {
        cfgFile.delete();
      }
      else {
        return false;
      }
    }
    
    File cfgDir = new File(App.CFG_FOLDER);
    if(!cfgDir.exists()) {
      cfgDir.mkdirs();
    }
    
    String config = "# Configurazione generale\n\n";
    config += App.CONF_URL_WEBAPP     + " = http://localhost:8080/webapp-bs-it/\n";
    config += "\n";
    config += "# Configurazione mail manager\n\n";
    if(CONF_PROFILE == CONF_PROFILE_1) {
      config += App.CONF_MAIL_SMTP      + " = smtp.yyyy.zzz\n";
      config += App.CONF_MAIL_PORT      + " = 587\n";
      config += App.CONF_MAIL_FROM      + " = xxxxxxx@yyyy.zzz\n";
      config += App.CONF_MAIL_USER      + " = xxxxxxx@yyyy.zzz\n";
      config += App.CONF_MAIL_PASS      + " = xxxxxxx\n";
      config += App.CONF_MAIL_SMTP_AUTH + " = true\n";
      config += App.CONF_MAIL_STLS      + " = true\n";
    }
    else {
      config += App.CONF_MAIL_SMTP      + " = smtp.yyyy.zzz\n";
      config += App.CONF_MAIL_PORT      + " = 587\n";
      config += App.CONF_MAIL_FROM      + " = kkkkkkk@yyyy.zzz\n";
      config += App.CONF_MAIL_USER      + " = kkkkkkk@yyyy.zzz\n";
      config += App.CONF_MAIL_PASS      + " = kkkkkkk\n";
      config += App.CONF_MAIL_SMTP_AUTH + " = true\n";
      config += App.CONF_MAIL_STLS      + " = true\n";
    }
    
    // Configurazione BMTI
    config += "\n";
    
    boolean result = false;
    try {
      saveContent(config, App.CFG_FILE);
      result = true;
    }
    catch(Exception ex) {
      ex.printStackTrace();
      return false;
    }
    return result;
  }
  
  public static 
  boolean replaceASIndex() 
  {
    File index = new File("/opt/wildfly/welcome-content/index.html");
    if(!index.exists()) return false;
    
    index.delete();
    
    String filePath = index.getAbsolutePath();
    
    String page = "<!DOCTYPE html><html><head><meta http-equiv=\"refresh\" content=\"0; URL=http://localhost:8080/webapp-bs-it\" /></head><body></body></html>";
    
    boolean result = false;
    try {
      saveContent(page, filePath);
      result = true;
    }
    catch(Exception ex) {
      ex.printStackTrace();
      return false;
    }
    return result;
  }
  
  public static 
  boolean move(String filePathSrc, String filePathDst, boolean checkExistsDst) 
  {
    if(filePathSrc == null || filePathSrc.length() == 0) {
      return false;
    }
    if(filePathDst == null || filePathDst.length() == 0) {
      return false;
    }
    File fileSrc = new File(filePathSrc);
    if(!fileSrc.exists()) {
      return false;
    }
    File fileDst = new File(filePathDst);
    if(checkExistsDst) {
      if(fileDst.exists()) {
        return false;
      }
    }
    return fileSrc.renameTo(fileDst);
  }
  
  public static
  byte[] readFile(String filePath)
    throws Exception
  {
    if(filePath == null || filePath.length() == 0) {
      return null;
    }
    File file = new File(filePath);
    if(!file.exists()) {
      return null;
    }
    InputStream is = null;
    try {
      is = new FileInputStream(file);
      int n;
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      byte[] buff = new byte[1024];
      while((n = is.read(buff)) > 0) baos.write(buff, 0, n);
      return baos.toByteArray();
    }
    finally {
      if(is != null) try{ is.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  void saveContent(String content, String filePath)
    throws Exception
  {
    if(content  == null || content.length()  == 0) return;
    if(filePath == null || filePath.length() == 0) return;
    saveContent(content.getBytes(), filePath);
  }
  
  public static
  void saveContent(byte[] content, String filePath)
    throws Exception
  {
    if(content  == null || content.length    == 0) return;
    if(filePath == null || filePath.length() == 0) return;
    FileOutputStream fos = null;
    try {
      File file = new File(filePath);
      fos = new FileOutputStream(file);
      fos.write(content);
      System.out.println("File " + file.getAbsolutePath() + " saved.");
    }
    finally {
      if(fos != null) try{ fos.close(); } catch(Exception ex) {}
    }
  }
}
