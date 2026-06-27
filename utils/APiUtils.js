class APiUtils {
  constructor(apiContext, loginPayLoad) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayLoad }
    );
    const { token } = await loginResponse.json();
    return token;
  }

  async createOrder(orderPayLoad) {
    const response = {};
    response.token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayLoad,
        headers: {
          Authorization: response.token,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderResponseJson = await orderResponse.json();
    response.orderId = orderResponseJson.orders[0];
    return response;
  }
}

module.exports = { APiUtils };
