package org.dew.webapp.util;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;

import javax.sql.DataSource;

import javax.transaction.UserTransaction;

public
class ConnectionManager
{
  protected static String sJDBC_PATH = "jdbc/";
  
  public static final String sSYS_ONDEBUG   = "ondebug";
  
  protected static final String sDEF_CONN_NAME = "db_app";
  
  protected static boolean isOnDebug    = false;
  protected static Boolean useSequence;
  
  protected static String sJNDI_USER_TRANSACTION = "java:comp/UserTransaction";
  protected static boolean boSimpleTransaction = true;
  
  // For non-Oracle database
  protected static final String TABLE_SEQUENCES = "TAB_SEQUENCES";
  protected static final String FIELD_SEQ_NAME  = "SEQ_NAME";
  protected static final String FIELD_SEQ_VAL   = "SEQ_VAL";
  
  static {
    String sOnDebug = System.getProperty(sSYS_ONDEBUG);
    isOnDebug = sOnDebug != null && !sOnDebug.equals("0");
    try {
      Context ctx = new InitialContext();
      sJNDI_USER_TRANSACTION = "java:comp/UserTransaction";
      boSimpleTransaction = ctx.lookup(sJNDI_USER_TRANSACTION) == null;
    }
    catch(Exception ex) {
      System.err.println("ctx.lookup(\"" + sJNDI_USER_TRANSACTION + "\") -> " + ex);
      try {
        Context ctx = new InitialContext();
        sJNDI_USER_TRANSACTION = "java:jboss/UserTransaction";
        boSimpleTransaction = ctx.lookup(sJNDI_USER_TRANSACTION) == null;
      }
      catch(Exception ex2) {
        boSimpleTransaction = true;
        System.err.println("ctx.lookup(\"" + sJNDI_USER_TRANSACTION + "\") -> " + ex2);
      }
    }
    if(boSimpleTransaction) {
      System.err.println("Use SimpleTransaction");
    }
    else {
      System.err.println("Use " + sJNDI_USER_TRANSACTION);
    }
  }
  
  public static
  Connection getDefaultConnection()
    throws Exception
  {
    return getConnection(sDEF_CONN_NAME);
  }
  
  public static
  Connection getConnection(String sName)
    throws Exception
  {
    if(isOnDebug) {
      return DebugDataSource.getConnection(sName);
    }
    Context ctx = new InitialContext();
    // Impostazione iniziale
    try {
      DataSource ds = (DataSource) ctx.lookup(sJDBC_PATH + sName);
      if(ds != null) return ds.getConnection();
    }
    catch(Exception ex) {}
    // Altri possibili percorsi...
    sJDBC_PATH = "java:/";
    try {
      DataSource ds = (DataSource) ctx.lookup(sJDBC_PATH + sName);
      if(ds != null) return ds.getConnection();
    }
    catch(Exception ex) {}
    sJDBC_PATH = "java:/jdbc/";
    try {
      DataSource ds = (DataSource) ctx.lookup(sJDBC_PATH + sName);
      if(ds != null) return ds.getConnection();
    }
    catch(Exception ex) {}
    sJDBC_PATH = "java:/comp/env/jdbc/";
    try {
      DataSource ds = (DataSource) ctx.lookup(sJDBC_PATH + sName);
      if(ds != null) return ds.getConnection();
    }
    catch(Exception ex) {}
    sJDBC_PATH = "jdbc/";
    try {
      DataSource ds = (DataSource) ctx.lookup(sJDBC_PATH + sName);
      if(ds != null) return ds.getConnection();
    }
    catch(Exception ex) {}
    throw new Exception("DataSource " + sName + " not available.");
  }
  
  public static
  void closeConnection(Connection conn)
  {
    if(isOnDebug) {
      closeDebugConnection(conn);
      return;
    }
    
    try{
      conn.close();
    }
    catch(Exception ex) {
    }
  }
  
  public static
  void closeDebugConnection(Connection conn)
  {
    try{
      conn.commit();
      conn.close();
    }
    catch(Exception ex) {
    }
  }
  
