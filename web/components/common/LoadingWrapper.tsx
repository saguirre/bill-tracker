interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
}
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
              <span className="ml-3 text-2xl font-light">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};
