# Chattttttttttttttttttt

- GET backend/chat/channel : Lists all channels
- POST backend/chat/channel : Create channel : {"name": "required", "password": "optional"}
- GET backend/chat/joinedChannels : Lists all joined channels
- POST backend/chat/joinChannel : Join channel : {"channelId": "required", "password": "optional"}
- POST backend/chat/leaveChannel : Leave channel : {"channelId": "required"}