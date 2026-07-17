import os
import json
from flask import Flask, request, send_from_directory
import smtplib
from email.message import EmailMessage

# create flask app, serve static files from current directory
app = Flask(__name__, static_folder='.', static_url_path='')

# configuration from environment variables (set these in your hosting
# provider's dashboard - never hardcode credentials here)
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.hostinger.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER')
SMTP_PASS = os.environ.get('SMTP_PASS')
TO_ADDRESS = os.environ.get('TO_ADDRESS', SMTP_USER)

@app.route('/')
def index():
    # serve index.html from workspace root
    return send_from_directory('.', 'index.html')

# allow static files to be served normally, e.g. /checkout.html, /script.js etc.
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/submit_order', methods=['POST'])
def submit_order():
    # form fields are in request.form, cart possibly in request.form['cart']
    form = request.form.to_dict()

    # build a plain-text message summarizing order; expand cart JSON for readability
    body_lines = []
    for key, value in form.items():
        if key == 'cart':
            body_lines.append('Cart items:')
            try:
                items = json.loads(value)
                # each item will be a dict with its own fields
                for idx, item in enumerate(items, start=1):
                    body_lines.append(f"  {idx}.")
                    for k, v in item.items():
                        body_lines.append(f"    {k}: {v}")
            except Exception:
                # if parsing fails, just include raw string
                body_lines.append(value)
        else:
            body_lines.append(f"{key}: {value}")
    body = "\n".join(body_lines)

    msg = EmailMessage()
    msg['Subject'] = 'New customer order'
    msg['From'] = SMTP_USER
    msg['To'] = TO_ADDRESS
    # explicitly set plain-text body (no attachments, no HTML part)
    msg.set_content(body, subtype='plain')
    # some email clients display multipart messages differently; by
    # ensuring the message has only a text/plain part we avoid any
    # documents or attachments appearing in the received mail.

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)
    except Exception as e:
        return f"Failed to send email: {e}", 500

    return 'OK', 200

@app.route('/submit_commission', methods=['POST'])
def submit_commission():
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

    msg = EmailMessage()
    msg['Subject'] = 'New Commission Request'
    msg['From'] = SMTP_USER
    msg['To'] = TO_ADDRESS
    msg.set_content(body, subtype='plain')

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
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

    msg = EmailMessage()
    msg['Subject'] = f'Contact Form: {form.get("subject", "General Enquiry")}'
    msg['From'] = SMTP_USER
    msg['To'] = TO_ADDRESS
    msg.set_content(body, subtype='plain')

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
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
