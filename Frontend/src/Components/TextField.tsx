import type { CSSProperties } from "react";

interface TextFieldProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: string;
  autoCorrect?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: string;
  blurOnSubmit?: boolean;
  autoFocus?: boolean;
  style?: CSSProperties;
}

export { TextField };

const TextField = ({
  label,
  error,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  onSubmitEditing,
  blurOnSubmit,
  autoFocus,
  style,
}: TextFieldProps) => {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label ? <label style={styles.label}>{label}</label> : null}
      <input
        className="tf-input"
        type={secureTextEntry ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        onChange={(e) => onChangeText?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (blurOnSubmit === false) e.preventDefault();
            onSubmitEditing?.();
          }
        }}
        style={{
          ...styles.body,
          border: error ? "1px solid #ef4444" : "1px solid #333",
        }}
      />
      {error ? <span style={styles.errorMssg}>{error}</span> : null}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  label: {
    color: "#aaa",
    fontSize: 13,
    display: "block",
    marginBottom: 6,
  },
  body: {
    height: 48,
    backgroundColor: "#111",
    borderRadius: 10,
    color: "#fff",
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },
  errorMssg: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    display: "block",
  },
};
