"use client";

import { FileUploader } from "@/components/media/media-uploader";
import React from "react";

const SandBox = () => {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center dark:bg-textAlternative">
      <div className="max-w-4xl max-h-20">
        <FileUploader
          maxFiles={10}
          maxSize={50}
          onFilesSelected={async(files) => {
            console.log("Selected files:", files);
            

          }}
        />
      </div>
    </div>
  );
};

export default SandBox;
