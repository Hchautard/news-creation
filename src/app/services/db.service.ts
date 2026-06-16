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
    const { error } = await this.supabase.from('news').insert(news);
    if (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteNews(ids: number[]): Promise<void> {
    const { data, error } = await this.supabase
      .from('news')
      .delete()
      .in('id', ids)
      .select('id');
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data || data.length === 0) {
      throw new Error('Aucune ligne supprimée — vérifiez les politiques RLS Supabase pour DELETE.');
    }
  }

  async patchNews(news: Partial<News>): Promise<News | null> {
    const { data, error } = await this.supabase
      .from('news')
      .update(news)
      .eq('id', news.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      return data;
    }
  }

}
