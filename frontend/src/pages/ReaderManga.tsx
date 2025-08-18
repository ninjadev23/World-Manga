import { useParams, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import BackButton from "../components/BackButton";
// Styles for pdf-viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ReaderManga() {
  const { title, file, volume } = useParams();
  const navigate = useNavigate();
  if (!title || !file || !volume) navigate("/404");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  console.log(title, file, volume);
  return (
    <div className="text-white text-center p-3 bg-black/40 backdrop-blur-md">
      <BackButton className="flex"/>
      <h1 className="m-3 capitalize font-bold text-2xl">
        {title} Tomo {volume}
      </h1>
      <div className="w-full h-screen overflow-y-auto bg-black px-2">
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={file as any}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  );
}
