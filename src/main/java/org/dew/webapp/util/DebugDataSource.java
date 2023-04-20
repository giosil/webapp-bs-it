package org.dew.webapp.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public
class DebugDataSource
{
  public static Properties config = new Properties();
  
  static {
    InputStream inputStream = null;
    try {
      inputStream = Thread.currentThread().
      getContextClassLoader().
      getResource("jdbc_debug.cfg").openStream();
      config.load(inputStream);
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    finally {
      try { inputStream.close(); } catch(Exception oEx) {}
    }
    
    System.out.println("File jdbc_debug.cfg loaded.");
  }
  
  public static
  Connection getConnection(String name)
    throws Exception
  {
    String driver = config.getProperty(name + ".driver");
    if(driver == null || driver.length() == 0) return null;
    Class.forName(driver);
    
    String url = config.getProperty(name + ".url");
    if(url == null || url.length() == 0) return null;
    
    String user = config.getProperty(name + ".user");
    String pass = config.getProperty(name + ".password");
    
    Connection conn = DriverManager.getConnection(url, user, pass);
    conn.setAutoCommit(false);
    
    return conn;
  }
}
