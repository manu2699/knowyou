/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

export default async ({
  url, method, body = { name: "fad", numebr: 4 },
  onSuccess = undefined, onError = undefined, noToken = undefined
}) => {
  let token = await localStorage.getItem("token")
  if (token === null && noToken) {
    noToken();
    return;
  }
  try {
    const { data, status } = await axios({
      method,
      url,
      data: { ...body },
      headers: { Authorization: token }
    })
    console.log(status, data)
    if (onSuccess && (status > 100 && status < 300)) {
      onSuccess(data)
      return;
    }
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.message;
      console.log(errors)
      if (onError) {
        onError(errors)
      }
    }
  }
}
