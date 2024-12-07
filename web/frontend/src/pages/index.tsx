import Head from "next/head";
import Link from "next/link";
import {useEffect} from "react"
export default function Home() {
	useEffect(() => {
		window.location.href="/diagnoses/new"
	})
	return (
    <div className="text-primarytext">
   </div> 
  );
}
