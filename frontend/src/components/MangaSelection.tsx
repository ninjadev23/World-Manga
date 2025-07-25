type Props = {
    title: string
    categories: string[]
    cover: string
    onClick: ()=>void
}
const MangaSelection: React.FC<Props> = ({title, categories, cover, onClick })=>{
    return (
        
                  <div 
                    onClick={onClick}
                    className="hover:cursor-pointer hover:bg-gray-800/30 bg-black/30 flex items-center gap-2 border-b p-2 border-white/30"
                  >
                    <img
                      className="w-15 h-15 object-cover"
                      src={cover}
                      alt="cover"
                    />
                    <div>
                      <h2 className="font-bold capitalize">{title}</h2>
                      <div className="max-h-20 flex gap-2 overflow-hidden flex-wrap">
                        {categories.map((category, index) => (
                          <p className="text-sm border border-white/30 p-1 capitalize" key={index}>{category}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                
    )
}
export default MangaSelection