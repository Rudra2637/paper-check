import "./globals.css";

export const metadata = {
  title: "VedaAI - Smart Exam Evaluation",
  description: "AI Assessment Extraction & Answer Mapping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
