package org.dew.webapp.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;
import org.util.WMap;

import org.dew.webapp.bl.User;

import org.dew.webapp.util.App;
import org.dew.webapp.util.ConnectionManager;
import org.dew.webapp.util.MailManager;
import org.dew.webapp.util.WSContext;

public 
class WSUtenti 
{
  protected static Logger logger = Logger.getLogger(WSUtenti.class);
  
  public static
  List<Map<String, Object>> find(Map<String, Object> filter)
    throws Exception
  {
    List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
    
    WMap wmFilter = new WMap(filter);
    
    String fIdRuolo  = wmFilter.getString("idRuolo");
    String fEmail    = wmFilter.getLowerString("email", null, 100);
    String fTelefono = wmFilter.getString("telefono");
    
    if(fEmail != null && fEmail.startsWith("@@")) {
      // Invio email di test
      if(fEmail.length() > 3) {
        String testEmail = fEmail.substring(2);
        if(testEmail.length() > 5 && testEmail.indexOf('@') > 0 && testEmail.indexOf('.') > 0) {
          try {
            logger.debug("Send test email to " + testEmail);
            MailManager.sendHTMLContent(testEmail, "Webapp - test", App.buildResetPasswordEmail("0"));
          }
          catch(Exception ex) {
            logger.error("Eccezione in WSUtenti.find(" + filter + ")#mail", ex);
            throw ex;
          }
        }
      }
      fEmail = null;
    }
    
    String sSQL = "SELECT * FROM UTE_UTENTI WHERE ID_RUOLO IS NOT NULL";
    
    if(fIdRuolo != null && fIdRuolo.length() > 0) {
      sSQL += " AND ID_RUOLO=?";
    }
    if(fEmail != null && fEmail.length() > 0) {
      sSQL += " AND EMAIL LIKE ?";
    }
    if(fTelefono != null && fTelefono.length() > 0) {
      sSQL += " AND TELEFONO LIKE ?";
    }
    sSQL += " ORDER BY ID_UTENTE";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      if(fIdRuolo != null && fIdRuolo.length() > 0) {
        pstm.setString(++p, fIdRuolo);
      }
      if(fEmail != null && fEmail.length() > 0) {
        pstm.setString(++p, fEmail + "%");
      }
      if(fTelefono != null && fTelefono.length() > 0) {
        pstm.setString(++p, fTelefono + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        String idUtente   = rs.getString("ID_UTENTE");
        String idRuolo    = rs.getString("ID_RUOLO");
        String email      = rs.getString("EMAIL");
        String telefono   = rs.getString("TELEFONO");
        int    verificato = rs.getInt("VERIFICATO");
        int    attivo     = rs.getInt("ATTIVO");
        Timestamp tsDtPA  = rs.getTimestamp("DT_PRIMO_ACCESSO");
        Timestamp tsDtUA  = rs.getTimestamp("DT_ULTIMO_ACCESSO");
        Timestamp tsDtA   = rs.getTimestamp("DT_ACCESSO");
        
        Map<String, Object> record = new HashMap<String, Object>();
        record.put("id",         idUtente);
        record.put("idRuolo",    idRuolo);
        record.put("email",      email);
        record.put("telefono",   telefono);
        record.put("verificato", verificato != 0);
        record.put("attivo",     attivo != 0);
        record.put("dtpa",       tsDtPA);
        record.put("dtua",       tsDtUA);
        record.put("dta",        tsDtA);
        
        result.add(record);
        if(result.size() > App.MAX_ROWS) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.find(" + filter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public static
  User login(String sUsername, String sPassword)
    throws Exception
  {
    return login(sUsername, sPassword, false);
  }
  
  public static
  User login(String sUsername, String sPassword, boolean remember)
    throws Exception
  {
    if(sPassword == null || sPassword.length() == 0) {
      logger.debug("WSUtenti.login(" + sUsername + "," + sPassword + "," + remember + ")...");
    }
    else {
      logger.debug("WSUtenti.login(" + sUsername + ",*," + remember + ")...");
    }
    User user = null;
    if(sUsername == null || sUsername.length() == 0) {
      return null;
    }
    if(sPassword == null || sPassword.length() == 0) {
      return null;
    }
    Timestamp tsDtAccesso = null;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      pstm = conn.prepareStatement("SELECT ID_RUOLO,EMAIL,TELEFONO,DT_ACCESSO FROM UTE_UTENTI WHERE ID_UTENTE=? AND CREDENZIALI=? AND ATTIVO=?");
      pstm.setString(1, sUsername);
      pstm.setString(2, String.valueOf(sPassword.hashCode()));
      pstm.setInt(3,    1); // ATTIVO
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sIdRuolo  = rs.getString("ID_RUOLO");
        String sEmail    = rs.getString("EMAIL");
        String sTelefono = rs.getString("TELEFONO");
        // La data di accesso presente in archivio prima della login
        // diventera' la data di ultimo accesso.
        tsDtAccesso = rs.getTimestamp("DT_ACCESSO");
        
        user = new User();
        user.setUserName(sUsername);
        user.setRole(sIdRuolo);
        user.setEmail(sEmail);
        user.setMobile(sTelefono);
        user.setCurrLogin(new Date());
        if(tsDtAccesso != null) {
          user.setLastLogin(new Date(tsDtAccesso.getTime()));
        }
      }
      if(user != null) {
        user.setResources(getResources(conn, user));
        
        String tokenId = notifyLogin(conn, sUsername, tsDtAccesso);
        user.setTokenId(tokenId);
        
        if(remember) {
          String rememberCode = generateRememberCode(conn, sUsername);
          user.setRememberCode(rememberCode);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.login(" + sUsername + ",*)", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return user;
  }
  
  public static
  User login(String sRememberCode)
    throws Exception
  {
    logger.debug("WSUtenti.login(" + sRememberCode + ")...");
    User user = null;
    Timestamp tsDtAccesso = null;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      pstm = conn.prepareStatement("SELECT ID_UTENTE,ID_RUOLO,EMAIL,TELEFONO,DT_ACCESSO FROM UTE_UTENTI WHERE COD_RICORDAMI=? AND ATTIVO=?");
      pstm.setString(1, sRememberCode);
      pstm.setInt(2,    1); // ATTIVO
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sUsername = rs.getString("ID_UTENTE");
        String sIdRuolo  = rs.getString("ID_RUOLO");
        String sEmail    = rs.getString("EMAIL");
        String sTelefono = rs.getString("TELEFONO");
        // La data di accesso presente in archivio prima della login
        // diventera' la data di ultimo accesso.
        tsDtAccesso = rs.getTimestamp("DT_ACCESSO");
        
        user = new User();
        user.setUserName(sUsername);
        user.setRole(sIdRuolo);
        user.setEmail(sEmail);
        user.setMobile(sTelefono);
        user.setCurrLogin(new Date());
        if(tsDtAccesso != null) {
          user.setLastLogin(new Date(tsDtAccesso.getTime()));
        }
      }
      if(user != null) {
        user.setResources(getResources(conn, user));
        
        String tokenId = notifyLogin(conn, user.getUserName(), tsDtAccesso);
        user.setTokenId(tokenId);
        
        user.setRememberCode(sRememberCode);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.login(" + sRememberCode + ",*)", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return user;
  }
  
  public static
  boolean logout(User user)
  {
    logger.debug("WSUtenti.logout(" + user + ")...");
    if(user == null) return false;
    
    String idAccesso = user.getTokenId();
    if(idAccesso == null || idAccesso.length() == 0) return false;
    
    Connection conn = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      pstm = conn.prepareStatement("UPDATE UTE_ACCESSI SET DT_LOGOUT=? WHERE ID_ACCESSO=?");
      pstm.setTimestamp(1, new java.sql.Timestamp(System.currentTimeMillis()));
      pstm.setString(2,    idAccesso);
      pstm.executeUpdate();
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.logout(" + user + ")", ex);
    }
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return true;
  }
  
  public static
  User checkTokenId(String tokenId)
  {
    logger.debug("WSUtenti.checkTokenId(" + tokenId + ")...");
    if(tokenId == null || tokenId.length() == 0) {
      return null;
    }
    String sSQL = "SELECT U.ID_UTENTE,U.ID_RUOLO,U.EMAIL,U.TELEFONO,U.DT_ULTIMO_ACCESSO,A.DT_LOGIN ";
    sSQL += "FROM UTE_ACCESSI A,UTE_UTENTI U ";
    sSQL += "WHERE A.ID_UTENTE=U.ID_UTENTE AND A.ID_ACCESSO=? AND A.DT_LOGOUT IS NULL AND A.DT_LOGIN>=? AND U.ATTIVO=?";
    
    Calendar calValidFrom = Calendar.getInstance();
    calValidFrom.add(Calendar.HOUR, -12);
    
    User user = null;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      pstm = conn.prepareStatement(sSQL);
      pstm.setString(1,    tokenId);
      pstm.setTimestamp(2, new Timestamp(calValidFrom.getTimeInMillis())); // A.DT_LOGIN>=?
      pstm.setInt(3,       1); // ATTIVO
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sUsername     = rs.getString("ID_UTENTE");
        String sIdRuolo      = rs.getString("ID_RUOLO");
        String sEmail        = rs.getString("EMAIL");
        String sTelefono     = rs.getString("TELEFONO");
        Timestamp tsDtUltAcc = rs.getTimestamp("DT_ULTIMO_ACCESSO");
        Timestamp tsLogin    = rs.getTimestamp("DT_LOGIN");
        
        user = new User();
        user.setUserName(sUsername);
        user.setRole(sIdRuolo);
        user.setEmail(sEmail);
        user.setMobile(sTelefono);
        user.setCurrLogin(new Date(tsLogin.getTime()));
        user.setTokenId(tokenId);
        if(tsDtUltAcc != null) {
          user.setLastLogin(new Date(tsDtUltAcc.getTime()));
        }
      }
      
      if(user != null) {
        user.setResources(getResources(conn, user));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.checkTokenId(" + tokenId + ",*)", ex);
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return user;
  }
  
  public static
  String getIdRuolo(String username)
  {
    logger.debug("WSUtenti.getIdRuolo(" + username + ")...");
    if(username == null || username.length() == 0) {
      return null;
    }
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return getIdRuolo(conn, username);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.getIdRuolo(" + username + ")", ex);
    }
    finally {
      ConnectionManager.close(conn);
    }
    return null;
  }
  
  public static
  String getIdRuolo(Connection conn, String username)
    throws Exception
  {
    logger.debug("WSUtenti.getIdRuolo(conn, " + username + ")...");
    if(username == null || username.length() == 0) {
      return null;
    }
    
    String result = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT ID_RUOLO FROM UTE_UTENTI WHERE ID_UTENTE=?");
      pstm.setString(1, username);
      rs = pstm.executeQuery();
      if(rs.next()) result = rs.getString("ID_RUOLO");
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return result;
  }
  
  public static
  Map<String, Object> getResources(Connection conn, User user)
    throws Exception
  {
    Map<String, Object> mapResult = new HashMap<String, Object>();
    
    if(user == null) return mapResult;
    String idRuolo = user.getRole();
    if(idRuolo == null || idRuolo.length() == 0) {
      return mapResult;
    }
    
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT ID_RISORSA,VAL_RISORSA FROM UTE_RUOLI_RISORSE WHERE ID_RUOLO=?");
      pstm.setString(1, idRuolo);
      rs = pstm.executeQuery();
      while(rs.next()) {
        String sIdRisorsa  = rs.getString("ID_RISORSA");
        String sValRisorsa = rs.getString("VAL_RISORSA");
        if(sIdRisorsa == null || sIdRisorsa.length() == 0) {
          continue;
        }
        mapResult.put(sIdRisorsa, sValRisorsa);
      }
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSUtenti.getResources(conn," + user + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return mapResult;
  }
  
  public static
  String generate(Connection conn, int idAnagrafica, String role, String email, String telefono, boolean sendEmail)
    throws Exception
  {
    if(email == null || email.length() == 0) {
      throw new Exception("Email non specificata");
    }
    email = email.trim().toLowerCase();
    if(email.length() < 5 || email.indexOf('@') <= 0 || email.indexOf('.') < 0 || email.indexOf(' ') >= 0) {
      throw new Exception("Email non valida");
    }
    
    String result = UUID.randomUUID().toString();
    
    if(role == null || role.length() == 0) {
      role = App.DEFAULT_USER_ROLE;
    }
    
    int p = 0;
    PreparedStatement pstm = null;
    try {
      pstm = conn.prepareStatement("INSERT INTO UTE_UTENTI(ID_UTENTE,ID_RUOLO,CREDENZIALI,EMAIL,TELEFONO,DT_PRIMO_ACCESSO,DT_ULTIMO_ACCESSO,DT_ACCESSO,COD_ATTIVAZIONE,VERIFICATO,ATTIVO) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
      pstm.setString(++p,    email);
      pstm.setString(++p,    role);
      pstm.setString(++p,    "0");
      pstm.setString(++p,    email);
      pstm.setString(++p,    telefono);
      pstm.setTimestamp(++p, null);   // DT_PRIMO_ACCESSO
      pstm.setTimestamp(++p, null);   // DT_ULTIMO_ACCESSO
      pstm.setTimestamp(++p, null);   // DT_ACCESSO
      pstm.setString(++p,    result); // COD_ATTIVAZIONE
      pstm.setInt(++p,       0);      // VERIFICATO
      pstm.setInt(++p,       0);      // ATTIVO
      pstm.executeUpdate();
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSUtenti.generate(conn," + idAnagrafica + "," + email + "," + telefono + ")1", ex);
      throw ex;
    } 
    finally {
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    
    if(idAnagrafica != 0) {
      associates(conn, idAnagrafica, email);
    }
    
    if(sendEmail) {
      String html = App.buildActivateEmail(result);
      
      MailManager.sendHTMLContent(email, "Webapp - accreditamento", html);
    }
    
    return result;
  }
  
  public static
  void associates(Connection conn, int idAnagrafica, String email)
    throws Exception
  {
    if(idAnagrafica == 0 || email == null || email.length() == 0) {
      return;
    }
    PreparedStatement pstm = null;
    try {
      pstm = conn.prepareStatement("INSERT INTO UTE_UTENTI_ANAGRAFICHE(ID_UTENTE,ID_ANAGRAFICA) VALUES(?,?)");
      pstm.setString(1, email);
      pstm.setInt(2, idAnagrafica);
      pstm.executeUpdate();
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSUtenti.associates(conn," + idAnagrafica + "," + email + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm);
    }
  }
  
  public static
  User activate(String code)
    throws Exception
  {
    if(code == null || code.length() == 0) {
      return null;
    }
    
    User user          = null;
    String credenziali = null;
    int  verificato    = 0;
    int  attivo        = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmS = null;
    PreparedStatement pstmU = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstmS = conn.prepareStatement("SELECT ID_UTENTE,ID_RUOLO,CREDENZIALI,EMAIL,TELEFONO,VERIFICATO,ATTIVO FROM UTE_UTENTI WHERE COD_ATTIVAZIONE=?");
      pstmS.setString(1, code);
      rs = pstmS.executeQuery();
      if(rs.next()) {
        String sUsername = rs.getString("ID_UTENTE");
        String sIdRuolo  = rs.getString("ID_RUOLO");
        credenziali      = rs.getString("CREDENZIALI");
        String sEmail    = rs.getString("EMAIL");
        String sTelefono = rs.getString("TELEFONO");
        verificato       = rs.getInt("VERIFICATO");
        attivo           = rs.getInt("ATTIVO");
        
        user = new User();
        user.setUserName(sUsername);
        user.setRole(sIdRuolo);
        user.setEmail(sEmail);
        user.setMobile(sTelefono);
      }
      if(user != null) {
        user.setResources(getResources(conn, user));
      }
      
      if(user == null) {
        // Utente non trovato
        return null;
      }
      if(verificato != 0 && attivo == 0) {
        // Utente verificato ma disattivato
        return null;
      }
      
      // Se l'utente ha attivato le credenziali, ma non ha cambiato la password
      // si procede ugualmente con l'attivazione.
      if(verificato == 0 || credenziali == null || credenziali.length() < 2) {
        ut = ConnectionManager.getUserTransaction(conn);
        ut.begin();
        
        pstmU = conn.prepareStatement("UPDATE UTE_UTENTI SET VERIFICATO=?,ATTIVO=? WHERE ID_UTENTE=?");
        // SET
        pstmU.setInt(1, 1);
        pstmU.setInt(2, 1);
        // WHERE
        pstmU.setString(3, user.getUserName());
        pstmU.executeUpdate();
        
        String tokenId = notifyLogin(conn, user.getUserName(), null);
        
        user.setTokenId(tokenId);
        
        ut.commit();
      }
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.activate(conn," + code + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(rs, pstmS, pstmU, conn);
    }
    
    return user;
  }
  
  public static
  boolean setEnabled(String username, boolean enabled)
    throws Exception
  {
    boolean result = false;
    
    if(username == null || username.length() == 0) {
      return result;
    }
    
    if(!WSContext.isUserAdmin()) return result;
    
    Connection conn = null;
    PreparedStatement pstm = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET ATTIVO=? WHERE ID_UTENTE=?");
      // SET
      pstm.setInt(1, enabled ? 1 : 0);
      // WHERE
      pstm.setString(2, username);
      int resUpd = pstm.executeUpdate();
      
      ut.commit();
      
      result = resUpd > 0;
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.setEnabled(" + username + "," + enabled + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  
  public static
  boolean setRuolo(String username, String ruolo)
    throws Exception
  {
    boolean result = false;
    
    if(username == null || username.length() == 0) {
      return result;
    }
    
    if(!WSContext.isUserAdmin()) return result;
    
    Connection conn = null;
    PreparedStatement pstm = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET ID_RUOLO=? WHERE ID_UTENTE=?");
      // SET
      pstm.setString(1, ruolo);
      // WHERE
      pstm.setString(2, username);
      int resUpd = pstm.executeUpdate();
      
      ut.commit();
      
      result = resUpd > 0;
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.setRuolo(" + username + "," + ruolo + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  
  public static
  String notifyLogin(Connection conn, String username, Timestamp tsDtPrevAccess)
    throws Exception
  {
    if(username == null || username.length() == 0) {
      return null;
    }
    
    String result = UUID.randomUUID().toString();
    
    Timestamp tsDtCurrentAccess = new Timestamp(System.currentTimeMillis());
    
    PreparedStatement pstmI = null;
    PreparedStatement pstmU = null;
    try {
      pstmI = conn.prepareStatement("INSERT INTO UTE_ACCESSI(ID_ACCESSO,ID_UTENTE,DT_LOGIN) VALUES(?,?,?)");
      pstmI.setString(1,    result);
      pstmI.setString(2,    username);
      pstmI.setTimestamp(3, tsDtCurrentAccess);
      pstmI.executeUpdate();
      
      if(tsDtPrevAccess != null) {
        pstmU = conn.prepareStatement("UPDATE UTE_UTENTI SET DT_ULTIMO_ACCESSO=?,DT_ACCESSO=? WHERE ID_UTENTE=?");
        // SET
        pstmU.setTimestamp(1, tsDtPrevAccess);
        pstmU.setTimestamp(2, tsDtCurrentAccess);
        // WHERE
        pstmU.setString(3, username);
        pstmU.executeUpdate();
      }
      else {
        pstmU = conn.prepareStatement("UPDATE UTE_UTENTI SET DT_PRIMO_ACCESSO=?,DT_ULTIMO_ACCESSO=?,DT_ACCESSO=? WHERE ID_UTENTE=?");
        // SET
        pstmU.setTimestamp(1, tsDtCurrentAccess);
        pstmU.setTimestamp(2, tsDtCurrentAccess);
        pstmU.setTimestamp(3, tsDtCurrentAccess);
        // WHERE
        pstmU.setString(4, username);
        pstmU.executeUpdate();
      }
    }
    finally {
      ConnectionManager.close(pstmI, pstmU);
    }
    
    return result;
  }
  
  public static
  String generateRememberCode(Connection conn, String username)
    throws Exception
  {
    if(username == null || username.length() == 0) {
      return null;
    }
    
    String result = UUID.randomUUID().toString();
    
    PreparedStatement pstm = null;
    try {
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET COD_RICORDAMI=? WHERE ID_UTENTE=?");
      // SET
      pstm.setString(1, result);
      // WHERE
      pstm.setString(2, username);
      pstm.executeUpdate();
    }
    finally {
      ConnectionManager.close(pstm);
    }
    return result;
  }
  
  public static
  boolean updatePassword(String code, String password)
    throws Exception
  {
    if(code == null || code.length() == 0) {
      return false;
    }
    if(password == null || password.length() == 0) {
      return false;
    }
    
    int result = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET CREDENZIALI=? WHERE COD_ATTIVAZIONE=? AND ATTIVO=?");
      // SET
      pstm.setString(1, String.valueOf(password.hashCode()));
      // WHERE
      pstm.setString(2, code); // COD_ATTIVAZIONE
      pstm.setInt(3,    1);    // ATTIVO
      
      result = pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.updatePassword(conn," + code + ",*)", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    
    return result > 0;
  }
  
  public static
  boolean updatePassword(String username, String currPassword, String newPassword)
    throws Exception
  {
    if(username == null || username.length() == 0) {
      return false;
    }
    if(currPassword == null || currPassword.length() == 0) {
      return false;
    }
    if(newPassword == null || newPassword.length() == 0) {
      return false;
    }
    
    int result = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET CREDENZIALI=? WHERE ID_UTENTE=? AND CREDENZIALI=? AND ATTIVO=?");
      // SET
      pstm.setString(1, String.valueOf(newPassword.hashCode()));
      // WHERE
      pstm.setString(2, username);
      pstm.setString(3, String.valueOf(currPassword.hashCode()));
      pstm.setInt(4,    1); // ATTIVO
      
      result = pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.updatePassword(conn," + username + ",*,*)", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    
    return result > 0;
  }
  
  public static
  boolean resetPassword(String username)
    throws Exception
  {
    if(username == null || username.length() == 0) {
      return false;
    }
    
    String codAttivazione = UUID.randomUUID().toString();
    
    int result = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      String email = getEmail(conn, username);
      
      if(email == null || email.length() < 5 || email.indexOf('@') < 0 || email.indexOf('.') < 0) {
        return false;
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE UTE_UTENTI SET CREDENZIALI=?,COD_ATTIVAZIONE=?,VERIFICATO=?,ATTIVO=? WHERE ID_UTENTE=?");
      // SET
      pstm.setString(1, "0");
      pstm.setString(2, codAttivazione);
      pstm.setInt(3,    0);
      pstm.setInt(4,    0);
      // WHERE
      pstm.setString(5, username);
      result = pstm.executeUpdate();
      
      ut.commit();
      
      if(result > 0) {
        String html = App.buildResetPasswordEmail(codAttivazione);
        
        MailManager.sendHTMLContent(email, "Webapp - reset password", html);
      }
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      
      logger.error("Eccezione in WSUtenti.resetPassword(" + username + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    
    return result > 0;
  }
  
  public static
  String getEmail(Connection conn, String username)
  {
    if(username == null || username.length() == 0) {
      return null;
    }
    if(username.length() > 4 && username.indexOf('@') > 0) {
      return username;
    }
    String result = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      pstm = conn.prepareStatement("SELECT EMAIL FROM UTE_UTENTI WHERE ID_UTENTE=?");
      pstm.setString(1, username);
      rs = pstm.executeQuery();
      if(rs.next()) result = rs.getString("EMAIL");
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtenti.getEmail(conn," + username + ")", ex);
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    if(result != null) {
      result = result.trim().toLowerCase();
    }
    return result;
  }
}
