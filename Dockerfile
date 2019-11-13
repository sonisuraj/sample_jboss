FROM tomcat:8.0
ADD webapp/target/creditprocessor.war /usr/local/tomcat/webapps/
USER root
RUN chmod 777 /usr/local/tomcat/webapps/creditprocessor.war

