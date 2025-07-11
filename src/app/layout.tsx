import type { Metadata } from "next";
import { Inter, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabala - Nền tảng học trực tuyến hàng đầu Việt Nam",
  description: "Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi với Cabala.",
  keywords: "học trực tuyến, khóa học online, giáo dục, Cabala, học lập trình, kỹ năng",
  authors: [{ name: "Cabala Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://cabala.edu.vn",
    title: "Cabala - Nền tảng học trực tuyến hàng đầu",
    description: "Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu",
    siteName: "Cabala",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabala - Nền tảng học trực tuyến hàng đầu",
    description: "Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng đầu",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${poppins.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
