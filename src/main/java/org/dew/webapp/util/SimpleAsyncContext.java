package org.dew.webapp.util;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public 
class SimpleAsyncContext implements AsyncContext 
{
  protected List<AsyncListener> listOfAsyncListener = new ArrayList<AsyncListener>();
  protected ServletRequest request;
  protected ServletResponse response;
  
  protected long timeout = 0;
  
  public SimpleAsyncContext()
  {
  }
  
  public SimpleAsyncContext(ServletRequest request)
  {
    this.request = request;
  }
  
  public SimpleAsyncContext(ServletRequest request, ServletResponse response)
  {
    this.request = request;
    this.response = response;
  }
  
  @Override
  public void addListener(AsyncListener asyncListener) {
    if(asyncListener == null) return;
    listOfAsyncListener.add(asyncListener);
  }
  
  @Override
  public void addListener(AsyncListener asyncListener, ServletRequest request, ServletResponse response) {
    this.request = request;
    this.response = response;
    if(asyncListener == null) return;
    listOfAsyncListener.add(asyncListener);
  }
  
  @Override
  public void complete() {
    AsyncEvent asyncEvent = new AsyncEvent(this);
    for(AsyncListener asyncListener : listOfAsyncListener) {
      try {
        asyncListener.onComplete(asyncEvent);
      }
      catch(Exception ex) {
        ex.printStackTrace();
      }
    }
  }
  
  @Override
  public <T extends AsyncListener> T createListener(Class<T> clazz) throws ServletException {
    try {
      return clazz.newInstance();
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    return null;
  }
  
  @Override
  public void dispatch() {
  }
  
  @Override
  public void dispatch(String path) {
  }
  
  @Override
  public void dispatch(ServletContext servletContext, String path) {
  }
  
  @Override
  public ServletRequest getRequest() {
    return request;
  }
  
  @Override
  public ServletResponse getResponse() {
    return response;
  }
  
  @Override
  public long getTimeout() {
    return timeout;
  }
  
  @Override
  public boolean hasOriginalRequestAndResponse() {
    return false;
  }
  
  @Override
  public void setTimeout(long timeout) {
    this.timeout = timeout;
  }
  
  @Override
  public void start(Runnable runnable) {
    if(runnable == null) return;
    AsyncEvent asyncEvent = new AsyncEvent(this);
    for(AsyncListener asyncListener : listOfAsyncListener) {
      try {
        asyncListener.onStartAsync(asyncEvent);
      }
      catch(Exception ex) {
        ex.printStackTrace();
      }
    }
    try {
      runnable.run();
    }
    catch(Exception exr) {
      asyncEvent = new AsyncEvent(this, exr);
      for(AsyncListener asyncListener : listOfAsyncListener) {
        try {
          asyncListener.onError(asyncEvent);
        }
        catch(Exception ex) {
          ex.printStackTrace();
        }
      }
    }
  }
}
