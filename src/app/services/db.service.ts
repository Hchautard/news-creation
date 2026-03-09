import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../environments/env';
import News from "../models/News";

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(env.supabaseUrl, env.supabaseKey);
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  async getNews(): Promise<News[] | null> {
    const { data, error } = await this.supabase.from('news').select('*');
    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }

  async createNews(news: News): Promise<void> {
    const { data, error } = await this.supabase.from('news').insert(news);
    if (error) {
      console.error(error);
    } else {
      console.log('News item created:', data);
    }
  }

  async patchNews(news: Partial<News>): Promise<void> {
    const { data, error } = await this.supabase.from('news').update(news).eq('id', news.id);
    if (error) {
      console.error(error);
    } else {
      console.log('News item updated:', data);
    }
  }
}
