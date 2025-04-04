import { CommunityInterface } from "@/interface/auth/community.interface";
import { useRouter } from "next/navigation";

const CommunityCard = ({ community }: { community: CommunityInterface }) => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer border-b p-4 hover:bg-foreground/5 rounded-md my-2"
      onClick={() => {
        router.push(`/community/${community.id}`);
      }}
    >
      <h2 className="text-xl font-bold">{community.name}</h2>
      <p>{community.description}</p>
      <p>Created by: {community.creator.name}</p>
      <p>Members: {community.members.length}</p>
      <p>Posts: {community.posts.length}</p>
      {community.category && <p>Category: {community.category.name}</p>}
      <p>Created At: {new Date(community.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CommunityCard;
