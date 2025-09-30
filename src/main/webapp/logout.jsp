<%@ page import = "jakarta.servlet.http.*,jakarta.servlet.*" %>
<%
   session.invalidate();
   response.sendRedirect("index.html");

%> 