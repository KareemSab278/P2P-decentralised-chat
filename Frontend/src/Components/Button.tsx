import type { CSSProperties } from 'react';

type ButtonVariant = "white" | "grey" | "blue";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

const bgColor: Record<ButtonVariant, string> = {
  white: "#fff",
  grey: "#555",
  blue: "#2563eb",
};

export default function Button({
  label,
  onPress,
  variant = "blue",
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      style={{
        ...styles.button,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.4 : 1,
        backgroundColor: bgColor[variant],
      }}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <span
          style={{
            color: variant === "white" ? "#000" : "#fff",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

const styles: { [key: string]: CSSProperties } = {
  button: {
    height: 48,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 6,
    width: "100%",
    border: "none",
  },
};
