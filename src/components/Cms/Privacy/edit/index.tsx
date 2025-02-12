"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/TermBreadcrumb";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Elements = () => {
  const searchParams = useSearchParams();
  const termId = searchParams.get("termId");

  const [formData, setFormData] = useState({ description: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toolbarOptions = [
    // Text formatting options
    ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough
    ["blockquote", "code-block"], // Blockquote, code block

    // Embeds
    ["link", "image", "video", "formula"], // Link, image, video, formula

    // Headers
    [{ header: 1 }, { header: 2 }], // Header 1 and 2
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers 1-6 and normal text

    // Lists
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Ordered, bullet, and checklist

    // Scripts
    [{ script: "sub" }, { script: "super" }], // Subscript, superscript

    // Indentation
    [{ indent: "-1" }, { indent: "+1" }], // Outdent, indent

    // Text direction
    [{ direction: "rtl" }], // Right-to-left

    // Font size
    [{ size: ["small", false, "large", "huge"] }], // Font size options

    // Text color and background color
    [{ color: [] }, { background: [] }], // Text color, background color

    // Font family
    [{ font: [] }], // Font family dropdown

    // Text alignment
    [{ align: [] }], // Text alignment options

    // Inline formulas
    ["formula"], // Formula support for inline math

    // Clean formatting
    ["clean"], // Remove formatting button
  ];

  // Fetch data when termId changes
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cms/privacy/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch terms data.");
        }

        const { data } = await response.json();
        console.log(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [termId]);

  // Memoized handleChange function
  const handleChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, description: value }));
    },
    [setFormData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.description.trim() || formData.description.trim() == '<p><br></p>') {
      errors.description = "Description cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      toast.error("Please fix the highlighted errors.", {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        }
      });

      return;
    }

    try {
      const res = await fetch("/api/cms/privacy/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData as Record<string, string>).toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to update Privacy Policy.");
      }

      toast.success("Privacy Policy updated successfully!", {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        }
      });

    } catch (err) {
      setError(err.message || "An unknown error occurred.");

      toast.error("Failed to update privacy policy.", {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        }
      });

    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit Privacy Policy" />
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <ReactQuill
                    theme="snow"
                    value={formData?.description}
                    onChange={handleChange}
                    placeholder="Enter Privacy Policy"
                    modules={{ toolbar: toolbarOptions }}
                    className={`react-quill ${formErrors.description ? "border-red-500" : ""
                      }`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-4.5">
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Elements;
