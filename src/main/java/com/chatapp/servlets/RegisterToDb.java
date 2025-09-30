package com.chatapp.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;

@WebServlet("/RegisterToDb")
public class RegisterToDb extends HttpServlet {

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		
		String user = request.getParameter("username");
		String pass = request.getParameter("password");

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		
		try {
			
			
			String query = "Insert into users (username, password) VALUES (?, ?)";
			Connection conn = DBConn.getConnection();
			PreparedStatement pst = conn.prepareStatement(query);
			pst.setString(1, user);
			pst.setString(2,pass);
			
			int rows = pst.executeUpdate();
			
			if(rows > 0) {
				out.println("<h2> Registration successfull! <a href='index.html'> Login now </a></h2>");
			}
			else {
				out.println("<h2> Registration failed!! Try Again</h2>");
			}
			
			conn.close();
		} catch (SQLIntegrityConstraintViolationException e) {
			out.println("<h2>Username Already exists. <a href='register.html'> Try a different username </a>  </h2>");
		}catch (Exception e) {
			out.println("<h2>Error: "+ e.getMessage() + "</h2>");
		}
	}
}

