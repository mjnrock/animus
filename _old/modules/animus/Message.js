export default function Message(handler, type, data) {
    return {
        handler,
        type,
        data
    };
};