export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingBottom: 0, height: "100dvh", overflow: "hidden" }}>
      {children}
    </div>
  );
}

