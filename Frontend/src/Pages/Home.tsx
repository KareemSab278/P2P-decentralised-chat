import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "../Components/Modal";
import { Search } from "../Components/Search";
import type { HomeState } from "../types";
import { getChatsForUser } from "../helpers";

interface Conversation {
  username: string;
}

export { Home };

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = (location.state as HomeState) ?? { username: "" };

  const [modalOpen, setModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const handleSignOut = () => {
    navigate("/sign-in", { replace: true, state: { username: null } });
  };

  useEffect(() => {
    if (!username) return;

    const seen = new Set<string>();
    setConversations([]);

    getChatsForUser(username, (convId) => {
      const other = convId.split("__").find((name) => name !== username);
      if (!other || seen.has(other)) return;

      seen.add(other);
      setConversations((prev) => {
        if (prev.some((item) => item.username === other)) return prev;
        return [{ username: other }, ...prev];
      });
    });
  }, [username]);

  const openChat = (recipient: string) => {
    setModalOpen(false);
    navigate("/chat", {
      state: { myUser: username, recipientUser: recipient },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.pageTitle}>Chats</span>
        <div style={styles.headerActions}>
          <span style={styles.usernameText}>@{username}</span>
          <button style={styles.newButton} onClick={() => setModalOpen(true)}>
            + New
          </button>
          <button style={styles.signOutButton} onClick={handleSignOut}>
            sign out
          </button>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyStateTitle}>No conversations yet.</span>
          <span style={styles.emptyStateText}>
            Tap &ldquo;+ New&rdquo; to find a user and start chatting.
          </span>
        </div>
      ) : (
        <div style={styles.chatList}>
          {conversations.map((item) => (
            <div
              key={item.username}
              style={styles.conversationRow}
              onClick={() =>
                navigate("/chat", {
                  state: { myUser: username, recipientUser: item.username },
                })
              }
            >
              <div style={styles.avatar}>
                <span style={styles.avatarInitial}>
                  {item.username[0].toUpperCase()}
                </span>
              </div>
              <span style={styles.conversationName}>{item.username}</span>
            </div>
          ))}
        </div>
      )}

      <Modal
        visible={modalOpen}
        title="Find a user"
        onClose={() => setModalOpen(false)}
      >
        <Search currentUser={username} onSelect={openChat} />
      </Modal>
    </div>
  );
};

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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #1a1a1a",
    flexShrink: 0,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: 700,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  usernameText: {
    color: "#555",
    fontSize: 13,
  },
  newButton: {
    backgroundColor: "#2563eb",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  signOutButton: {
    backgroundColor: "#eb2525",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  chatList: {
    flex: 1,
    overflowY: "auto",
  },
  conversationRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottom: "1px solid #1a1a1a",
    cursor: "pointer",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
  },
  conversationName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
  },
};
