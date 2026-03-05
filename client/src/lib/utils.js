export const normalizeSenderId = (senderId) => {
    if (!senderId) return null;
    if (typeof senderId === "object" && senderId._id) return senderId._id.toString();
    return senderId.toString();
};