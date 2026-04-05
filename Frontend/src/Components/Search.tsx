import { useState } from "react";
import type { CSSProperties } from "react";

import { gun } from "../gun";
import { TextField } from "./TextField";
import Button from "./Button";

interface SearchProps {
  currentUser: string;
  onSelect: (username: string) => void;
}

export { Search };

const Search = ({ currentUser, onSelect }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "not_found">("idle");

  function lookup() {
    const q = query.trim();
    if (!q || q === currentUser) {
      setStatus("not_found");
      return;
    }
    setStatus("idle");
    (gun as any).get("~@" + q).once((data: any) => {
      const exists = data != null && Object.keys(data).some((k) => k !== "_");
      setStatus(exists ? "found" : "not_found");
    });
  }

  return (
    <div>
      <TextField
        label="Username"
        placeholder="Enter exact username..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setStatus("idle");
        }}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={lookup}
        returnKeyType="search"
      />
      <Button label="Search" onPress={lookup} variant="grey" />
      {status === "found" && (
        <div style={styles.results} onClick={() => onSelect(query.trim())}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
            {query.trim()}
          </div>
          <div style={{ color: "#2563eb", fontSize: 12, marginTop: 2 }}>
            Tap to start chat
          </div>
        </div>
      )}
      {status === "not_found" && (
        <div style={{ color: "#ef4444", marginTop: 12, fontSize: 14 }}>
          No user found with that username.
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  results: {
    marginTop: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    border: "1px solid #2563eb",
    cursor: "pointer",
  },
};
