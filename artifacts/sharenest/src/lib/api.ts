const API_BASE_URL = 'http://localhost:3000/api';

export interface Post {
  id: number;
  type: "offre" | "demande";
  title: string;
  description: string;
  category: string;
  city: string;
  urgency: "Faible" | "Moyen" | "Urgent" | null;
  authorName: string;
  authorEmail: string;
  authorPhone: string | null;
  status: "disponible" | "réservé" | "terminé";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  type: "offre" | "demande";
  title: string;
  description: string;
  category: string;
  city: string;
  urgency?: "Faible" | "Moyen" | "Urgent";
  authorName: string;
  authorEmail: string;
  authorPhone?: string;
}

export interface UpdatePostRequest {
  status: "disponible" | "réservé" | "terminé";
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Posts endpoints
  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts');
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: number, updateData: UpdatePostRequest): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deletePost(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
