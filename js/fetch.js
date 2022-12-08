
export const getData = (url) => {
    let fetchOptions = {
      method: "GET",
      mode: "cors",
      cache: "no-cache"
    };
  
    return fetch(url, fetchOptions).then(
      resp => resp.json(),
      err => console.error(err)
    );
  };