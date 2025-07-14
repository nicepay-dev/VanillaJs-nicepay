# Nicepay JavaScript Library

A lightweight JavaScript library for integrating Nicepay payment gateway into your web applications. This library provides a simple interface for handling payment registrations and transactions with Nicepay's direct payment API.

## Features

- 🔧 Easy configuration setup
- 💳 Direct payment transaction support
- 🌐 Environment switching (Production/Sandbox)
- 📦 Universal module support (CommonJS, AMD, Browser)

## Installation

### Browser
Include the library directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/nicepay-js-lib@1.0.0/dist/nicepay.min.js"></script>
```

### Node.js
```bash
npm install nicepay-js-lib
```

## Quick Start

### 1. Setup Configuration

```javascript
// Initialize the library with your merchant credentials
Nicepay.setup({
  iMid: "YOUR_MERCHANT_ID",
  isProduction: false
});
```

### 2. Register a Transaction

```javascript
const registrationData = {
  timeStamp: "20231201120000",
  merchantToken: "YOUR_MERCHANT_TOKEN",
  callBackUrl: "https://your-domain.com/callback",
  amt: "10000",
  merchantOrderId: "ORDER123",
  goodsNm: "Test Product",
  dbProcessUrl: "https://your-domain.com/process",
  email: "customer@example.com",
  cartData: "item1,item2"
  ....
};

const response = await Nicepay.registerTransaction(registrationData);
console.log(response);
```

### 3. Process Payment

```javascript
const paymentData = {
  timeStamp: "20231201120000",
  merchantToken: "YOUR_MERCHANT_TOKEN",
  tXid: "TRANSACTION_ID_FROM_REGISTRATION",
  cardNo: "4111111111111111",
  cardExpYyMm: "2512",
  cardCvv: "123",
  cardHolderEmail: "customer@example.com",
  cardHolderNm: "John Doe",
  callBackUrl: "https://your-domain.com/callback"
};

await Nicepay.paymentTransaction(paymentData);
```

## API Reference

### Configuration

#### `setup(options)`
Initialize the library with your merchant configuration.

**Parameters:**
- `options` (Object)
  - `iMid` (String, required): Your merchant ID
  - `isProduction` (Boolean, optional): Set to `true` for production environment

**Example:**
```javascript
Nicepay.setup({
  iMid: "IONPAYTEST",
  isProduction: false
});
```

#### `getConfig()`
Retrieve the current configuration.

**Returns:** Object containing current configuration

**Example:**
```javascript
const config = Nicepay.getConfig();
console.log(config);
// Output: { isProduction: false, iMid: "IONPAYTEST" }
```

### Transaction Methods

#### `registAndPaymentTransaction(dataRegister, dataPayment)`
Combined method to register and process payment in one call.

**Parameters:**
- `dataRegister` (Object): Registration data
- `dataPayment` (Object): Payment data

**Returns:** Promise that resolves to payment response

**Example:**
```javascript
const registrationData = {
  timeStamp: "20231201120000",
  merchantToken: "YOUR_MERCHANT_TOKEN",
  callBackUrl: "https://your-domain.com/callback",
  amt: "10000",
  merchantOrderId: "ORDER123",
  goodsNm: "Test Product",
  dbProcessUrl: "https://your-domain.com/process",
  email: "customer@example.com"
};

const paymentData = {
  timeStamp: "20231201120000",
  merchantToken: "YOUR_MERCHANT_TOKEN",
  tXid: "TRANSACTION_ID_FROM_REGISTRATION",
  cardNo: "4111111111111111",
  cardExpYyMm: "2512",
  cardCvv: "123",
  cardHolderEmail: "customer@example.com",
  cardHolderNm: "John Doe",
  callBackUrl: "https://your-domain.com/callback"
};

try {
  const response = await Nicepay.registAndPaymentTransaction(registrationData, paymentData);
  console.log("Payment processed:", response);
} catch (error) {
  console.error("Payment failed:", error);
}
```

## Complete Example

```javascript
// 1. Setup
Nicepay.setup({
  iMid: "IONPAYTEST",
  isProduction: false
});

// 2. Generate merchant token
const merchantToken = generateMerchantToken()

// 3. Register transaction
const registrationData = {
  timeStamp: "20231201120000",
  merchantToken: merchantToken,
  callBackUrl: "https://your-domain.com/callback",
  amt: "10000",
  merchantOrderId: "ORDER123",
  goodsNm: "Test Product",
  dbProcessUrl: "https://your-domain.com/process",
  email: "customer@example.com"
};

// 4. Process payment
const paymentData = {
  timeStamp: "20231201120000",
  merchantToken: "YOUR_MERCHANT_TOKEN",
  tXid: "TRANSACTION_ID_FROM_REGISTRATION",
  cardNo: "4111111111111111",
  cardExpYyMm: "2512",
  cardCvv: "123",
  cardHolderEmail: "customer@example.com",
  cardHolderNm: "John Doe",
  callBackUrl: "https://your-domain.com/callback"
};

// 5. Execute combined transaction
Nicepay.registAndPaymentTransaction(registrationData, paymentData)
```

## Environment Configuration

The library automatically switches between environments based on the `isProduction` flag:

- **Development**: `https://dev.nicepay.co.id`
- **Production**: `https://www.nicepay.co.id`

## Error Handling

The library throws errors for common issues:

- Missing merchant ID during setup
- Network errors during API calls
- Invalid response from Nicepay servers


## Browser Compatibility

This library is compatible with:
- Modern browsers (ES6+)
- Node.js (with fetch polyfill if needed)
- Universal module systems (CommonJS, AMD, Browser globals)

## Security Notes

- Never expose your merchant credentials in client-side code
- Always validate and sanitize user input
- Use HTTPS in production environments
- Implement proper server-side validation

## Support

For issues and questions:
- Check the [Nicepay API Documentation](https://docs.nicepay.co.id)
- Ensure your merchant credentials are correct
- Verify your callback URLs are accessible