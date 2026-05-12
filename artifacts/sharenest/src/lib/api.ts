const API_BASE_URL = `${window.location.origin}/api`;

export interface User {
  id: number;
  name: string;
  email: string;
  city: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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
  imageUrl: string | null;
  status: "disponible" | "réservé" | "terminé";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  postId: string;
  content: string;
  isRead: string;
  createdAt: string;
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
  image?: File;
}

export interface UpdatePostRequest {
  status: "disponible" | "réservé" | "terminé";
}

export interface SendMessageRequest {
  postId: string;
  receiverId: string;
  content: string;
  senderName?: string;
  senderEmail?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("sharenest_token");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }
    return response.json();
  }

  private async requestFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }
    return response.json();
  }

  async register(data: { name: string; email: string; password: string; city: string; role?: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async getPosts(authorEmail?: string): Promise<Post[]> {
    const qs = authorEmail ? `?authorEmail=${encodeURIComponent(authorEmail)}` : "";
    return this.request<Post[]>(`/posts${qs}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append("type", postData.type);
    formData.append("title", postData.title);
    formData.append("description", postData.description);
    formData.append("category", postData.category);
    formData.append("city", postData.city);
    if (postData.urgency) formData.append("urgency", postData.urgency);
    formData.append("authorName", postData.authorName);
    formData.append("authorEmail", postData.authorEmail);
    if (postData.authorPhone) formData.append("authorPhone", postData.authorPhone);
    if (postData.image) formData.append("image", postData.image);
    return this.requestFormData<Post>("/posts", formData);
  }

  async updatePost(id: number, updateData: UpdatePostRequest): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, { method: "PUT", body: JSON.stringify(updateData) });
  }

  async deletePost(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/posts/${id}`, { method: "DELETE" });
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.request<Message>("/messages", { method: "POST", body: JSON.stringify(data) });
  }

  async getMessages(): Promise<Message[]> {
    return this.request<Message[]>("/messages");
  }

  async markMessageRead(id: number): Promise<Message> {
    return this.request<Message>(`/messages/${id}/read`, { method: "PATCH" });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
