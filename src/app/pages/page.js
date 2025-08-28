"use client";

import { useState } from "react";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Nav from "@/components/Nav";

export default function EditorPage() {
  const [mode, setMode] = useState("create");
  const [pageId, setPageId] = useState(null);

  const handlePageCreated = (newPageId) => {
    setPageId(newPageId);
    setMode("edit");
  };

  const handlePageDeleted = () => {
    setPageId(null);
    setMode("create");
  };

  const switchToCreateMode = () => {
    setMode("create");
    setPageId(null);
  };

  const switchToEditMode = () => {
    const id = prompt("Enter page ID to edit:");
    if (id?.trim()) {
      setPageId(id);
      setMode("edit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Nav/>
      {/* Editor Component */}
      <Editor
        mode={mode}
        pageId={pageId || undefined}
        onPageCreated={handlePageCreated}
        onPageDeleted={handlePageDeleted}
      />
    </div>
  );
}
