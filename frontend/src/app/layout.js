import { Instrument_Sans, Anonymous_Pro, Jersey_15 } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous_Pro",
  subsets: ["latin"],
  weight: "400",
});

const jersey15 = Jersey_15({
  variable: "--font-jersey-15",
  subsets: ["latin"],
  weight: "400"

})

export const metadata = {
  title: "Players Tracker",
  description: "Created by Ruan Mesquita",
  icons: {
    icon:  './favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${anonymousPro.variable} ${jersey15.variable}`}>
        {children}
      </body>
    </html>
  );
}
