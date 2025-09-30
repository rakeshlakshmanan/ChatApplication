const socket = io('http://localhost:3000');
let username = document.getElementById("loggedInUser").value;
let currentUser = null;

//load all conversations
async function loadConversations() {
    try {
        console.log("Logged in username is:", username);
        const [convoRes, allUsersRes] = await Promise.all([
            fetch(`http://localhost:3000/messages/conversations/all/${username}`),
            fetch("/chatapp/getAllUsers")
        ]);
        const convos = await convoRes.json();
        const allUsers = await allUsersRes.json();
        const convosSet = new Set(convos.map(c => c.name));
        allUsers.forEach(user => {
            if (user !== username && !convosSet.has(user)) {
                convos.push({ name: user, isGroup: false });
            }
        });
        const list = document.getElementById("userlist");
        list.innerHTML = "";
        convos.forEach(chat => {
            const li = document.createElement("li");
            li.textContent = chat.name + (chat.isGroup ? " (Group)" : "");
            li.onclick = () => selectUser(chat.name, chat.isGroup);
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading sidebar:", err);
    }
}


//select a chat
function selectUser(user, isGroup = false) {
    currentUser = { name: user, isGroup };
    document.getElementById("chatHeader").innerText = user + (isGroup ? "(Group)" : "");
    document.getElementById("messageArea").style.display = "flex";
    loadMessages();
}

//render message
function renderMessages(msg) {

    const chatbox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + (msg.sender === username ? "sent" : "received");
    if (msg.sender !== username) {
        const senderspan = document.createElement("div");
        senderspan.className = "sender-label";
        senderspan.textContent = msg.sender;

        if (!msg.isGroup) {
            senderspan.classList.add("hidden-sender");
        }
        msgDiv.appendChild(senderspan);
    }

    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.textContent = msg.text;
    msgDiv.appendChild(textDiv);

    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight;

}

//send a message
function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message === "" || !currentUser) return;

    socket.emit('sendMessage', {
        sender: username,
        receiver: currentUser.name,
        text: message,
        isGroup: currentUser.isGroup
    });
    input.value = "";
}

//socket listener
socket.on('receiveMessage', (msg) => {
    if (!currentUser) return;

    const isPrivate = !msg.isGroup &&
        ((msg.sender === username && msg.receiver === currentUser.name) ||
            (msg.sender === currentUser.name && msg.receiver === username));

    const isGroupMsg = msg.isGroup && msg.receiver === currentUser.name;

    if (isPrivate || isGroupMsg) {
        renderMessages(msg);
    }
});


//load messages from backend
async function loadMessages() {

    const chatbox = document.getElementById("chat-box");
    chatbox.innerHTML = "";
    if (!currentUser) return;

    const url = currentUser.isGroup
        ? `http://localhost:3000/messages/group/${currentUser.name}?user=${username}`
        : `http://localhost:3000/messages/private?user1=${username}&user2=${currentUser.name}`;

    const res = await fetch(url);
    const data = await res.json();
    data.forEach(msg => renderMessages(msg));

}


function openGroupModal() {
    document.getElementById("groupModal").style.display = "block";
    loadUsersForGroup();
}

function closeGroupModal() {
    document.getElementById("groupModal").style.display = "none";

}

//load all users into checkboxes (exclusind self)
function loadUsersForGroup() {
    fetch("/chatapp/getAllUsers")
        .then(res => res.json())
        .then(users => {
            const container = document.getElementById("memberCheckboxes");
            container.innerHTML = "";
            users.forEach(name => {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = name;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(" " + name));
                container.appendChild(label);
                container.appendChild(document.createElement("br"));
            });
        })
        .catch(err => {
            console.error("Failed to load user list for group", err);
        });
}

function submitGroup() {
    const groupName = document.getElementById("groupName").value.trim();
    const checkboxes = document.querySelectorAll('#memberCheckboxes input[type="checkbox"]:checked');
    const selectedMembers = Array.from(checkboxes).map(cb => cb.value);

    if (!groupName || selectedMembers.length === 0) {
        alert("Please enter a group name and select members.");
        return;
    }

    const members = [...new Set([...selectedMembers, username])];
    fetch("http://localhost:3000/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName, members }) // include self
    })
        .then(res => res.json())
        .then(data => {
            alert("Group created successfully!");
            closeGroupModal();
            loadConversations(); // Refresh conversation list
        })
        .catch(err => {
            console.error("Error creating group:", err);
            alert("Failed to create group");
        });
}

function summarizeText() {
    const chatBox = document.getElementById("chat-box");
    const messages = chatBox.querySelectorAll(".message");
    let conversation = "";

    messages.forEach(msg => {
        let sender;
        if (msg.classList.contains("sent")) {
            sender = username;
        }
        else {
            const label = msg.querySelector(".sender-label");
            sender = label ? label.textContent.trim() : "Unknown";
        }
        const messageTextSpan = msg.querySelector(".message-text");

        const text = messageTextSpan ? messageTextSpan.textContent.trim() : "";
        if (text) {
            conversation += `${sender}: ${text}\n`;
        }
    });

    const wordCount = conversation.trim().split(/\s+/).length;
    if (wordCount < 50) {
        alert("Summariztion requires minimum of 50 words.");
        return;
    }

    fetch("http://localhost:3000/summarize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: conversation })
    })
        .then(res => res.json())
        .then(data => {
            alert("Summary: \n" + data.summary);
        })
        .catch(err => {
            console.error("Error summarizing text: ", err);
            alert("Failed to generate summary");
        });
}
//let username;
document.addEventListener("DOMContentLoaded", () => {
    //username = document.getElementById("loggedInUser").value;
    loadConversations();
    //loadUsersForGroup();

    const input = document.getElementById("messageInput");
    input.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
});
