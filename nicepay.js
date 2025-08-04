const Nicepay = (function () {
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
    }).then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    });
  }

  function paymentTransaction(data) {
    const url = getEndpoint() + "/nicepay/direct/v2/payment";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    const fields = {
      timeStamp: data.timeStamp,
      merchantToken: data.merchantToken,
      tXid: data.tXid,
      cardNo: data.cardNo,
      cardExpYymm: data.cardExpYymm,
      cardCvv: data.cardCvv,
      cardHolderEmail: data.cardHolderEmail,
      cardHolderNm: data.cardHolderNm,
      recurringToken: data.recurringToken,
      callBackUrl: data.callBackUrl,
    };

    Object.keys(fields).forEach((key) => {
      if (fields[key]) {
        const input = document.createElement("input");
        input.type = "hidden";
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
      .then((response) => {
        dataPayment.tXid = response.tXid;
        dataPayment.timeStamp = dataRegister.timeStamp;
        dataPayment.merchantToken = dataRegister.merchantToken;

        return paymentTransaction(dataPayment);
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  async function requestOnePassToken(data) {
    const url = getEndpoint() + "/nicepay/api/onePassToken.do";
    data.iMid = config.iMid;

    const formData = new URLSearchParams();
    formData.append("jsonData", JSON.stringify(data));

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then((text) => {
        const cleanedText = text.slice(1, -1);
        return JSON.parse(cleanedText);
      });
  }

  async function getTokenWithoutPayment(params) {
    const url = getEndpoint() + "/nicepay/api/tokenize.do";
    params.iMid = config.iMid;

    const formData = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }).then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    });
  }

  function do3DSSecure(data) {
    const url = getEndpoint() + "/nicepay/api/secureVeRequest.do";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    const fields = {
      country: data.country || "IDN",
      callbackUrl: data.callbackUrl || "",
      onePassToken: data.onePassToken,
    };

    Object.keys(fields).forEach((key) => {
      if (fields[key]) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  }

  return {
    setup,
    getConfig,
    registerTransaction,
    paymentTransaction,
    registAndPaymentTransaction,
    requestOnePassToken,
    getTokenWithoutPayment,
    do3DSSecure,
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = Nicepay;
} else if (typeof define === "function" && define.amd) {
  define(function () {
    return Nicepay;
  });
} else if (typeof window !== "undefined") {
  window.Nicepay = Nicepay;
}
