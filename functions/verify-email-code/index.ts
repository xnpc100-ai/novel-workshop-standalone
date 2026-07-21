import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyEmailRequest {
  email: string
  code: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { email, code }: VerifyEmailRequest = await req.json()

    // Validate input
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: '邮箱和验证码不能为空' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (code.length !== 6) {
      return new Response(
        JSON.stringify({ error: '验证码格式不正确' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Query the latest unused verification code for this email
    const { data: verification, error: queryError } = await supabaseClient
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('verification_code', code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (queryError || !verification) {
      return new Response(
        JSON.stringify({ error: '验证码错误或已过期' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if expired
    const now = new Date()
    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: '验证码已过期，请重新获取' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Mark as used
    const { error: updateError } = await supabaseClient
      .from('email_verifications')
      .update({ used: true })
      .eq('id', verification.id)

    if (updateError) {
      console.error('Failed to mark verification as used:', updateError)
      return new Response(
        JSON.stringify({ error: '验证失败，请稍后重试' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '验证成功',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in verify-email-code:', error)
    return new Response(
      JSON.stringify({ error: '服务器错误，请稍后重试' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
