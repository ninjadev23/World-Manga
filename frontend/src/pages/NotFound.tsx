import BackButton from "../components/BackButton";
export default function NotFound() {
  return (
    <div className="mt-10 flex justify-center items-center flex-col">
      <h1 className="text-center text-4xl">404 Not Found</h1>
      <div className="flex items-center">
        <BackButton/>
            Volver
      </div>
    </div>
  );
}
