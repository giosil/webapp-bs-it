-- DROP USER WEBAPP CASCADE; 

-- DROP TABLESPACE WEBAPP_DATA INCLUDING CONTENTS AND DATAFILES;
-- DROP TABLESPACE WEBAPP_TEMP INCLUDING CONTENTS AND DATAFILES;

CREATE TABLESPACE WEBAPP_DATA DATAFILE '/u02/app/oracle/oradata/ORCL/WEBAPP_DATA.dbf' SIZE 20M REUSE AUTOEXTEND ON NEXT 512K MAXSIZE 8192M;
CREATE TEMPORARY TABLESPACE WEBAPP_TEMP TEMPFILE '/u02/app/oracle/oradata/ORCL/WEBAPP_TEMP.dbf' SIZE 5M AUTOEXTEND ON;

-- SELECT * FROM V$DATAFILE
-- alter system set DEFERRED_SEGMENT_CREATION=FALSE scope=both; // To include empty tables in export

-- To create user WEBAPP without prefix C## in Oracle 12:
ALTER SESSION SET "_ORACLE_SCRIPT"=true;

-- USER SQL
CREATE USER WEBAPP IDENTIFIED BY PASS123 DEFAULT TABLESPACE "WEBAPP_DATA" TEMPORARY TABLESPACE "WEBAPP_TEMP";
-- ROLE
GRANT "RESOURCE" TO WEBAPP WITH ADMIN OPTION;
GRANT "CONNECT" TO WEBAPP WITH ADMIN OPTION;
ALTER USER WEBAPP DEFAULT ROLE "RESOURCE","CONNECT";
-- SYSTEM PRIVILEGES
GRANT CREATE SESSION TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE TABLE TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE PROCEDURE TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE SEQUENCE TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE ANY TRIGGER TO WEBAPP WITH ADMIN OPTION;
GRANT DROP ANY TRIGGER TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE ANY INDEX TO WEBAPP WITH ADMIN OPTION;
GRANT DROP ANY INDEX TO WEBAPP WITH ADMIN OPTION;
GRANT CREATE ANY VIEW TO WEBAPP WITH ADMIN OPTION;
GRANT DROP ANY VIEW TO WEBAPP WITH ADMIN OPTION;

-- To prevent ora-01950 in Oracle 12:
GRANT UNLIMITED TABLESPACE TO WEBAPP;

-- PURGE RECYCLEBIN;
