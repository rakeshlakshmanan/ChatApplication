package com.chatapp.servlets;

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.json.simple.*;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/getAllUsers")
public class GetAllUsers extends HttpServlet {

    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String currentUser = session.getAttribute("username").toString();
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        try {
            String query = "SELECT username FROM users WHERE username != ?";
            Connection conn = DBConn.getConnection();
            PreparedStatement pst = conn.prepareStatement(query);
            pst.setString(1, currentUser);
            ResultSet rs = pst.executeQuery();

            JSONArray users = new JSONArray();
            while (rs.next()) {
                users.add(rs.getString("username"));
            }
            out.print(users.toString());
            conn.close();

        } catch (Exception e) {
            response.setStatus(500);
            out.print("error " + e.getMessage());
        }
    }

}