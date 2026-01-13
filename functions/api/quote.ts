// Cloudflare Pages Function to handle quote submissions

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Parse form data
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string;
    const businessName = formData.get('businessName') as string || '';
    const businessType = formData.get('businessType') as string;
    const productType = formData.get('productType') as string;
    const quantity = formData.get('quantity') as string;
    const description = formData.get('description') as string;
    const turnaround = formData.get('turnaround') as string;
    const deliveryMethod = formData.get('deliveryMethod') as string;
    const howHeardAboutUs = formData.get('howHeardAboutUs') as string || '';

    // Validate required fields
    if (!name || !phone || !productType || !description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if customer exists by phone
    let customerId: number;
    const existingCustomer = await env.DB.prepare(
      'SELECT id FROM customers WHERE phone = ?'
    ).bind(phone).first<{ id: number }>();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update customer info
      await env.DB.prepare(
        'UPDATE customers SET name = ?, email = ?, business_name = ?, business_type = ? WHERE id = ?'
      ).bind(name, email, businessName, businessType, customerId).run();
    } else {
      // Create new customer
      const result = await env.DB.prepare(
        'INSERT INTO customers (name, email, phone, business_name, business_type) VALUES (?, ?, ?, ?, ?)'
      ).bind(name, email, phone, businessName, businessType).run();
      customerId = result.meta.last_row_id as number;
    }

    // Create quote
    await env.DB.prepare(
      `INSERT INTO quotes (customer_id, product_type, quantity, description, turnaround, delivery_method, how_heard, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`
    ).bind(customerId, productType, quantity, description, turnaround, deliveryMethod, howHeardAboutUs).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Quote request received!' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Quote submission error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit quote' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
