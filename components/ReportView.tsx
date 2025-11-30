"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ReportViewProps {
    data: any
}

export function ReportView({ data }: ReportViewProps) {
    if (!data) return null

    const handleExport = () => {
        // Mock export functionality
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "report.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Automated Report</CardTitle>
                    <CardDescription>Generated insights based on your data</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                </Button>
            </CardHeader>
            <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                    <h3>Dataset Summary</h3>
                    <p>
                        The dataset contains <strong>{data.shape[0]}</strong> rows and <strong>{data.shape[1]}</strong> columns.
                        It appears to be a <strong>{data.shape[0] > 1000 ? "large" : "small"}</strong> dataset.
                    </p>

                    <h3>Key Findings</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Missing Data:</strong> There are {Object.values(data.missing_values).reduce((a: any, b: any) => a + b, 0) as number} missing values across the dataset.
                        </li>
                        <li>
                            <strong>Data Types:</strong> The dataset consists of {Object.values(data.dtypes).filter((t: any) => t.includes('int') || t.includes('float')).length} numeric columns and {Object.values(data.dtypes).filter((t: any) => t.includes('object')).length} categorical columns.
                        </li>
                    </ul>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                        <p className="text-sm text-muted-foreground italic">
                            "Use the Chat Assistant to generate more specific insights or ask questions about trends in this data."
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
