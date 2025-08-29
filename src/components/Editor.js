"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { 
  Trash2, 
  Plus, 
  Edit, 
  Save, 
  X,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import api from "@/lib/api";

const linkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Please enter a valid URL"),
});

const pageSchema = z.object({
  title: z.string().min(1, "Page title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long"),
  links: z.array(linkSchema),
});

const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
  { value: "instagram", label: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" },
  { value: "twitter", label: "Twitter", color: "bg-blue-400 hover:bg-blue-500" },
  { value: "github", label: "GitHub", color: "bg-gray-900 hover:bg-gray-800" },
  { value: "linkedin", label: "LinkedIn", color: "bg-blue-700 hover:bg-blue-800" },
  { value: "youtube", label: "YouTube", color: "bg-red-600 hover:bg-red-700" },
  { value: "tiktok", label: "TikTok", color: "bg-black hover:bg-gray-800" },
  { value: "whatsapp", label: "WhatsApp", color: "bg-green-500 hover:bg-green-600" },
  { value: "telegram", label: "Telegram", color: "bg-blue-500 hover:bg-blue-600" },
  { value: "custom", label: "Custom", color: "bg-gray-600 hover:bg-gray-700" },
];

export default function Editor({ mode, pageId, onPageCreated, onPageDeleted }) {
  const [currentPageId, setCurrentPageId] = useState(pageId || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      description: "",
      links: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "links",
  });

  const watchedValues = watch();

  useEffect(() => {
    if (mode === "edit" && pageId) {
      loadPageData(pageId);
    } 
  }, [mode, pageId]);

  const loadPageData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const pageResponse = await api.get(`/pages/${id}`);
      const pageData = pageResponse.data;
      
      const linksResponse = await api.get(`/links/${id}`);
      const linksData = linksResponse.data;
      
      setValue("title", pageData.title);
      setValue("description", pageData.description);
      setValue("links", linksData.map(link => ({
        platform: link.platform,
        url: link.url,
      })));
      
      setCurrentPageId(id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    const pageName = prompt("Enter a name for your page:");
    if (!pageName?.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/pages/", { name: pageName });
      console.log(response);
      const newPageId = response.data.id;
      setCurrentPageId(newPageId);
      onPageCreated?.(newPageId);
      setSuccess("Page created successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (data) => {
    if (!currentPageId) return;

    setSaving(true);
    setError(null);

    try {
      await api.put(`/pages/${currentPageId}`, {
        title: data.title,
        description: data.description,
      });

      const existingLinks = await api.get(`/links/${currentPageId}`);
      const existingLinksData = existingLinks.data;
      
      for (const existingLink of existingLinksData) {
        const stillExists = data.links.some(link => 
          link.platform === existingLink.platform && link.url === existingLink.url
        );
        if (!stillExists) {
          await api.delete(`/links/${existingLink.id}`);
        }
      }

      for (const link of data.links) {
        const existingLink = existingLinksData.find(el => 
          el.platform === link.platform && el.url === link.url
        );
        
        if (existingLink) {
          await api.put(`/links/${existingLink.id}`, link);
        } else {
          await api.post("/links/", {
            ...link,
            page_id: currentPageId,
          });
        }
      }

      setSuccess("Page saved successfully!");
      reset(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!currentPageId || !confirm("Are you sure you want to delete this page?")) return;

    setDeleting(true);
    setError(null);

    try {
      await api.delete(`/pages/${currentPageId}`);
      onPageDeleted?.();
      setSuccess("Page deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete page");
    } finally {
      setDeleting(false);
    }
  };

  const addLink = () => {
    append({ platform: "facebook", url: "" });
  };

  const removeLink = (index) => {
    remove(index);
    if (editingLinkIndex === index) {
      setEditingLinkIndex(null);
    }
  };

  const startEditLink = (index) => {
    setEditingLinkIndex(index);
  };

  const saveLinkEdit = (index) => {
    setEditingLinkIndex(null);
  };

  const cancelLinkEdit = () => {
    setEditingLinkIndex(null);
  };

  const getPlatformColor = (platform) => {
    return PLATFORM_OPTIONS.find(opt => opt.value === platform)?.color || "bg-gray-600";
  };

  const getPlatformLabel = (platform) => {
    return PLATFORM_OPTIONS.find(opt => opt.value === platform)?.label || "Custom";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create New Page" : "Edit Page"}
          </h1>
          
          <div className="flex gap-3">
            {mode === "create" && !currentPageId && (
              <Button
                onClick={handleCreatePage}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <LoadingSpinner /> : "Create Page"}
              </Button>
            )}
            
            {currentPageId && (
              <>
                <Button
                  onClick={handleDeletePage}
                  disabled={deleting}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? <LoadingSpinner /> : <><Trash2 className="w-4 h-4 mr-2" />Delete Page</>}
                </Button>
                
                <Button
                  onClick={handleSubmit(handleSavePage)}
                  disabled={saving || !isDirty}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? <LoadingSpinner /> : <><Save className="w-4 h-4 mr-2" />Save Page</>}
                </Button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Page Settings</h2>
            
            <form className="space-y-6">
              {/* Page Title */}
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter page title"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter page description"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Links</Label>
                  <Button
                    type="button"
                    onClick={addLink}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                      {editingLinkIndex === index ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Platform</Label>
                            <select
                              {...register(`links.${index}.platform`)}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {PLATFORM_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <Label>URL</Label>
                            <Input
                              {...register(`links.${index}.url`)}
                              placeholder="https://example.com"
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => saveLinkEdit(index)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              type="button"
                              onClick={cancelLinkEdit}
                              size="sm"
                              variant="outline"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{getPlatformLabel(watchedValues.links[index]?.platform)}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {watchedValues.links[index]?.url}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => startEditLink(index)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() => removeLink(index)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {errors.links?.[index] && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.links[index]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
