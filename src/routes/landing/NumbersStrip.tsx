export function NumbersStrip() {
  const metrics = [
    { stat: 'Up to 8', label: 'OEM references resolved per canonical part' },
    { stat: '4 Sources', label: 'Excel, Zoho, Billdu & Drive consolidated' },
    { stat: '3 Entities', label: 'Peru, Zambia & Intl operating isolation' },
    { stat: '4 Phases', label: 'Shipped incrementally with verified milestones' },
  ];

  return (
    <section className="py-14 px-4 sm:px-8 bg-surface-sunken border-t border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {metrics.map((m) => (
          <div key={m.stat} className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-ink-900 block">
              {m.stat}
            </span>
            <span className="text-xs text-ink-500 font-medium max-w-[200px] mx-auto block leading-tight">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
