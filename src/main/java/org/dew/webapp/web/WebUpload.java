package org.dew.webapp.web;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import java.util.Collection;
import java.util.Iterator;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import javax.servlet.annotation.MultipartConfig;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.log4j.Logger;

import org.dew.webapp.ws.WSImport;

@MultipartConfig
public
class WebUpload extends HttpServlet
{
  private static final long serialVersionUID = -2173332591067324236L;
  
  protected static Logger logger = Logger.getLogger(WebUpload.class);
  
  @Override
  public
  void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    Part part0 = null;
    FileOutputStream fos = null;
    try {
      Collection<Part> collectionOfPart = request.getParts();
      
      if(collectionOfPart != null) {
        Iterator<Part> iterator = collectionOfPart.iterator();
        if(iterator.hasNext()) {
          part0 = iterator.next();
        }
      }
      
      if(part0 != null) {
        long size = part0.getSize();
        
        String fileName = WebUpload.getSubmittedFileName(part0);
        
        File folder = new File(WSImport.FOLDER_IMPORT);
        if(!folder.exists()) folder.mkdirs();
        
        String filePath = WSImport.FOLDER_IMPORT + File.separator + fileName;
        fos = new FileOutputStream(new File(filePath), false);
        
        InputStream inputStream = part0.getInputStream();
        int read = 0;
        final byte[] buffer = new byte[1024];
        while((read = inputStream.read(buffer)) != -1) {
          fos.write(buffer, 0, read);
        }
        
        logger.debug("WebUpload.doPost File " + filePath + " [" + size + "] saved.");
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WebUpload.doPost", ex);
      response.sendError(500);
    }
    finally {
      if(fos != null) try { fos.close(); } catch(Exception ex) {}
    }
  }
  
  @Override
  public
  void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    request.setAttribute("message", "Metodo GET non consentito.");
    
    RequestDispatcher requestDispatcher = request.getRequestDispatcher("/message.jsp");
    requestDispatcher.forward(request, response);
  }
  
  public static
  String getSubmittedFileName(Part part)
  {
    if(part == null) return "file";
    
    // Servlet 3.1 - JavaEE 7
    // 
    // return part.getSubmittedFileName();
    
    Collection<String> colHeaderNames = part.getHeaderNames();
    if(colHeaderNames == null) return "file";
    
    Iterator<String> iteratorHeaders = colHeaderNames.iterator();
    while(iteratorHeaders.hasNext()) {
      String headerName = iteratorHeaders.next();
      String headerVal  = part.getHeader(headerName);
      if(headerVal == null || headerVal.length() == 0) continue;
      
      // Content-Disposition = form-data; name="files[]"; filename="test.csv"
      int iFileNameIdx = headerVal.indexOf("filename");
      if(iFileNameIdx > 0) {
        int iBeginWrap = headerVal.indexOf('"', iFileNameIdx + 1);
        if(iBeginWrap > 0) {
          int iEndWrap = headerVal.indexOf('"', iBeginWrap + 1);
          if(iEndWrap > 0) {
            return headerVal.substring(iBeginWrap + 1, iEndWrap).trim();
          }
        }
      }
    }
    
    return "file";
  }
}
