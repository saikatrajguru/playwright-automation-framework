export class APiUtils {
  apiContext: any;
  loginPayLoad: any;

  constructor(apiContext: any, loginPayLoad: any) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayLoad }
    );
    const { token } = await loginResponse.json();
    return token;
  }

  async createOrder(orderPayLoad: any): Promise<{ token: string; orderId: string }> {
    const token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayLoad,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    const orderResponseJson = await orderResponse.json();
    return { token, orderId: orderResponseJson.orders[0] };
  }
}
