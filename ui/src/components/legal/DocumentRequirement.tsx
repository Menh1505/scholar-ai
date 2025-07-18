import React, { useEffect, useState } from "react";
import Fieldset from "../Fieldset";
import { useLegalStore } from "@/stores/useLegalStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DocumentRequirement = () => {
  const { documents, loading, error, getMyDocuments, deleteDocument, updateDocument, clearError } = useLegalStore();

  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    getMyDocuments();
  }, [getMyDocuments]);

  const handleDetail = (documentId: string) => {
    setSelectedDocument(selectedDocument === documentId ? null : documentId);
  };

  const handleEdit = async (documentId: string) => {
    const document = documents.find((doc) => doc._id === documentId);
    if (!document) return;

    // Toggle between pending and completed
    const newStatus = document.status === "pending" ? "completed" : "pending";

    try {
      await updateDocument(documentId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update document status:", error);
    }
  };

  const handleRemove = async (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "expired":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <Fieldset title="Document Requirement" className="w-full">
      <div className="h-full flex flex-col" style={{ height: "calc(100% - 2rem)" }}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError} className="mt-2">
              Dismiss
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-32 flex-shrink-0">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading documents...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="space-y-2 pr-1">
              {documents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No documents found</p>
                  <p className="text-gray-400 text-xs mt-1">Create your first legal document to get started</p>
                </div>
              ) : (
                documents.map((document) => (
                  <div
                    key={document._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleDetail(document._id)}>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate mb-1">{document.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                              {document.status.replace("_", " ")}
                            </span>
                            <span className="text-xs text-gray-500">{new Date(document.createdAt).toLocaleDateString()}</span>
                          </div>

                          {/* Content preview */}
                          <div
                            className="text-xs text-gray-600 mb-2 overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              maxHeight: "2.5rem",
                            }}>
                            {document.content || "No content available"}
                          </div>
                        </div>

                        {/* Expand indicator */}
                        <div className="flex items-center justify-center w-6 h-6 text-gray-400 flex-shrink-0">
                          <svg
                            className={`w-4 h-4 transition-transform ${selectedDocument === document._id ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {selectedDocument === document._id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="bg-gray-50 rounded-md p-2 border">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Full Content:</h4>
                            <div className="text-sm text-gray-600 max-h-24 overflow-y-auto border border-gray-200 rounded p-2 bg-white mb-3">
                              {document.content || "No content available"}
                            </div>

                            {/* Document metadata */}
                            <div className="mb-3 pb-2 border-b border-gray-200">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="font-medium text-gray-700">Created:</span>
                                  <div className="text-gray-600 truncate">{new Date(document.createdAt).toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Updated:</span>
                                  <div className="text-gray-600 truncate">{new Date(document.updatedAt).toLocaleString()}</div>
                                </div>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(document._id);
                                }}
                                className="h-7 px-3 text-xs">
                                {document.status === "pending" ? "Mark Done" : "Mark Pending"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(document._id);
                                }}
                                className="h-7 px-3 text-xs">
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Fieldset>
  );
};
