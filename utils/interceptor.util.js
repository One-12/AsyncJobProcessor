/**
 *
 *
 * @class InterceptorUtil
 */
class InterceptorUtil {
  /**
   * executes the body and error based on the execution flow
   *
   * @param {*} body
   * @param {*} err
   * @memberof InterceptorUtil
   */
  async execute(body, err) {
    try {
      await body();
    } catch (error) {
      err(error);
    }
  }
}

module.exports = InterceptorUtil;
