import React, { ReactNode } from "react";

const PostExploreLayout = ({ children }: { children: ReactNode }) => {
  return <div className="dark:bg-black">{children}</div>;
};

export default PostExploreLayout;
