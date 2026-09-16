'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BarChart, BookOpen, Clock, Award, TrendingUp } from 'lucide-react';

const StudentDashboard = () => {
    // Mock Data - To be replaced with real data later
    const stats = [
        { title: 'Classes Attended', value: '12', icon: <BookOpen className="h-4 w-4 text-muted-foreground" />, description: '+2 from last week' },
        { title: 'Hours Learned', value: '18.5', icon: <Clock className="h-4 w-4 text-muted-foreground" />, description: 'Total this month' },
        { title: 'Assignments', value: '8/10', icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />, description: 'Completed' },
        { title: 'Average Grade', value: 'A-', icon: <Award className="h-4 w-4 text-muted-foreground" />, description: 'Across all subjects' },
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            
            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Performance Metrics Section */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
                    <TabsTrigger value="assignments">Recent Assignments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Weekly Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Placeholder for a Chart */}
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                                    Activity Chart Placeholder
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Upcoming Classes</CardTitle>
                                <CardDescription>
                                    Your schedule for the next few days.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Mathematics</p>
                                            <p className="text-sm text-muted-foreground">Tomorrow at 4:00 PM</p>
                                        </div>
                                        <div className="ml-auto font-medium">with Mr. Sharma</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Physics</p>
                                            <p className="text-sm text-muted-foreground">Wednesday at 5:30 PM</p>
                                        </div>
                                        <div className="ml-auto font-medium">with Ms. Verma</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                 <TabsContent value="subjects">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Proficiency</CardTitle> 
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                               <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">Mathematics</h3>
                                        <p className="text-sm text-muted-foreground">Grade: A</p>
                                    </div>
                                    <div className="w-1/3 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                               </div>
                               <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">Science</h3>
                                        <p className="text-sm text-muted-foreground">Grade: B+</p>
                                    </div>
                                    <div className="w-1/3 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                               </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="assignments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Assignments</CardTitle> 
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span>Algebra Worksheet 4</span>
                                    <span className="text-green-500 text-sm">Completed</span>
                                </div>
                                 <div className="flex justify-between items-center border-b pb-2">
                                    <span>Physics Lab Report</span>
                                    <span className="text-yellow-500 text-sm">Due Tomorrow</span>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StudentDashboard;
