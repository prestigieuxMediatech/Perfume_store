export default function AdminRootLayout({ children }) {
  return (
    <>
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #0A0A0A !important;
          overflow: hidden;
        }
      `}</style>
      <div style={{
        margin:     0,
        padding:    0,
        background: "#0A0A0A",
        minHeight:  "100vh",
        overflow:   "hidden",
      }}>
        {children}
      </div>
    </>
  );
}