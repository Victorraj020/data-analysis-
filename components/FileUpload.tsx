"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

interface FileUploadProps {
    onUploadComplete: (data: any) => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            setFile(selectedFile)
            setError(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1
    })

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        setProgress(0)
        setError(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const response = await axios.post(`${apiUrl}/analyze/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setProgress(percentCompleted)
                }
            })

            onUploadComplete(response.data)
            setUploading(false)
        } catch (err) {
            console.error(err)
            setError("Failed to upload file. Please try again.")
            setUploading(false)
        }
    }

    const removeFile = () => {
        setFile(null)
        setProgress(0)
        setError(null)
    }

    return (
        <Card className="w-full max-w-md mx-auto border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
                {!file ? (
                    <div
                        {...getRootProps()}
                        className={`flex flex-col items-center justify-center h-48 cursor-pointer rounded-lg transition-colors ${isDragActive ? "bg-primary/5" : "hover:bg-muted/50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium text-center">
                            {isDragActive ? "Drop the file here" : "Drag & drop CSV or Excel file"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">Max size 10MB</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <File className="h-8 w-8 text-primary flex-shrink-0" />
                                <div className="truncate">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={removeFile} disabled={uploading}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {uploading && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
                            </div>
                        )}

                        {error && <p className="text-xs text-destructive text-center">{error}</p>}

                        <Button className="w-full" onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Analyzing..." : "Analyze Data"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
