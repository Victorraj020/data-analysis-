"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

interface DashboardProps {
    data: any
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
}

export function Dashboard({ data }: DashboardProps) {
    if (!data) return null

    // Transform preview data for charts (just a simple example logic)
    // In a real app, we'd need smarter logic to pick numeric columns
    const chartData = data.preview.slice(0, 10)
    const numericColumns = Object.keys(data.dtypes).filter(key => data.dtypes[key].includes('int') || data.dtypes[key].includes('float'))
    const firstNumeric = numericColumns[0]
    const secondNumeric = numericColumns[1]
    const labelColumn = data.columns.find((col: string) => data.dtypes[col].includes('object')) || data.columns[0]

    return (
        <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={item}>
                    <Card className="glass-card border-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.shape[0]}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="glass-card border-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Columns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.shape[1]}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="glass-card border-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Missing Values</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.values(data.missing_values).reduce((a: any, b: any) => a + b, 0) as number}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="data">Raw Data</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 glass-card border-none">
                            <CardHeader>
                                <CardTitle>Data Visualization</CardTitle>
                                <CardDescription>
                                    Visualizing {firstNumeric} vs {labelColumn}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {firstNumeric ? (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={chartData}>
                                            <XAxis dataKey={labelColumn} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey={firstNumeric} fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                                        No numeric data to visualize
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 glass-card border-none">
                            <CardHeader>
                                <CardTitle>Column Types</CardTitle>
                                <CardDescription>
                                    Data types detected in your dataset
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {Object.entries(data.dtypes).map(([col, type]: [string, any]) => (
                                        <div key={col} className="flex items-center justify-between text-sm">
                                            <span className="font-medium truncate max-w-[150px]">{col}</span>
                                            <span className="text-muted-foreground bg-muted px-2 py-1 rounded text-xs">{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="data">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Preview</CardTitle>
                            <CardDescription>First 5 rows of your dataset</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {data.columns.map((col: string) => (
                                            <TableHead key={col}>{col}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.preview.map((row: any, i: number) => (
                                        <TableRow key={i}>
                                            {data.columns.map((col: string) => (
                                                <TableCell key={col}>{row[col]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Descriptive Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <pre className="text-xs bg-muted p-4 rounded-lg">
                                    {JSON.stringify(data.description, null, 2)}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}
