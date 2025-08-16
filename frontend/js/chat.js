 class ChatSystem {
      constructor() {
        this.socket = null;
        this.currentUser = null;
        this.currentRecipient = null;
        this.isConnected = false;
        this.unreadCount = 0;
        
        this.initializeElements();
        this.loadUserData();
        this.setupEventListeners();
      }

      initializeElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatModal = document.getElementById('chatModal');
        this.closeChatBtn = document.getElementById('closeChatBtn');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.recipientSelect = document.getElementById('recipientSelect');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatNotification = document.getElementById('chatNotification');
      }

      loadUserData() {
        // Get user data from your existing authentication system
        // You can modify this to get data from wherever you store it
        this.currentUser = {
          _id: this.getUserId(),
          role: this.getUserRole(),
          name: this.getUserName()
        };

        console.log('Current user:', this.currentUser);
      }

      // These methods should be modified to work with your existing auth system
      getUserId() {
        // Replace with your actual method to get user ID
        // Example: return localStorage.getItem('userId') || sessionStorage.getItem('userId');
        return localStorage.getItem('userId') || `user_${Date.now()}`;
      }

      getUserRole() {
        // Replace with your actual method to get user role
        return localStorage.getItem('userRole') || 'user';
      }

      getUserName() {
        // Replace with your actual method to get user name
        return localStorage.getItem('userName') || 'User';
      }

      setupEventListeners() {
        this.chatButton.addEventListener('click', () => this.openChat());
        this.closeChatBtn.addEventListener('click', () => this.closeChat());
        
        this.chatModal.addEventListener('click', (e) => {
          if (e.target === this.chatModal) this.closeChat();
        });

        this.recipientSelect.addEventListener('change', () => this.selectRecipient());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !this.sendBtn.disabled) {
            this.sendMessage();
          }
        });

        // Close chat with Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.chatModal.style.display === 'flex') {
            this.closeChat();
          }
        });
      }

      openChat() {
        this.chatModal.style.display = 'flex';
        this.connectToSocket();
        this.resetUnreadCount();
         this.populateRecipientDropdown(); 
      }

      closeChat() {
        this.chatModal.style.display = 'none';
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
          this.isConnected = false;
        }
        this.updateConnectionStatus('disconnected', 'Disconnected');
      }

      connectToSocket() {
        if (this.isConnected) return;

        this.updateConnectionStatus('connecting', 'Connecting...');

        try {
          this.socket = io('https://pet-ylqw.onrender.com');

          this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.isConnected = true;
            this.updateConnectionStatus('connected', `Connected as ${this.currentUser.role}`);
            
            this.socket.emit('register', { userId: this.currentUser.id });
          });

          this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.isConnected = false;
            this.updateConnectionStatus('disconnected', 'Disconnected');
          });

          this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.updateConnectionStatus('disconnected', 'Connection failed');
          });

          this.socket.on('chat message', (msg) => {
            console.log('Received message:', msg);
            
            if (msg.senderId !== this.currentUser.id) {
              this.addMessage(msg, false);
              
              // Update notification if chat is closed
              if (this.chatModal.style.display === 'none') {
                this.updateUnreadCount(1);
              }
            }
          });

        } catch (error) {
          console.error('Error connecting:', error);
          this.updateConnectionStatus('disconnected', 'Connection failed');
        }
      }

      selectRecipient() {
        const recipientId = this.recipientSelect.value;
        
        if (!recipientId) {
          this.currentRecipient = null;
          this.messageInput.disabled = true;
          this.sendBtn.disabled = true;
          this.chatMessages.innerHTML = '<div class="empty-state">Select a recipient to start chatting</div>';
          return;
        }

        this.currentRecipient = recipientId;
        this.messageInput.disabled = false;
        this.sendBtn.disabled = false;
        this.messageInput.focus();
        
        this.loadChatHistory();
      }

      loadChatHistory() {
        if (!this.currentUser._id || !this.currentRecipient) return;

        console.log(`Loading chat history between ${this.currentUser._id} and ${this.currentRecipient}`);
        
        fetch(`https://pet-ylqw.onrender.com/api/chat/${this.currentUser._id}/${this.currentRecipient}`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(messages => {
            console.log('Loaded messages:', messages);
            this.displayChatHistory(messages);
          })
          .catch(err => {
            console.error('Error loading chat history:', err);
            this.chatMessages.innerHTML = '<div class="empty-state">Could not load chat history</div>';
          });
      }

      displayChatHistory(messages) {
        this.chatMessages.innerHTML = '';
        
        if (messages.length === 0) {
          this.chatMessages.innerHTML = '<div class="empty-state">No messages yet. Start the conversation!</div>';
          return;
        }

        messages.forEach(msg => {
          const isSent = msg.senderId === this.currentUser._id;
          this.addMessage(msg, isSent);
        });
      }

      addMessage(msg, isSent) {
        // Clear empty state
        const emptyState = this.chatMessages.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const time = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        messageDiv.innerHTML = `
          <div class="message-bubble">
            ${msg.message}
          </div>
          <div class="message-info">
            ${isSent ? 'You' : msg.senderRole} • ${time}
          </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      }

      sendMessage() {
        if (!this.isConnected || !this.socket || !this.currentRecipient) return;

        const message = this.messageInput.value.trim();
        if (!message) return;

        const msgData = {
          senderId: this.currentUser._id,
          recipientId: this.currentRecipient,
          senderRole: this.currentUser.role,
          message: message
        };

        console.log('Sending message:', msgData);
        
        this.socket.emit('chat message', msgData);
        this.addMessage(msgData, true);
        this.messageInput.value = '';
      }

      updateConnectionStatus(status, message) {
        this.connectionStatus.className = `connection-status ${status}`;
        this.connectionStatus.textContent = message;
      }

      updateUnreadCount(increment) {
        this.unreadCount += increment;
        
        if (this.unreadCount > 0) {
          this.chatNotification.textContent = this.unreadCount;
          this.chatNotification.style.display = 'flex';
        } else {
          this.chatNotification.style.display = 'none';
        }
      }

      resetUnreadCount() {
        this.unreadCount = 0;
        this.chatNotification.style.display = 'none';
      }

      async populateRecipientDropdown() {
  const select = this.recipientSelect;
  select.innerHTML = `<option value="">-- Select a recipient --</option>`;

  try {
    const res = await fetch('/api/users'); // your API to get user list
    const users = await res.json();
    console.log(users);

    if (this.currentUser.role === 'admin') {
      users.forEach(user => {
        if (user._id !== this.currentUser._id) {
          const option = document.createElement('option');
          option.value = user._id;
          option.textContent = user.name;
          select.appendChild(option);
        }
      });
    } else {
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        const option = document.createElement('option');
        option.value = admin.id;
        option.textContent = admin.name || 'Admin';
        select.appendChild(option);
      }
    }

  } catch (err) {
    console.error('Failed to load users:', err);
    const option = document.createElement('option');
    option.textContent = 'Error loading users';
    option.disabled = true;
    select.appendChild(option);
  }
}

    }

    // Initialize chat system when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize your existing home.js functionality
      if (typeof window.initializeHome === 'function') {
        window.initializeHome();
      }

      // Initialize chat system
      window.chatSystem = new ChatSystem();
      console.log('Chat system initialized');
    });

    // Make chat system globally available
    window.ChatSystem = ChatSystem;