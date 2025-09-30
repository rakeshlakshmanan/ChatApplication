package com.chatapp.servlets;
import java.sql.*;


public class DBConn {
	
	private static String url = "jdbc:mysql://localhost:3306/logininfo";
	private static String dbUsername = "root";
	private static String dbPass="Yajash@2391";
	private static String driver = "com.mysql.jdbc.Driver";
	private static Connection conn = null;
	
	public static Connection getConnection() {
		try {
			Class.forName(driver); //to create obj for driver class
			if(conn == null || conn.isClosed()) {
				conn = DriverManager.getConnection(url, dbUsername,dbPass);
			}
			
		}catch (Exception e) {
			System.out.println("Error :  " + e.getMessage());
		}
		return conn;
	}
	
	public static void main(String[] args) {
		//DBConn conn = new DBConn();
		DBConn.getConnection();
	}
}
