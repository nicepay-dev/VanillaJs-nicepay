const Nicepay = (function() {
  let config = {
    isProduction: false,
    iMid: "",
  };

  function setup(options) {
    if (!options.iMid) throw new Error("merchantId is required");
    config = { ...config, ...options };
  }

  function getEndpoint() {
    if (config.isProduction) {
      return "https://www.nicepay.co.id";
    }
    return "https://dev.nicepay.co.id";
  }

  function getConfig() {
    return { ...config };
  }

  async function registerTransaction(data) {
    const url = getEndpoint() + "/nicepay/direct/v2/registration";
    data.iMid = config.iMid;
    
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data), 
    })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    });
  }

  function generateMerchantToken(data) {
    const merchantToken = crypto.createHash('sha256').update(data).digest('hex');
    return merchantToken;
  }

  async function paymentTransaction(data) {
    const url = getEndpoint() + "/nicepay/direct/v2/payment";
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    const fields = {
      timeStamp: data.timeStamp,
      merchantToken: data.merchantToken,
      tXid: data.tXid,
      cardNo: data.cardNo,
      cardExpYyMm: data.cardExpYyMm,
      cardCvv: data.cardCvv,
      cardHolderEmail: data.cardHolderEmail,
      cardHolderNm: data.cardHolderNm,
      recurringToken: data.recurringToken,
      callBackUrl: data.callBackUrl
    };


    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
    
  }

  async function registAndPaymentTransaction(dataRegister, dataPayment) {
    registerTransaction(dataRegister)
    .then(response => {
      dataPayment.tXid = response.tXid;
      dataPayment.timeStamp = dataRegister.timeStamp
      dataPayment.merchantToken = dataRegister.merchantToken

      return paymentTransaction(dataPayment);
    }).then(response => {
      return response
    }).catch(error => {
      return error
    })
  }
  return {
    setup,
    getConfig,
    registerTransaction,
    paymentTransaction,
    generateMerchantToken,
    registAndPaymentTransaction
  };
})();


if (typeof module !== 'undefined' && module.exports) {
module.exports = Nicepay;
} else if (typeof define === 'function' && define.amd) {
define(function() { return Nicepay; });
} else if (typeof window !== 'undefined') {
window.Nicepay = Nicepay;
} 