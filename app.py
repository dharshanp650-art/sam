import os
import json
import threading
from flask import Flask, request, send_from_directory
import smtplib
from email.message import EmailMessage

try:
    import fcntl  # POSIX only (Hostinger/Linux) - guards sold_products.json across worker processes
except ImportError:
    fcntl = None

# create flask app, serve static files from current directory
app = Flask(__name__, static_folder='.', static_url_path='')

# configuration from environment variables (set these in your hosting
# provider's dashboard - never hardcode credentials here)
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.hostinger.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER')
SMTP_PASS = os.environ.get('SMTP_PASS')
TO_ADDRESS = os.environ.get('TO_ADDRESS', SMTP_USER)

# Sold paintings are tracked here, keyed by the same product id used in
# data-product-id / productDetailData. A painting is added the moment an
# order containing it is successfully placed (see /submit_order below) -
# no one needs to edit this file by hand.
SOLD_PRODUCTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sold_products.json')
_sold_products_lock = threading.Lock()

def load_sold_products():
    try:
        with open(SOLD_PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def mark_products_sold(product_ids):
    if not product_ids:
        return
    # threading.Lock only guards against other threads in this process; Hostinger's
    # Python App hosting can run several worker processes, so also take an OS-level
    # file lock (POSIX flock) around the read-modify-write so two simultaneous
    # orders can't clobber each other's update.
    with _sold_products_lock:
        lock_file = open(SOLD_PRODUCTS_FILE + '.lock', 'a')
        try:
            if fcntl:
                fcntl.flock(lock_file, fcntl.LOCK_EX)
            sold = load_sold_products()
            changed = False
            for pid in product_ids:
                if pid and pid not in sold:
                    sold.append(pid)
                    changed = True
            if changed:
                with open(SOLD_PRODUCTS_FILE, 'w') as f:
                    json.dump(sold, f)
        finally:
            if fcntl:
                fcntl.flock(lock_file, fcntl.LOCK_UN)
            lock_file.close()

@app.route('/')
def index():
    # serve index.html from workspace root
    return send_from_directory('.', 'index.html')

# allow static files to be served normally, e.g. /checkout.html, /script.js etc.
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/api/sold-products')
def sold_products():
    return {'sold': load_sold_products()}

@app.route('/submit_order', methods=['POST'])
def submit_order():
    if not SMTP_USER or not SMTP_PASS:
        return 'Email is not configured on this server (missing SMTP_USER/SMTP_PASS environment variables)', 500

    # form fields are in request.form, cart possibly in request.form['cart']
    form = request.form.to_dict()

    # parse the cart once - used both for the email body and, once the order
    # is confirmed sent, to mark each purchased painting as sold
    cart_items = []
    cart_raw = form.get('cart')
    if cart_raw:
        try:
            cart_items = json.loads(cart_raw)
        except Exception:
            cart_items = []

    # build a plain-text message summarizing order; expand cart JSON for readability
    body_lines = []
    for key, value in form.items():
        if key == 'cart':
            body_lines.append('Cart items:')
            if cart_items:
                for idx, item in enumerate(cart_items, start=1):
                    body_lines.append(f"  {idx}.")
                    for k, v in item.items():
                        body_lines.append(f"    {k}: {v}")
            else:
                # parsing failed earlier, just include raw string
                body_lines.append(value)
        else:
            body_lines.append(f"{key}: {value}")
    body = "\n".join(body_lines)

    # Everything below can fail in ways specific to the hosting environment (bad
    # config, network/DNS issues, mail server refusing the connection, timeouts) -
    # keep it all inside one try/except so a customer never sees a raw stack trace.
    try:
        msg = EmailMessage()
        msg['Subject'] = 'New customer order'
        msg['From'] = SMTP_USER
        msg['To'] = TO_ADDRESS
        # explicitly set plain-text body (no attachments, no HTML part)
        msg.set_content(body, subtype='plain')
        # some email clients display multipart messages differently; by
        # ensuring the message has only a text/plain part we avoid any
        # documents or attachments appearing in the received mail.

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)
    except Exception as e:
        return f"Failed to send email: {e}", 500

    # order confirmed - mark each painting in the cart as sold so it shows
    # "Sold" everywhere (homepage, shop grid, its own page) for every visitor.
    # Never let a storage hiccup here turn an already-successful order into an error.
    try:
        mark_products_sold([item.get('id') for item in cart_items if isinstance(item, dict)])
    except Exception as e:
        print(f"Warning: order sent but failed to mark products sold: {e}")

    return 'OK', 200

