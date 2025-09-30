<%@ page import = "jakarta.servlet.http.*,jakarta.servlet.*" %>
<%
    if(session==null || session.getAttribute("username") == null){
        response.sendRedirect("index.html");
        return;
    }

    String username = session.getAttribute("username").toString();

%>    

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <link rel="stylesheet" href="css/chat.css">
    <script src = "https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
    <%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
</head>
<body>

    <input type = "hidden" id="loggedInUser" value="<%= username %>" />
    <div class ="logout-button">
            <a href="logout.jsp">Logout</a>
    </div> 

    <div class = "chat-wrapper">
        <div class="sidebar">
            <div class = "profile">
                <span><strong>Your Chats</strong></span>
                <p>Logged in as <strong><%= username%></strong></p>
            </div>

            <ul id="userlist">
                <!-- Dynamic user list -->
                
            </ul>  
            <div class="create-group">              
            <button onclick= "openGroupModal()">+ Create Group</button>
            </div>
        </div>

        <div class="chat-panel">
            <div class ="chat-header" id = "chatHeader">Select a chat</div>
            <div class="chat-box" id="chat-box"></div> 

            <!--Initally hidden, will show when user is selected-->   

            <div class="chat-input" id="messageArea" style="display: none;">
                <input type="text" id="messageInput" placeholder="Type your message..."/>
                <button onclick="sendMessage()">Send</button>
                <button onclick="summarizeText()">Summarize</button>
            </div>
        </div>

    </div>   
<!--Group Modal-->
<div id="groupModal" class="modal" style="display: none;">
    <div class = "modal-content">
        <span class = "close" onclick="closeGroupModal()">&times;</span>
        <h3>Create Group</h3>
        <input type = "text" id="groupName" placeholder="Group Name"/>
        <div id="memberCheckboxes"><!--Filled with checkboxes --></div>
        <button onclick="submitGroup()">Create Group</button>
    </div>
</div>    
    <script src = "js/chat.js"></script>
    
</body>
</html>