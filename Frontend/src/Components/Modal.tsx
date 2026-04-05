import { ReactNode } from "react";
import type { CSSProperties } from 'react';

interface ModalProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export { Modal };

const Modal = ({
  visible,
  title,
  onClose,
  children,
}: ModalProps) => {
  if (!visible) return null;

  return (
    <div style={styles.body}>
      <div style={styles.position} onClick={onClose} />
      <div style={styles.innerMain}>
        <div style={styles.header} />
        {title ? <div style={styles.title}>{title}</div> : null}
        {children}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  body: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  position: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  innerMain: {
    position: "relative",
    backgroundColor: "#111",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    margin: "0 auto 16px",
  },
  title: { color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 16 },
};
