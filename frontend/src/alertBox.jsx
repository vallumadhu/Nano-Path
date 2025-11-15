export default function AlertBox({ alertmessages }) {
    return (
        <div className="alert-box">
            {alertmessages.map(msg => (
                <div className="alert-message" key={msg.id}>
                    <p>{msg.text}</p>
                </div>
            ))}
        </div>
    );
}