@app.route('/submit_commission', methods=['POST'])
def submit_commission():
    if not SMTP_USER or not SMTP_PASS:
        return 'Email is not configured on this server (missing SMTP_USER/SMTP_PASS environment variables)', 500

    form = request.form.to_dict()

    # Build email body for commission
    body_lines = ["New Commission Request:"]
    body_lines.append("")

    # Group the fields nicely
    body_lines.append("COMMISSION DETAILS:")
    body_lines.append(f"Size: {form.get('size', 'Not selected')}")
    body_lines.append(f"Special Date: {form.get('specialDate', 'Not selected')}")
    
    # Handle multiple features
    features = request.form.getlist('features')
    if features:
        body_lines.append(f"Features: {', '.join(features)}")
    else:
        body_lines.append("Features: None selected")
    
    body_lines.append(f"Canvas Type: {form.get('canvas', 'Not selected')}")
    body_lines.append(f"Extra Details: {form.get('extraDetails', 'None')}")
    body_lines.append(f"Deadline: {form.get('deadline', 'Not specified')}")
    body_lines.append("")

    body_lines.append("CONTACT INFORMATION:")
    body_lines.append(f"Name: {form.get('name', 'Not provided')}")
    body_lines.append(f"Email: {form.get('email', 'Not provided')}")
    body_lines.append(f"Phone: {form.get('phone', 'Not provided')}")

    body = "\n".join(body_lines)

    try:
        msg = EmailMessage()
        msg['Subject'] = 'New Commission Request'
        msg['From'] = SMTP_USER
        msg['To'] = TO_ADDRESS
        msg.set_content(body, subtype='plain')

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)
        print("Commission email sent successfully")
    except Exception as e:
        print(f"Failed to send commission email: {e}")
        return f"Failed to send email: {e}", 500

    return 'OK', 200

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    if not SMTP_USER or not SMTP_PASS:
        return 'Email is not configured on this server (missing SMTP_USER/SMTP_PASS environment variables)', 500

    form = request.form.to_dict()

    # Build email body for contact form
    body_lines = ["New Contact Message:"]
    body_lines.append("")

    body_lines.append("CONTACT INFORMATION:")
    body_lines.append(f"Name: {form.get('name', 'Not provided')}")
    body_lines.append(f"Email: {form.get('email', 'Not provided')}")
    body_lines.append(f"Phone: {form.get('phone', 'Not provided')}")
    body_lines.append("")

    body_lines.append("MESSAGE DETAILS:")
    body_lines.append(f"Subject: {form.get('subject', 'Not provided')}")
    body_lines.append(f"Message: {form.get('message', 'Not provided')}")
    body_lines.append("")

    # Handle file upload if present
    if 'fileUpload' in request.files:
        file = request.files['fileUpload']
        if file.filename:
            body_lines.append(f"Reference file attached: {file.filename}")
            # Note: For simplicity, we're not attaching files in this basic implementation
            # In a production app, you'd want to save the file and attach it to the email

    body = "\n".join(body_lines)

    try:
        msg = EmailMessage()
        msg['Subject'] = f'Contact Form: {form.get("subject", "General Enquiry")}'
        msg['From'] = SMTP_USER
        msg['To'] = TO_ADDRESS
        msg.set_content(body, subtype='plain')

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)
        print("Contact email sent successfully")
    except Exception as e:
        print(f"Failed to send contact email: {e}")
        return f"Failed to send email: {e}", 500

    return 'OK', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
