package org.dew.webapp.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import org.util.WMap;

import org.dew.webapp.util.App;
import org.dew.webapp.util.ConnectionManager;

public 
class WSComuni
{
  protected static Logger logger = Logger.getLogger(WSComuni.class);
  
  public static
  List<Map<String, Object>> lookup(Map<String, Object> filter)
    throws Exception
  {
    List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
    
    if(filter == null || filter.isEmpty()) {
      return result;
    }
    WMap wmFilter = new WMap(filter);
    String query = wmFilter.getUpperString("q", null);
    if(query == null || query.length() == 0) {
      return result;
    }
    
    String sSQL = "SELECT ID_COMUNE,DESCRIZIONE,PROVINCIA ";
    sSQL += "FROM ANA_COMUNI ";
    sSQL += "WHERE ID_COMUNE<>'000000' ";
    if(query != null && query.length() > 0) {
      sSQL += "AND DESCRIZIONE LIKE ? ";
    }
    sSQL += "ORDER BY DESCRIZIONE";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      if(query != null && query.length() > 0) {
        pstm.setString(++p, query + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        String idComune    = rs.getString("ID_COMUNE");
        String descrizione = rs.getString("DESCRIZIONE");
        String provincia   = rs.getString("PROVINCIA");
        
        if(descrizione == null || descrizione.length() == 0) continue;
        if(provincia != null && provincia.length() > 0) {
          descrizione += " (" + provincia + ")";
        }
        
        Map<String, Object> record = new HashMap<String, Object>();
        record.put("id",   idComune);
        record.put("text", descrizione);
        
        if(descrizione.equals(query)) {
          result.add(0, record);
        }
        else {
          result.add(record);
        }
        if(result.size() > App.MAX_ROWS) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSComuni.lookup(" + filter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
}
