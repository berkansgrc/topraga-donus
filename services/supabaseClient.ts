import { createClient } from '@supabase/supabase-js';

// NOT: Güvenlik için bu anahtarlar normalde .env dosyasında (process.env) tutulmalıdır.
// Ancak demo ortamında çalışması için buraya varsayılan olarak eklenmiştir.

// Kullanıcının sağladığı Proje URL'si
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bucxozitsdrpwfuloscj.supabase.co';

// Kullanıcının sağladığı API Anahtarı
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wa4opGH8FH3jMlVf5KCC5Q_UJVQcpGg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);