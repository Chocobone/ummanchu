import UploadBox from "../components/UploadBox";
import Header from "../components/NavBar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center", padding: "40px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 700 }}>
          Create the Perfect Soundtrack in Seconds
        </h1>

        <p style={{ marginTop: "12px", fontSize: "18px", color: "#555" }}>
          Upload your video, and our AI will compose a unique, royalty-free music track
          that fits its mood and pacing.
        </p>
  <div className="mt-10 flex justify-center">
        
          <UploadBox />
        </div>
      </main>

      <Footer />
    </>
  );
}
