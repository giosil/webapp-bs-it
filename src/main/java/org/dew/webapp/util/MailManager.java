package org.dew.webapp.util;

import java.io.File;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;

import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import javax.naming.InitialContext;

public
class MailManager
{
  public static
  Session getDefaultMailSession()
    throws Exception
  {
    String sLookUp = App.getProperty(App.CONF_MAIL_LOOKUP);
    
    if(sLookUp != null) {
      InitialContext initCtx = new InitialContext();
      return (javax.mail.Session)initCtx.lookup(sLookUp);
    }
    
    String sCfgMailSMTP = App.getProperty(App.CONF_MAIL_SMTP);
    if(sCfgMailSMTP == null || sCfgMailSMTP.length() == 0) return null;
    
    int     iCfgSMTPPort   = App.getIntProperty(App.CONF_MAIL_PORT, 0);
    boolean boMailStartTLS = App.getBooleanProperty(App.CONF_MAIL_STLS, false);
    boolean boMailSmtpAuth = App.getBooleanProperty(App.CONF_MAIL_SMTP_AUTH, false);
    
    Properties props = System.getProperties();
    props.put("mail.smtp.host", sCfgMailSMTP);
    if(iCfgSMTPPort > 0) {
      props.put("mail.smtp.port", String.valueOf(iCfgSMTPPort));
    }
    if(boMailStartTLS) {
      props.put("mail.smtp.starttls.enable", "true");
    }
    if(boMailSmtpAuth) {
      props.put("mail.smtp.auth", "true");
    }
    
    if(boMailSmtpAuth) {
      return Session.getInstance(props, new Authenticator() {
        public PasswordAuthentication getPasswordAuthentication() {
          String sMailUser = App.getProperty(App.CONF_MAIL_USER);
          String sMailPwd  = App.getProperty(App.CONF_MAIL_PASS);
          return new PasswordAuthentication(sMailUser, sMailPwd);
        }
      });
    }
    return Session.getInstance(props, null);
  }
  
  public static
  void sendHTMLContent(String sTo, String sSubject, String sBody)
    throws Exception
  {
    List<String> listRecipients = new ArrayList<String>();
    listRecipients.add(sTo);
    sendHTMLContent(listRecipients, sSubject, sBody);
  }
  
