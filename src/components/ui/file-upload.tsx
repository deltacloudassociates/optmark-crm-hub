import * as React from "react";
import { Upload, X, FileText, Image, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  previewType?: "image" | "document";
}

export function FileUpload({
  label,
  description,
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  value,
  onChange,
  className,
  previewType = "image",
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value && previewType === "image" && value.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value, previewType]);

  const handleFile = (file: File) => {
    setError(null);
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map(t => t.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type === "image/*") return file.type.startsWith("image/");
      if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
      return file.type === type;
    });

    if (!isValidType) {
      setError("Invalid file type");
      return;
    }

    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all cursor-pointer",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive bg-destructive/5",
          !isDragging && !error && "border-border hover:border-primary/50 hover:bg-muted/50",
          value && "border-success bg-success/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {value ? (
          <div className="flex flex-col items-center gap-2">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover border"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {previewType === "image" ? (
                <Image className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop file here or <span className="text-primary">browse</span>
              </p>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Max {maxSizeMB}MB • {accept.replace(/\./g, "").toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