  public static
  void close(Object... arrayOfAutoCloseable)
  {
    // Non si riporta il tipo AutoCloseable poiche' esso non e' disponibile per jdk < 1.7
    if(arrayOfAutoCloseable == null || arrayOfAutoCloseable.length == 0) {
      return;
    }
    for(Object autoCloseable : arrayOfAutoCloseable) {
      if(autoCloseable == null) continue;
      
      if(autoCloseable instanceof Connection) {
        closeConnection((Connection) autoCloseable);
      }
      else if(autoCloseable instanceof Statement) {
        try {
          ((Statement) autoCloseable).close();
        }
        catch(Exception ignore) {
        }
      }
      else if(autoCloseable instanceof PreparedStatement) {
        try {
          ((PreparedStatement) autoCloseable).close();
        }
        catch(Exception ignore) {
        }
      }
      else if(autoCloseable instanceof CallableStatement) {
        try {
          ((CallableStatement) autoCloseable).close();
        }
        catch(Exception ignore) {
        }
      }
      else if(autoCloseable instanceof ResultSet) {
        try {
          ((ResultSet) autoCloseable).close();
        }
        catch(Exception ignore) {
        }
      }
    }
  }
  
  public static
  void rollback(UserTransaction ut)
  {
    if(ut == null) return;
    try {
      ut.rollback();
    }
    catch(Exception ignore) {
    }
  }
  
  public static
  UserTransaction getUserTransaction(Connection conn)
    throws Exception
  {
    if(isOnDebug || boSimpleTransaction) {
      return new SimpleUserTransaction(conn);
    }
    Context ctx = new InitialContext();
    return (UserTransaction) ctx.lookup(sJNDI_USER_TRANSACTION);
  }
  
  public static
  int nextVal(Connection conn, String sequence)
    throws Exception
  {
    int iResult = 0;
    if(useSequence(conn)) {
      Statement stm = null;
      ResultSet rs = null;
      try {
        stm = conn.createStatement();
        rs = stm.executeQuery("SELECT " + sequence + ".NEXTVAL FROM DUAL");
        if(rs.next()) iResult = rs.getInt(1);
      }
      finally {
        if(rs  != null) try{ rs.close();  } catch(Exception ex) {}
        if(stm != null) try{ stm.close(); } catch(Exception ex) {}
      }
    }
    else {
      PreparedStatement pstm = null;
      ResultSet rs = null;
      try {
        pstm = conn.prepareStatement("UPDATE " + TABLE_SEQUENCES + " SET " + FIELD_SEQ_VAL + "=" + FIELD_SEQ_VAL + "+1 WHERE " + FIELD_SEQ_NAME + "=?");
        pstm.setString(1, sequence);
        int iRows = pstm.executeUpdate();
        pstm.close();
        if(iRows == 1) {
          pstm = conn.prepareStatement("SELECT " + FIELD_SEQ_VAL + " FROM " + TABLE_SEQUENCES + " WHERE " + FIELD_SEQ_NAME+ "=?");
          pstm.setString(1, sequence);
          rs = pstm.executeQuery();
          if(rs.next()) iResult = rs.getInt(1);
        }
        else {
          iResult = 1;
          pstm = conn.prepareStatement("INSERT INTO " + TABLE_SEQUENCES + "(" + FIELD_SEQ_NAME + "," + FIELD_SEQ_VAL + ") VALUES(?,?)");
          pstm.setString(1, sequence);
          pstm.setInt(2, iResult);
          pstm.executeUpdate();
        }
      }
      finally {
        if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
        if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
      }
    }
    return iResult;
  }
  
  public static
  boolean useSequence()
  {
    if(useSequence != null) return useSequence.booleanValue();
    Connection conn = null;
    try {
      conn = getDefaultConnection();
      DatabaseMetaData bdbmd = conn.getMetaData();
      String sDatabaseProductName = bdbmd.getDatabaseProductName();
      if(sDatabaseProductName != null && sDatabaseProductName.toUpperCase().indexOf("ORACLE") >= 0) {
        useSequence = Boolean.TRUE;
      }
      else {
        useSequence = Boolean.FALSE;
      }
    }
    catch(Throwable ex) {
      return false;
    }
    finally {
      closeConnection(conn);
    }
    if(useSequence == null) return false;
    return useSequence.booleanValue();
  }
  
  public static
  boolean useSequence(Connection conn)
    throws Exception
  {
    if(useSequence != null) return useSequence.booleanValue();
    if(conn == null) return false;
    DatabaseMetaData bdbmd = conn.getMetaData();
    String sDatabaseProductName = bdbmd.getDatabaseProductName();
    if(sDatabaseProductName != null && sDatabaseProductName.toUpperCase().indexOf("ORACLE") >= 0) {
      useSequence = Boolean.TRUE;
    }
    else {
      useSequence = Boolean.FALSE;
    }
    return useSequence.booleanValue();
  }
}
