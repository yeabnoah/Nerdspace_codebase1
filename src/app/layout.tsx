import localFont from "next/font/local";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter, Instrument_Serif , } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display", // Unique variable name
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify all weights
});

export const metadata: Metadata = {
  title: {
    template: "%s | NerdSpace",
    default: "NerdSpace",
  },
  description: "social media for nerds",
};


const InstrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const itcThinItalic = localFont({
  src: [
    {
      path: "../../public/fonts/ITCGaramondStd-LtCondIta.ttf",
      weight: "700",
    },
  ],
  variable: "--font-itcThinItalic",
});

const itcThin = localFont({
  src: [
    {
      path: "../../public/fonts/ITCGaramondStd-LtCond.ttf",
      weight: "800",
    },
  ],
  variable: "--font-itcThin",
});

const itcBold = localFont({
  src: [
    {
      path: "../../public/fonts/ITCGaramondStd-BkCond.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-itcBold",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${InstrumentSerif.variable} ${inter.variable} ${itcThin.variable} ${itcBold.variable} ${itcThinItalic.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              className: "",
              style: {
                border: "1px solid #201e1d",
                padding: "8px",
                color: "#ffffff", // Change to white or another contrasting color
                backgroundColor: "#201e1d",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 0,
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
