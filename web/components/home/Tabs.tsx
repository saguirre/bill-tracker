interface TabsProps {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, selectedTab, setSelectedTab, className }) => {
  return (
    <div className="flex flex-row gap-10 items-center w-full max-w-7xl mb-4">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`hover:opacity-100 hover:cursor-pointer transition-all duration-150 text-base font-medium py-2 ${
            selectedTab === tab ? 'opacity-100 border-b-2 border-base-content' : 'opacity-50'
          }`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};
