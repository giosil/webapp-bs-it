package org.dew.webapp.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.AsyncContext;

import org.apache.log4j.Logger;

public abstract
class AAsyncJob<R> implements Runnable 
{
  protected static Logger logger = Logger.getLogger(AAsyncJob.class);
  
  protected String name;
  protected Map<String, Object> parameters;
  protected boolean debug;
  
  protected R output;
  protected Exception error;
  
  protected boolean running   = false;
  protected boolean completed = false;
  protected boolean success   = false;
  protected long elapsed = 0;
  
  protected AsyncContext asyncContext;
  
  public AAsyncJob(String name)
  {
    this.name = name;
    this.parameters = new HashMap<String, Object>();
  }
  
  public AAsyncJob(String name, AsyncContext asyncContext)
  {
    this.name = name;
    this.asyncContext = asyncContext;
    this.parameters = new HashMap<String, Object>();
  }
  
  public AAsyncJob(String name, AsyncContext asyncContext, Map<String, Object> parameters)
  {
    this.name = name;
    this.asyncContext = asyncContext;
    this.parameters = parameters;
  }
  
  public AAsyncJob(String name, AsyncContext asyncContext, Map<String, Object> parameters, boolean debug)
  {
    this.name = name;
    this.asyncContext = asyncContext;
    this.parameters = parameters;
    this.debug = debug;
  }
  
  public AsyncContext getAsyncContext() {
    return asyncContext;
  }
  
  public void setAsyncContext(AsyncContext asyncContext) {
    this.asyncContext = asyncContext;
  }
  
  public Map<String, Object> getParameters() {
    return parameters;
  }
  
  public void setParameters(Map<String, Object> parameters) {
    this.parameters = parameters;
    if(this.parameters == null) {
      this.parameters = new HashMap<String, Object>();
    }
  }
  
  public boolean isDebug() {
    return debug;
  }

  public void setDebug(boolean debug) {
    this.debug = debug;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public R getOutput() {
    return output;
  }
  
  public void setOutput(R output) {
    this.output = output;
  }
  
  public Exception getError() {
    return error;
  }
  
  public boolean isRunning() {
    return running;
  }
  
  public boolean isCompleted() {
    return completed;
  }
  
  public boolean isSuccess() {
    return success;
  }
  
  public 
  void start(Map<String, Object> parameters)
    throws Exception
  {
    this.parameters = parameters;
    if(this.parameters == null) {
      this.parameters = new HashMap<String, Object>();
    }
    if(asyncContext != null) {
      asyncContext.start(this);
    }
    else {
      run();
    }
  }
  
  public 
  void start()
    throws Exception
  {
    if(asyncContext != null) {
      asyncContext.start(this);
    }
    else {
      run();
    }
  }
  
  @Override
  public 
  void run() 
  {
    if(debug) log("Start job " + name + "...");
    long start = System.currentTimeMillis();
    this.running   = true;
    this.success   = false;
    this.completed = false;
    try {
      this.output = execute();
      this.success = true;
    }
    catch(Exception ex) {
      this.error = ex;
      if(debug) logErr("Exception in job " + name + ": " + ex);
    }
    finally {
      this.elapsed   = System.currentTimeMillis() - start;
      if(debug) log("Job " + name + " completed in " + elapsed + " ms (success=" + success + ")");
      this.running   = false;
      this.completed = true;
      if(asyncContext != null) {
        asyncContext.complete();
      }
    }
  }
  
  protected
  void log(String message)
  {
    logger.debug(message);
    System.out.println(message);
  }
  
  protected
  void logErr(String message)
  {
    logger.error(message);
    System.err.println(message);
  }
  
  public abstract R execute() throws Exception;
}
