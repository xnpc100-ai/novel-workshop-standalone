import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailVerificationRequest {
  email: string
  code?: string  // 如果提供code则是验证请求，否则是发送请求
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

    const body: EmailVerificationRequest = await req.json()
    const { email, code } = body

    // 验证请求：检查验证码
    if (code) {
      if (!email || code.length !== 6) {
        return new Response(
          JSON.stringify({ error: '邮箱和验证码不能为空' }),
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
    }

    // 发送请求：生成并发送验证码
    if (!email) {
      return new Response(
        JSON.stringify({ error: '邮箱不能为空' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: '邮箱格式不正确' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store verification code in Supabase with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const { error: insertError } = await supabaseClient
      .from('email_verifications')
      .insert({
        email,
        verification_code: verificationCode,
        expires_at: expiresAt,
        used: false,
      })

    if (insertError) {
      console.error('Failed to store verification code:', insertError)
      return new Response(
        JSON.stringify({ error: '生成验证码失败' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Send email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: '邮件服务未配置' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const emailSubject = '小说仿写工坊 - 邮箱验证码'
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">邮箱验证码</h2>
        <p>您好！</p>
        <p>您的邮箱验证码是：</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px;">${verificationCode}</span>
        </div>
        <p style="color: #6b7280;">验证码有效期为 <strong>5分钟</strong>，请尽快使用。</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">如果不是您本人操作，请忽略此邮件。</p>
      </div>
    `

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@meoo.info',
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData)
      return new Response(
        JSON.stringify({ error: '邮件发送失败，请稍后重试' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Email sent successfully to ${email}, message ID: ${resendData.id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: '验证码已发送到您的邮箱',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in send-email-verification:', error)
    return new Response(
      JSON.stringify({ error: '服务器错误，请稍后重试' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
