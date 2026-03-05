export const normalizeSenderId = (senderId) => {
    if (!senderId) return null;
    if (typeof senderId === "object" && senderId._id) return senderId._id.toString();
    return senderId.toString();
};

export const formatMessageTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString())
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (date.toDateString() === yesterday.toDateString())
        return "Yesterday";
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};