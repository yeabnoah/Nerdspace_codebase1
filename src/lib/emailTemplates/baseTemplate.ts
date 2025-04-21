export const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NerdSpace</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #FAFAFA;
            background-color: #09090B;
            margin: 0;
            padding: 20px;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            background-color: #18181B;
            border: 1px solid #27272A;
            border-radius: 16px;
            padding: 48px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 48px;
        }
        .logo-text {
            font-size: 42px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 8px;
            letter-spacing: -0.03em;
        }
        .logo-subtext {
            color: #A1A1AA;
            font-size: 16px;
            margin-bottom: 32px;
        }
        h2 {
            color: #FFFFFF;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 24px;
            letter-spacing: -0.025em;
        }
        .content {
            margin-bottom: 40px;
        }
        p {
            color: #A1A1AA;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.8;
        }
        .button {
            display: inline-block;
            background-color: #FFFFFF;
            color: #09090B !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            margin: 24px 0;
            transition: all 0.2s;
            font-size: 16px;
            text-align: center;
        }
        .button:hover {
            background-color: #E4E4E7;
        }
        .footer {
            text-align: center;
            color: #71717A;
            font-size: 14px;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #27272A;
        }
        .highlight {
            color: #FFFFFF;
            font-weight: 500;
        }
        .note {
            background-color: #27272A;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
            font-size: 14px;
            border: 1px solid #3F3F46;
            color: #D4D4D8;
        }
        .social-links {
            margin: 24px 0;
            padding: 16px;
            background-color: #27272A;
            border-radius: 12px;
            text-align: center;
        }
        .social-links a {
            color: #FFFFFF;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
            display: inline-block;
            padding: 8px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-text">nerdspace.</div>
            <div class="logo-subtext">a space for creators and builders</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="social-links">
            <a href="https://twitter.com/Nerd_space1">Twitter</a> |
            <a href="https://t.me/selfmadecoder">Telegram</a>
        </div>
        <div class="footer">
            <p>Built with ❤️ by NerdSpace Team</p>
            <p>Questions? Just reply to this email - we're here to help!</p>
            <p>© ${new Date().getFullYear()} NerdSpace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
