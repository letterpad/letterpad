export function SectionContainer({ children }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-16">
        {children}
      </div>
    </div>
  );
}

export function Layout({ children }) {
  return (
    <SectionContainer>
      <main className="mb-auto">{children}</main>
    </SectionContainer>
  );
}
