
export const buildUrl = (...paths: Array<string | number>) => {
    return normalizeUrl(paths.join('/'));
  };
  
  export const normalizeUrl = (str: string) => {
    // make sure protocol is followed by two slashes
    str = str.replace(/:\//g, '://');
  
    // remove consecutive slashes
    //str = str.replace(/([^:\s\%\3\A])\/+/g, '$1/');
  
    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
  
    // replace ? in parameters with &
    str = str.replace(/(\?.+)\?/g, '$1&');

    return str;
  
  };