import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
    title: "Learn with Framer University",
    description: "Learn everything there is to know about Framer.",
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-black antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
