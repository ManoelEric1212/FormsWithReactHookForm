import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  'https://nurbtnrzwnzhgbntlrka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmJ0bnJ6d256aGdibnRscmthIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTMwNjUxMiwiZXhwIjoyMDAwODgyNTEyfQ.QeeyiCzTBewzKix7U6oQ-0AXJVOOuSMyPdtiuEI_OVw',
)
