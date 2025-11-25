


export default function UploadBox() {
  return (
    <div
      style={{
        border: "2px dashed #ccc",
        padding: "60px",
        borderRadius: "12px",
        background: "#fafafa",
      }}
    >
      <h3>Drag & Drop Your Video Here</h3>
      <p>Supports MP4, MOV. Max 500MB.</p>
      <button
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "#4C46FF",
          color: "white",
          borderRadius: "8px",
          border: "none",
        }}
      >
        Upload from Computer
      </button>
    </div>
  );
}
