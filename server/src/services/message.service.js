import Message from "../models/message.model.js";

export const saveMessage = async ({ senderId, receiverId, text, image }) => {

    const newMessage = new Message ({ senderId, receiverId, text, image });
    await newMessage.save();
    return newMessage;

}