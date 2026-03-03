# ShortMesh Widget

A lightweight, embeddable JavaScript widget for OTP (One-Time Password) verification via popular messaging platforms like WhatsApp, Telegram, and Signal.

## Features

- **Secure OTP Verification** - Verify users via their preferred messaging platform
- **Multi-Platform Support** - WhatsApp, Telegram, and Signal
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Easy Integration** - Simple JavaScript API with minimal setup
- **Resend Functionality** - Built-in OTP resend with countdown timer
- **Customizable Callbacks** - Handle success and error events

## Installation

### Option 1: Direct Script Include

Download `widget.js` and include it in your HTML:

```html
<script src="path/to/widget.js"></script>
```

### Option 2: CDN

```html
<script src="https://shortmesh.com/widget.js"></script>
```

## Quick Start

1. Include the widget script in your HTML file
2. Add a button or trigger to open the widget
3. Configure with your API endpoints

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <script src="widget.js"></script>

    <button id="verify-btn">Verify with ShortMesh</button>

    <script>
      document.getElementById('verify-btn').addEventListener('click', function() {
        ShortMeshWidget.open({
          identifier: '+1234567890',
          endpoints: {
            platforms: 'https://api.yoursite.com/platforms',
            sendOtp: 'https://api.yoursite.com/otp/send',
            verifyOtp: 'https://api.yoursite.com/otp/verify',
          },
          onSuccess: (data) => {
            console.log('Verification successful!', data);
            // Redirect user or update UI
          },
          onError: (error) => {
            console.error('Verification failed:', error);
            // Show error message to user
          },
        });
      });
    </script>
  </body>
</html>
```

## Configuration

### Widget Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `identifier` | string | Yes | User's phone number (with country code) or identifier |
| `endpoints` | object | Yes | API endpoints configuration |
| `endpoints.platforms` | string | Yes | URL to fetch available platforms |
| `endpoints.sendOtp` | string | Yes | URL to send OTP |
| `endpoints.verifyOtp` | string | Yes | URL to verify OTP |
| `onSuccess` | function | No | Callback when verification succeeds |
| `onError` | function | No | Callback when an error occurs |

### Example Configuration

```javascript
ShortMeshWidget.open({
  identifier: '+237650393369',
  endpoints: {
    platforms: 'http://localhost:8000/api/v1/platforms',
    sendOtp: 'http://localhost:8000/api/v1/otp/generate',
    verifyOtp: 'http://localhost:8000/api/v1/otp/verify',
  },
  onSuccess: (data) => {
    // Handle successful verification
    alert('Verified successfully!');
  },
  onError: (error) => {
    // Handle errors
    console.error('Error:', error);
  },
});
```

## API Requirements

Your backend API must implement the following endpoints:

### 1. GET Platforms Endpoint

Returns list of available verification platforms.

**Response:**
```json
[
  { "platform": "wa" },
  { "platform": "telegram" },
  { "platform": "signal" }
]
```

### 2. POST Send OTP Endpoint

Sends OTP to the user via selected platform.

**Request:**
```json
{
  "identifier": "+1234567890",
  "platform": "wa"
}
```

**Response:**
```json
{
  "success": true,
  "expiresIn": 30,
  "message": "OTP sent successfully"
}
```

The response should include one of these fields for expiry time:
- `expiresIn` (in seconds)
- `expiry` (in seconds)
- `ttl` (in seconds)

If none provided, defaults to 30 seconds.

### 3. POST Verify OTP Endpoint

Verifies the OTP code entered by the user.

**Request:**
```json
{
  "identifier": "+1234567890",
  "code": "123456",
  "platform": "wa"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "data": {
    "userId": "12345",
    "token": "jwt-token-here"
  }
}
```

## Supported Platforms

The widget currently supports:

- **WhatsApp** (`wa`)


## User Flow

1. **Platform Selection**: User selects their preferred messaging platform
2. **OTP Sent**: OTP is sent to the user via selected platform
3. **Code Entry**: User enters 6-digit verification code
4. **Verification**: Code is verified against backend
5. **Success/Error**: User sees success message or error, callbacks triggered

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

The widget handles errors automatically and calls the `onError` callback. Common errors:

- Failed to load platforms
- Failed to send OTP
- Invalid OTP code
- Network errors

Example error handling:

```javascript
onError: (error) => {
  if (error.message.includes('Failed to send OTP')) {
    alert('Unable to send verification code. Please try again.');
  } else if (error.message.includes('Invalid OTP')) {
    alert('Invalid code. Please check and try again.');
  } else {
    alert('An error occurred. Please contact support.');
  }
}
```

## Development

### Testing Locally

1. Clone the repository
2. Open `index.html` in your browser
3. Ensure your backend API is running
4. Click "Verify with ShortMesh" button

### File Structure

```
shortmesh-widget/
├── widget.js       # Main widget code
├── index.html      # Demo/example page
├── README.md       # This file
└── LICENSE         # License information
```

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please contact the ShortMesh team or open an issue in the repository.