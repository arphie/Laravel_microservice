import { cookies } from 'next/headers';
import axios, { isAxiosError } from 'axios';

export interface AuditLog {
    id: number;
    user_id: string;
    action: string;
    method: string;
    url: string;
    ip_origin: string;
    created_at: string;
    request_data: string[];
}

export interface ApiResponse {
    data: AuditLog[];
    current_page: number;
    per_page: number;
}

export async function fetchAuditLogs(page: string | number, perPage: string | number): Promise<{ auditLogs: AuditLog[], meta: ApiResponse['meta'] | undefined }> {
    const cookieStore = await cookies();
    console.log(cookieStore.getAll());
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        console.error("Authentication token not found.");
        return { auditLogs: [], meta: undefined };
    }

    try {
        
        // Using axios for the GET request
        const response = await axios.get<ApiResponse>(`http://gateway_service:8000/api/audit-logs`, {
            params: {
                page: page,
                limit: perPage,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // Headers to prevent caching, similar to fetch's `cache: 'no-store'`
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

        return { auditLogs: response.data.data, meta: {
            current_page: response.data.current_page,
            per_page: response.data.per_page,
        } };
    } catch (error) {
        if (isAxiosError(error)) {
            console.error("Failed to fetch audit logs (axios):", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    }

    return { auditLogs: [], meta: undefined };
}