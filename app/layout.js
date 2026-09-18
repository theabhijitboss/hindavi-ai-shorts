import "./globals.css";
export const metadata = {
  title: "Hindavi Swaraj AI Shorts",
  description: "AI Marathi/Hindi/English Shorts script generator"
};
export default function RootLayout({children}) {
  return <html lang="mr"><body>{children}</body></html>;
}
