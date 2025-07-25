type Props = {
  authorAvatar: string;
  username: string;
  text: string
};
const ProfileMiniCard: React.FC<Props> = ({ authorAvatar, username, text }) => {
  return (
    <div className="m-1 flex items-center gap-2">
      <p>{text}</p>
      <div className="p-1 bg-black/30 flex items-center gap-1">
        <img
          className="w-8 rounded-full h-8 object-cover"
          src={authorAvatar}
          alt=""
        />
        <p className="font-bold">{username}</p>
      </div>
    </div>
  );
};
export default ProfileMiniCard;