  public static
  void sendHTMLContent(List<String> listRecipients, String sSubject, String sBody)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) return;
    
    String mailFrom = App.getProperty(App.CONF_MAIL_FROM);
    if(mailFrom == null || mailFrom.length() < 5 || mailFrom.indexOf('@') <= 0) {
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(mailFrom));
    
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    
    msg.setSubject(sSubject);
    msg.setContent(sBody, "text/html");
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Transport.send(msg);
  }
  
  public static
  void sendHTMLContent(String sFrom, String sTo, String sSubject, String sBody)
    throws Exception
  {
    List<String> listRecipients = new ArrayList<String>();
    listRecipients.add(sTo);
    sendHTMLContent(sFrom, listRecipients, sSubject, sBody);
  }
  
  public static
  void sendHTMLContent(String sFrom, List<String> listRecipients, String sSubject, String sBody)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) return;
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress("<" + sFrom + ">"));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setContent(sBody, "text/html");
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Transport.send(msg);
  }
  
  public static
  void send(String sTo, String sSubject, String sBody)
    throws Exception
  {
    List<String> listRecipients = new ArrayList<String>();
    listRecipients.add(sTo);
    send(listRecipients, sSubject, sBody);
  }
  
  public static
  void send(List<String> listRecipients, String sSubject, String sBody)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    String mailFrom = App.getProperty(App.CONF_MAIL_FROM);
    if(mailFrom == null || mailFrom.length() < 5 || mailFrom.indexOf('@') <= 0) {
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(mailFrom));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setText(sBody);
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Transport.send(msg);
  }
  
  public static
  void send(List<String> listRecipients, String sSubject, String sBody, int iPriority)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    String mailFrom = App.getProperty(App.CONF_MAIL_FROM);
    if(mailFrom == null || mailFrom.length() < 5 || mailFrom.indexOf('@') <= 0) {
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(mailFrom));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setText(sBody);
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setHeader("X-Priority", String.valueOf(iPriority));
    msg.setSentDate(new Date());
    
    Transport.send(msg);
  }
  
  public static
  void send(List<String> listRecipients, String sFrom, String sSubject, String sBody)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    
    if(sFrom == null || sFrom.length() == 0) {
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress("<" + sFrom + ">"));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setText(sBody);
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Transport.send(msg);
  }
  
  public static
  void send(List<String> listRecipients, String sSubject, String sBody, List<?> listAttachments)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    String mailFrom = App.getProperty(App.CONF_MAIL_FROM);
    if(mailFrom == null || mailFrom.length() < 5 || mailFrom.indexOf('@') <= 0) {
      return;
    }
    
    if(listAttachments == null || listAttachments.size() == 0) {
      send(listRecipients, sSubject, sBody);
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(mailFrom));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Multipart multipart = new MimeMultipart();
    
    BodyPart bodyPart = new MimeBodyPart();
    bodyPart.setText(sBody);
    multipart.addBodyPart(bodyPart);
    
    for(int i = 0; i < listAttachments.size(); i++) {
      Object oFile = listAttachments.get(i);
      File file = null;
      if(oFile instanceof File) {
        file = (File) oFile;
      }
      else {
        file = new File(oFile.toString());
      }
      DataSource dataSource = new FileDataSource(file);
      BodyPart fileBodyPart = new MimeBodyPart();
      fileBodyPart.setDataHandler(new DataHandler(dataSource));
      fileBodyPart.setFileName(file.getName());
      multipart.addBodyPart(fileBodyPart);
    }
    
    msg.setContent(multipart);
    
    Transport.send(msg);
  }
  
  public static
  void send(List<String> listRecipients, String sSubject, String sBody, List<?> listAttachments, int iPriority)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    String mailFrom = App.getProperty(App.CONF_MAIL_FROM);
    if(mailFrom == null || mailFrom.length() < 5 || mailFrom.indexOf('@') <= 0) {
      return;
    }
    
    if(listAttachments == null || listAttachments.size() == 0) {
      send(listRecipients, sSubject, sBody, iPriority);
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress(mailFrom));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setHeader("X-Mailer",   "LOTONtechEmail");
    msg.setHeader("X-Priority", String.valueOf(iPriority));
    msg.setSentDate(new Date());
    
    Multipart multipart = new MimeMultipart();
    
    BodyPart bodyPart = new MimeBodyPart();
    bodyPart.setText(sBody);
    multipart.addBodyPart(bodyPart);
    
    for(int i = 0; i < listAttachments.size(); i++) {
      Object oFile = listAttachments.get(i);
      File file = null;
      if(oFile instanceof File) {
        file = (File) oFile;
      }
      else {
        file = new File(oFile.toString());
      }
      DataSource dataSource = new FileDataSource(file);
      BodyPart fileBodyPart = new MimeBodyPart();
      fileBodyPart.setDataHandler(new DataHandler(dataSource));
      fileBodyPart.setFileName(file.getName());
      multipart.addBodyPart(fileBodyPart);
    }
    
    msg.setContent(multipart);
    
    Transport.send(msg);
  }
  
  public static
  void send(List<String> listRecipients, String sFrom, String sSubject, String sBody, List<?> listAttachments)
    throws Exception
  {
    if(listRecipients == null || listRecipients.size() == 0) {
      return;
    }
    if(sFrom == null || sFrom.length() == 0) {
      return;
    }
    
    if(listAttachments == null || listAttachments.size() == 0) {
      send(listRecipients, sFrom, sSubject, sBody);
      return;
    }
    
    String sTo = "";
    for(int i = 0; i < listRecipients.size(); i++) {
      sTo += ",<" + listRecipients.get(i) + ">";
    }
    sTo = sTo.substring(1);
    
    Session session = getDefaultMailSession();
    if(session == null) return;
    
    Message msg = new MimeMessage(session);
    msg.setFrom(new InternetAddress("<" + sFrom + ">"));
    msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sTo, false));
    msg.setSubject(sSubject);
    msg.setHeader("X-Mailer", "LOTONtechEmail");
    msg.setSentDate(new Date());
    
    Multipart multipart = new MimeMultipart();
    
    BodyPart bodyPart = new MimeBodyPart();
    bodyPart.setText(sBody);
    multipart.addBodyPart(bodyPart);
    
    for(int i = 0; i < listAttachments.size(); i++) {
      Object oFile = listAttachments.get(i);
      File file = null;
      if(oFile instanceof File) {
        file = (File) oFile;
      }
      else {
        file = new File(oFile.toString());
      }
      DataSource dataSource = new FileDataSource(file);
      BodyPart fileBodyPart = new MimeBodyPart();
      fileBodyPart.setDataHandler(new DataHandler(dataSource));
      fileBodyPart.setFileName(file.getName());
      multipart.addBodyPart(fileBodyPart);
    }
    
    msg.setContent(multipart);
    
    Transport.send(msg);
  }
}
