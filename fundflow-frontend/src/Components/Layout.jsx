import Sidebar from "./Sidebar";

export default function Layout({
  children,
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}