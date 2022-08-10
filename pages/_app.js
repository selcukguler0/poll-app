import '../styles/globals.css'
import Footer from '../components/footer'
import Head from 'next/head';
function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Poll</title>
			</Head>
			<Component {...pageProps} />
			<Footer />
		</>
	);
}

export default MyApp
