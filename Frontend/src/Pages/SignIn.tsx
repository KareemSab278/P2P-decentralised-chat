import { useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { gun } from "../gun";
import { TextField } from "../Components/TextField";
import Button from "../Components/Button";

export { SignIn };

const SignIn = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    const u = username.trim();
    if (!u || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    setError("");

    gun
      .get("users")
      .get(u)
      .once((data: any) => {
        if (data) {
          setLoading(false);
          setError("Username already taken.");
          return;
        }

        (gun as any).user().create(u, password, (ack: any) => {
          setLoading(false);
          if (ack.err) {
            setError(ack.err);
            return;
          }

          gun.get("users").get(u).put({ createdAt: Date.now() });

          navigate("/home", { replace: true, state: { username: u } });
        });
      });
  };

  const handleSignIn = () => {
    const u = username.trim();
    if (!u || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    (gun as any).user().auth(u, password, (ack: any) => {
      setLoading(false);
      if (ack.err) {
        setError("Incorrect username or password.");
        return;
      }
      navigate("/home", { replace: true, state: { username: u } });
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>P2P Chat</h1>
        <p style={styles.subtitle}>
          {mode === "signin"
            ? "Sign in to your account"
            : "Create a new account"}
        </p>

        <div style={styles.card}>
          <TextField
            label="Username"
            placeholder="your_username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <p style={styles.errorText}>{error}</p> : null}
          <Button
            label={mode === "signin" ? "Sign In" : "Create Account"}
            onPress={mode === "signin" ? handleSignIn : handleSignUp}
            loading={loading}
          />
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            style={styles.modeSwitch}
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  wrapper: {
    maxWidth: 400,
    width: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: 700,
    textAlign: "center",
    margin: "0 0 6px",
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #222",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    margin: "0 0 12px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
  modeSwitch: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
