"use client"

import { useState } from "react"
import { FileUpload } from "@/components/FileUpload"
import { Dashboard } from "@/components/Dashboard"
import { ChatInterface } from "@/components/ChatInterface"
import { ReportView } from "@/components/ReportView"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)

    const handleUploadComplete = (uploadedData: any) => {
        setData(uploadedData)
    }

    const resetData = () => {
        setData(null)
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            {data ? "Analyzing your dataset" : "Upload data to get started"}
                        </p>
                    </div>
                    {data && (
                        <Button variant="outline" onClick={resetData}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            New Analysis
                        </Button>
                    )}
                </div>

                {!data ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl font-semibold">Welcome to DataSaaS</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Upload your CSV or Excel file to generate insights, charts, and chat with your data.
                            </p>
                        </div>
                        <FileUpload onUploadComplete={handleUploadComplete} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Dashboard data={data} />
                        </div>
                        <div className="space-y-6">
                            <ReportView data={data} />
                            <ChatInterface context={data.description} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
