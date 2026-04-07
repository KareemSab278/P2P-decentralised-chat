import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendMessage, subscribeMessages, conversationId } from "../helpers";
import { TextField } from "../Components/TextField";
import type { ChatState, Message } from "../types";
import { Modal } from "../Components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { encryptMessage, tryDecryptMessage } from "../secureMessages";

export { Chat };

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { myUser, recipientUser } = (location.state as ChatState) ?? {
    myUser: "",
    recipientUser: "",
  };
  const convId = conversationId(myUser, recipientUser);

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<"delete" | "block" | null>(
    null,
  );

  const seen = useRef(new Set<string>());
  const listRef = useRef<HTMLDivElement>(null);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const cleanup = subscribeMessages(convId, (msg: any, key: string) => {
    if (!msg || !msg.message) return;
    if (seen.current.has(key)) return;
    seen.current.add(key);

    const newMsg: Message = {
      id: key,
      user_id: msg.user_id,
      user_tag: msg.user_tag,
      recipient: msg.recipient,
      message: msg.message,
      timestamp: msg.timestamp,
    };

    setMessages((prev) =>
      [...prev, newMsg].sort((a, b) => a.timestamp - b.timestamp),
    );
  });

  useEffect(() => {
    cleanup();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");

    const payloadMessage = encryptionKey
      ? encryptMessage({ message: trimmed, key: encryptionKey })
      : trimmed;

    sendMessage(convId, {
      user_id: myUser,
      user_tag: `@${myUser}`,
      recipient: recipientUser,
      message: payloadMessage,
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <span style={styles.backButtonText}>{"<"}</span>
        </button>

        <span style={styles.headerTitle}>{recipientUser}</span>
        <button
          style={styles.configKeysButton}
          onClick={() => setActiveModal("ee2e")}
        >
          Configure Keys
        </button>

        <button
          style={styles.chatSettingsButton}
          onClick={() => setActiveModal("chatSettings")}
        >
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>

      <div ref={listRef} style={styles.messageList}>
        {messages.map((item) => {
          const isMe = item.user_id === myUser;
          const displayMessage = tryDecryptMessage(item.message, decryptionKey ?? undefined);

          return (
            <div key={item.id} style={getMessageBubbleStyle(isMe)}>
              {!isMe && (
                <div style={styles.messageUserTag}>{item.user_tag}</div>
              )}
              <div style={styles.messageText}>{displayMessage}</div>
              <div style={styles.messageTime}>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}

        <Modal
          visible={activeModal === "ee2e"}
          title="Find a user"
          onClose={() => setActiveModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ color: "#fff" }}>
              Encryption Key (For {recipientUser} to decrypt messages you send)
            </span>
            {/* this is going to set the encryption keys and decryption keys to the recepient/receiver */}
            {/* it should affect every message before it and after it. so the user can only see those messages - otherwise it is unreadable */}
            <TextField
              placeholder="Encryption Key"
              value={encryptionKey ?? ""}
              onChangeText={setEncryptionKey}
              style={{ marginBottom: 16 }}
            />
            <span style={{ color: "#fff" }}>
              Decryption Key (for you to decrypt messages {recipientUser} sends)
            </span>
            <TextField
              placeholder="Decryption Key"
              value={decryptionKey ?? ""}
              onChangeText={setDecryptionKey}
            />
          </div>
        </Modal>

        <Modal
          visible={activeModal === "chatSettings"}
          onClose={() => setActiveModal(null)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            <button
              style={styles.settingsOptionsButton}
              onClick={() => {
                setConfirmation("block");
                setActiveModal("confirmation");
              }}
            >
              Block {recipientUser}
            </button>
            <button
              style={styles.settingsOptionsButton}
              onClick={() => {
                setConfirmation("delete");
                setActiveModal("confirmation");
              }}
            >
              Delete Chat with {recipientUser}
            </button>
          </div>
        </Modal>

        <Modal
          visible={activeModal === "confirmation"}
          onClose={() => setActiveModal(null)}
        >
          Confirmation To {" "}
          {confirmation === "delete"
            ? `Delete Chat with ${recipientUser}`
            : `Block ${recipientUser}`}
          ?
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              marginTop: 16,
            }}
          >
            <button
              style={styles.settingsOptionsButton}
              onClick={() => {
                if (confirmation === "delete") {
                  // delete conversation logic here
                } else {
                  // block user logic here (not today im tured)
                }
                setActiveModal(null);
              }}
            >
              Confirmed
            </button>
            <button
              style={styles.settingsOptionsButton}
              onClick={() => setActiveModal(null)}
            >
              No, Cancel
            </button>
          </div>
        </Modal>
      </div>

      <div style={styles.inputRow}>
        <TextField
          placeholder="Message..."
          value={text}
          onChangeText={setText}
          style={styles.inputField}
          onSubmitEditing={send}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <button style={styles.sendButton} onClick={send}>
          <span style={styles.sendButtonText}>Send</span>
        </button>
      </div>
    </div>
  );
};

function getMessageBubbleStyle(isMe: boolean): CSSProperties {
  return {
    ...styles.messageBubble,
    backgroundColor: isMe ? "#2563eb" : "#1a1a1a",
    alignSelf: isMe ? "flex-end" : "flex-start",
    borderBottomRightRadius: isMe ? 4 : 14,
    borderBottomLeftRadius: isMe ? 14 : 4,
  };
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#000",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #1a1a1a",
    flexShrink: 0,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  configKeysButton: {
    backgroundColor: "#2563eb",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex-end",
    marginLeft: "auto",
  },
  chatSettingsButton: {
    backgroundColor: "#1a1a1a",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex-end",
    marginLeft: 8,
  },
  settingsOptionsButton: {
    backgroundColor: "#eb2525",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    maxWidth: 200,
    fontSize: 14,
    cursor: "pointer",
    display: "column",
  },
  backButtonText: {
    color: "#2563eb",
    fontSize: 20,
    fontWeight: 700,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
  },
  messageUserTag: {
    color: "#aaa",
    fontSize: 11,
    marginBottom: 2,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  messageTime: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 12px 12px",
    borderTop: "1px solid #1a1a1a",
    backgroundColor: "#000",
    flexShrink: 0,
  },
  inputField: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    paddingLeft: 16,
    paddingRight: 16,
    height: 48,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
  },
};
