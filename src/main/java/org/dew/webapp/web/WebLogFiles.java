package org.dew.webapp.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dew.webapp.util.App;

public 
class WebLogFiles extends HttpServlet 
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
    
    if (fileName != null && fileName.length() > 0) {
      if(fileName.endsWith("_")) {
        fileName = fileName.substring(0, fileName.length() - 1);
        File file = getFile(fileName);
        if (file == null) {
          response.sendError(404);
          return;
        }
        boolean result = file.delete();
        if(result) {
          sendMessage(response, "File " + file.getAbsolutePath() + " cancellato con successo.");
        }
        else {
          sendMessage(response, "File " + file.getAbsolutePath() + " NON cancellato.");
        }
        return;
      }
      
      File file = getFile(fileName);
      if (file == null) {
        response.sendError(404);
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
    else {
      response.setContentType("text/html");
      PrintWriter out = response.getWriter();
      out.println("<!DOCTYPE html>");
      out.println("<html>");
      out.println("<head>");
      out.println("<title>Log Files</title>");
      out.println("</head>");
      out.println("<body>");
      out.println("<h1>" + App.LOG_FOLDER + "</h1>");
      out.println("<hr>");
      out.println("<table align=\"center\" border=\"0\">");
      out.println("<tr>");
      out.println("<th>Nome File</th>");
      out.println("<th>Dimensione</th>");
      out.println("<th>Content Type</th>");
      out.println("<th>Ult. Modifica</th>");
      out.println("</tr>");
      List<String> listFiles = getListFiles();
      for (int i = 0; i < listFiles.size(); i++) {
        String fileNameI = listFiles.get(i);
        if (i % 2 == 0) {
          out.println("<tr>");
        }
        else {
          out.println("<tr style=\"background-color:#d6e6e6;\">");
        } 
        File file = getFile(fileNameI);
        if (file != null) {
          out.println("<td><a href=\"log/" + fileNameI + "\">" + fileNameI + "</a></td>");
        }
        else {
          out.println("<td>" + fileNameI + "</td>");
        } 
        out.println("<td>" + getDimensione(file)     + "</td>");
        out.println("<td>" + getContentType(file)    + "</td>");
        out.println("<td>" + getUltimaMofifica(file) + "</td>");
        out.println("</tr>");
      } 
      out.println("</table>");
      out.println("<br>");
      out.println("</body>");
      out.println("</html>");
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
  
  protected static 
  File getFile(String fileName) 
  {
    File file = new File(App.LOG_FOLDER + File.separator + fileName);
    if (!file.exists()) return null; 
    if (!file.isFile()) return null; 
    return file;
  }
  
  protected static 
  String getDimensione(File file) 
  {
    if (file == null) return "N/A";
    long lLength = file.length();
    if (lLength < 1024L) return lLength + " bytes";
    long lKB = lLength / 1024L;
    long lDecimal = lLength % 1024L * 10L / 1024L;
    if (lDecimal > 0L) return lKB + "." + lDecimal + " KB";
    return lKB + " KB";
  }
  
  protected static 
  String getUltimaMofifica(File file) 
  {
    if (file == null) return "N/A";
    long lLastModified = file.lastModified();
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Date(lLastModified));
    int iYear  = cal.get(Calendar.YEAR);
    int iMonth = cal.get(Calendar.MONTH) + 1;
    String sMonth = null;
    if (iMonth < 10) {
      sMonth = "0" + iMonth;
    }
    else {
      sMonth = String.valueOf(iMonth);
    }
    int iDay = cal.get(Calendar.DATE);
    String sDay = null;
    if (iDay < 10) {
      sDay = "0" + iDay;
    }
    else {
      sDay = String.valueOf(iDay);
    }
    int iHour = cal.get(11);
    int iMinute = cal.get(12);
    String sMinute = null;
    if (iMinute < 10) {
      sMinute = "0" + iMinute;
    }
    else {
      sMinute = String.valueOf(iMinute);
    }
    return sDay + "/" + sMonth + "/" + iYear + " " + iHour + ":" + sMinute;
  }
  
  protected static 
  String getContentType(File file) 
  {
    if (file == null) return "N/A"; 
    String fileName = file.getName();
    String ext = null;
    int sep = fileName.lastIndexOf('.');
    if (sep >= 0 && sep < fileName.length() - 1) {
      ext = fileName.substring(sep + 1);
    }
    if (ext.equalsIgnoreCase("xml"))  return "text/xml";
    if (ext.equalsIgnoreCase("json")) return "application/json";
    return "text/plain";
  }
  
  protected static
  List<String> getListFiles() 
    throws ServletException 
  {
    List<String> result = new ArrayList<String>();
    File folder = new File(App.LOG_FOLDER);
    if (!folder.exists())      return result; 
    if (!folder.isDirectory()) return result;
    File[] afFiles = folder.listFiles();
    for (int i = 0; i < afFiles.length; i++) {
      File file = afFiles[i];
      if (file.isFile()) {
        result.add(file.getName());
      }
    }
    return result;
  }
  
  protected 
  void sendMessage(HttpServletResponse response, String message) 
    throws ServletException, IOException 
  {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    out.println("<!DOCTYPE html>");
    out.println("<html>");
    out.println("<head>");
    out.println("<title>Messaggio</title>");
    out.println("</head>");
    out.println("<body>");
    out.println("<h1>" + message + "</h1>");
    out.println("</body>");
    out.println("</html>");
  }
}
