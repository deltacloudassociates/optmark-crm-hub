import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RenewalReminderRequest {
  clientName: string;
  clientEmail: string;
  documentType: string;
  expiryDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientName, clientEmail, documentType, expiryDate }: RenewalReminderRequest = await req.json();

    console.log(`Sending renewal reminder to ${clientName} at ${clientEmail}`);

    const formattedExpiryDate = new Date(expiryDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const emailResponse = await resend.emails.send({
      from: "KYC Compliance <onboarding@resend.dev>",
      to: [clientEmail],
      subject: `Action Required: Your ${documentType} Renewal`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Document Renewal Required</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${clientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Our records indicate that your <strong>${documentType}</strong> will expire on <strong>${formattedExpiryDate}</strong>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              To maintain compliance with Anti-Money Laundering (AML) regulations, we kindly request that you provide updated documentation at your earliest convenience.
            </p>
            
            <div style="background: #f8fafc; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">Documents Required:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569;">
                <li style="margin-bottom: 10px;">
                  <strong>Updated ID Document</strong><br>
                  <span style="font-size: 14px;">Valid passport, driving licence, or national ID card</span>
                </li>
                <li style="margin-bottom: 0;">
                  <strong>Fresh Proof of Address</strong> (dated within last 3 months)<br>
                  <span style="font-size: 14px;">Council Tax Bill, Bank Statement, or Utility Bill</span>
                </li>
              </ul>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Please upload your documents through our secure client portal or contact us to arrange an alternative method of delivery.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              If you have any questions or need assistance, please don't hesitate to get in touch with our team.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 5px;">Kind regards,</p>
            <p style="font-size: 16px; margin-top: 0; font-weight: 600;">The Compliance Team</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">This is an automated message from our KYC compliance system.</p>
            <p style="margin: 5px 0 0 0;">Please do not reply directly to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-renewal-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
