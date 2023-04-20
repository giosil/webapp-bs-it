package org.dew.webapp.bl;

import java.io.Serializable;

import java.security.Principal;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Bean Utente
 */
public 
class User implements Principal, Serializable 
{
  private static final long serialVersionUID = -3957210299425203588L;

  private String userName;
  
  private String lastName;
  private String firstName;
  private String email;
  private String mobile;
  private String taxCode;
  private String role;
  private String message;
  
  private String tokenId;
  private String rememberCode;
  
  private Date currLogin;
  private Date lastLogin;
  
  private Map<String, Object> resources;
  
  private List<Integer> structures;
  
  public User() {
  }

  public User(String userName) {
    this.userName = userName;
  }
  
  public User(String userName, String tokenId) {
    this.userName = userName;
    this.tokenId = tokenId;
  }

  @Override
  public String getName() {
    return userName;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getMobile() {
    return mobile;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public String getTaxCode() {
    return taxCode;
  }

  public void setTaxCode(String taxCode) {
    this.taxCode = taxCode;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getTokenId() {
    return tokenId;
  }

  public void setTokenId(String tokenId) {
    this.tokenId = tokenId;
  }

  public String getRememberCode() {
    return rememberCode;
  }

  public void setRememberCode(String rememberCode) {
    this.rememberCode = rememberCode;
  }

  public Date getCurrLogin() {
    return currLogin;
  }

  public void setCurrLogin(Date currLogin) {
    this.currLogin = currLogin;
  }

  public Date getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(Date lastLogin) {
    this.lastLogin = lastLogin;
  }

  public Map<String, Object> getResources() {
    return resources;
  }

  public void setResources(Map<String, Object> resources) {
    this.resources = resources;
  }

  public List<Integer> getStructures() {
    return structures;
  }

  public void setStructures(List<Integer> structures) {
    this.structures = structures;
  }

  @Override
  public boolean equals(Object object) {
    if (object instanceof User) {
      String sUserName = ((User) object).getUserName();
      return sUserName != null && sUserName.equals(userName);
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (userName != null) {
      return userName.hashCode();
    }
    return 0;
  }
  
  @Override
  public String toString() {
    return "User(" + userName + "," + role + ")";
  }
}
