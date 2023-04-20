package org.dew.webapp.util;

import java.security.Principal;
import java.util.List;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;

import org.rpc.util.RPCContext;

import org.dew.webapp.bl.User;

public 
class WSContext 
{
  public static int DEFAULT_JOB_TIMEOUT_MILLIS = 180000;
  
  public static
  User getUser()
  {
    Principal principal = RPCContext.getUserPrincipal();
    if(principal instanceof User) {
      return (User) principal;
    }
    Object user = RPCContext.getSessionAttribute("user");
    if(user instanceof User) {
      return (User) user;
    }
    return new User("public");
  }
  
  public static
  User canManage(int idAnagrafica)
  {
    User user = getUser();
    if(user == null) return null;
    String role = user.getRole();
    if(role == null) return null;
    if(role.equalsIgnoreCase("admin")) {
      return user;
    }
    List<Integer> structures = user.getStructures();
    if(structures == null || structures.size() == 0) {
      return null;
    }
    if(structures.contains(idAnagrafica)) {
      return user;
    }
    return null;
  }
  
  public static
  boolean isUserAdmin()
  {
    User user = getUser();
    if(user == null) return false;
    String role = user.getRole();
    if(role == null) return false;
    return role.equalsIgnoreCase("admin");
  }
  
  public static
  AsyncContext startAsync()
  {
    HttpServletRequest request = RPCContext.getRequest();
    if(request == null) {
      return new SimpleAsyncContext();
    }
    if(!request.isAsyncSupported()) {
      System.out.println("request.isAsyncSupported() -> false");
      return new SimpleAsyncContext(request, RPCContext.getResponse());
    }
    try {
      return request.startAsync();
    }
    catch(Exception ex) {
      System.err.println("request.startAsync() -> " + ex);
    }
    return new SimpleAsyncContext(request, RPCContext.getResponse());
  }
  
  public static 
  int waitForAllJobsAreCompleted(AAsyncJob<?>... jobs) 
  {
    return waitForAllJobsAreCompleted(250, DEFAULT_JOB_TIMEOUT_MILLIS, jobs);
  }
  
  public static 
  int waitForAllJobsAreCompleted(int timeoutMillis, AAsyncJob<?>... jobs) 
  {
    return waitForAllJobsAreCompleted(250, timeoutMillis, jobs);
  }
  
  public static 
  int waitForAllJobsAreCompleted(int checkEveryMillis, int timeoutMillis, AAsyncJob<?>... jobs) 
  {
    // The result is count of job completed with error.
    int result = 0;
    int elasped = 0;
    boolean allCompleted = false;
    while(!allCompleted){
      try {
        Thread.sleep(checkEveryMillis);
        elasped += checkEveryMillis;
      }
      catch(Exception ignore) {
      }
      
      result = 0;
      allCompleted = true;
      for(int i = 0; i < jobs.length; i++) {
        AAsyncJob<?> job = jobs[i];
        if(job == null) continue;
        if(job.isCompleted()) {
          result += job.isSuccess() ? 0 : 1;
        }
        else {
          allCompleted = false;
        }
      }
      
      if(timeoutMillis > 0 && elasped > timeoutMillis) {
        break;
      }
    }
    return result;
  }
}
