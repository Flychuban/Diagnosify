
export function getSubroute(url: string): string { 
  
  return url.substring(url.substring(1,url.length).indexOf('/') + 1,url.length)
}