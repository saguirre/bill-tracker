interface CategoryLabelProps {
  category: {
    name: string;
    icon: string;
  };
}
export const CategoryLabel: React.FC<CategoryLabelProps> = ({ category }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="avatar">
        <div className="w-6 h-6 rounded-full">
          <img src={category.icon} />
        </div>
      </div>
      <div className="text-sm font-semibold">{category.name}</div>
    </div>
  );
};
