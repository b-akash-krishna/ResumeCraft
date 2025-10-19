import TemplateCard from '../TemplateCard';

export default function TemplateCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <TemplateCard
        name="Modern"
        description="Clean and contemporary design"
        selected={false}
        onSelect={() => console.log('Template selected')}
      />
    </div>
  );
}
