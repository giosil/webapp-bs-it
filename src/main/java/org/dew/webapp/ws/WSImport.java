package org.dew.webapp.ws;

import java.io.File;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

public 
class WSImport 
{
  public static final String FOLDER_IMPORT      = System.getProperty("user.home") + File.separator + "dew" + File.separator + "temp";
  public static final String FOLDER_ATTACHMENTS = System.getProperty("user.home") + File.separator + "dew" + File.separator + "attachments";
  
  protected static Logger logger = Logger.getLogger(WSImport.class);
  
  public static
  List<Map<String,Object>> list()
    throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    try {
      File folder = new File(FOLDER_IMPORT);
      if(!folder.exists()) {
        return listResult;
      }
      
      File[] afFiles = folder.listFiles();
      if(afFiles == null || afFiles.length == 0) {
        return listResult;
      }
      
      for(int i = 0; i < afFiles.length; i++) {
        File file = afFiles[i];
        
        if(!file.isFile()) continue;
        
        String fileName = file.getName();
        
        Map<String, Object> mapFile = new HashMap<String, Object>();
        mapFile.put("f", fileName);
        mapFile.put("d", new Date(file.lastModified()));
        mapFile.put("t", getType(fileName));
        mapFile.put("s", file.length());
        
        listResult.add(mapFile);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSImport.list()", ex);
      throw ex;
    }
    
    return listResult;
  }
  
  public static
  boolean remove(String fileName)
    throws Exception
  {
    boolean result = false;
    
    logger.debug("WSImport.remove(" + fileName + ")...");
    
    if(fileName == null || fileName.length() == 0) {
      logger.debug("WSImport.remove(" + fileName + ") -> " + result);
      return result;
    }
    
    try {
      File file = new File(FOLDER_IMPORT + File.separator + fileName);
      
      if(!file.exists()) return false;
      
      result = file.delete();
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSImport.remove(" + fileName + ")", ex);
      throw ex;
    }
    
    logger.debug("WSImport.remove(" + fileName + ") -> " + result);
    
    return result;
  }
  
  public static
  String getType(String fileName)
  {
    if(fileName == null || fileName.length() == 0) {
      return "";
    }
    int iLastDot = fileName.lastIndexOf('.');
    if(iLastDot > 0) {
      return fileName.substring(iLastDot + 1);
    }
    return "";
  }
  
  public static
  boolean removeAttachment(String fileName)
    throws Exception
  {
    if(fileName == null || fileName.length() == 0) {
      return false;
    }
    
    File folderAttachment = new File(FOLDER_ATTACHMENTS);
    if(!folderAttachment.exists()) {
      return false;
    }
    
    File file = new File(FOLDER_ATTACHMENTS + File.separator + fileName);
    if(!file.exists()) {
      return false;
    }
    
    return file.delete();
  }
  
  public static
  boolean moveToAttachmentsFolder(String fileName)
    throws Exception
  {
    if(fileName == null || fileName.length() == 0) {
      return false;
    }
    
    File folderImport = new File(FOLDER_IMPORT);
    if(!folderImport.exists()) {
      return false;
    }
    
    File folderAttachment = new File(FOLDER_ATTACHMENTS);
    if(!folderAttachment.exists()) {
      folderAttachment.mkdirs();
    }
    
    File file = new File(FOLDER_IMPORT + File.separator + fileName);
    if(!file.exists()) {
      return false;
    }
    
    File dest = new File(FOLDER_ATTACHMENTS + File.separator + fileName);
    if(dest.exists()) {
      dest.delete();
    }
    
    return file.renameTo(dest);
  }
}
