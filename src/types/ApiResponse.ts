export interface ApiResponse<T> {
    success: boolean;
    message: string;
    status:string;
    data: T;
}   

