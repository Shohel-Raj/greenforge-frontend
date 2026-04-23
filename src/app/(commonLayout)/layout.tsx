import Navbar from "@/components/shared/navbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
   <Navbar/>
   {children}
   </>
  );
}
