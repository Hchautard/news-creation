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
}
