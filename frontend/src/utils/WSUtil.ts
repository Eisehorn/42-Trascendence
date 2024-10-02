const messageHandlers = new Set()

export const addMessageHandler = (handler) => {
    messageHandlers.add(handler)
}

export const removeMessageHandler = (handler) => {
    messageHandlers.delete(handler)
}

export const getMessageHandlers = () => {
    return messageHandlers;
}