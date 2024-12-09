import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hotnessRepo } from './pages/api/getHotness';
import axios from 'axios';
import { getBaseUrl } from './utils/getHost';
import { Env } from './utils/env';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let diagnosisId = request.url.slice(request.url.indexOf('diagnoses') + "diagnoses".length + 1)
  console.log("diag", diagnosisId)
  const indexOfMalformedPathIndicator = diagnosisId.indexOf("?")
  if (indexOfMalformedPathIndicator > -1) {
   diagnosisId = diagnosisId.slice(0,indexOfMalformedPathIndicator)
 } 
  console.log()
  const res = await fetch("http://localhost:"+Env.frontend_port+"/api/updateHotness", {
    method: "POST",
    body:  diagnosisId
  })
  console.log(await res.json())
  console.log(diagnosisId)
    return NextResponse.next(); //
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/diagnoses/:id*',
}