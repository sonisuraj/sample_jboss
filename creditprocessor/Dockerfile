FROM jboss/wildfly
ADD webapp/creditprocessor.war /opt/jboss/wildfly/standalone/deployments/
USER root
RUN chmod 777 /opt/jboss/wildfly/standalone/deployments/creditprocessor.war
