import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
export default function BackButton({className}:{className?: string}){
    const navigate = useNavigate()
    return (
        <button
        onClick={() => navigate(-1)}
        className={`${className} hover:cursor-pointer p-2 rounded-md bg-black/20 text-white hover:bg-black/30 transition`}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
    )
}