import "./admin.css";

export const metadata = {
  title: 'Admin Dashboard - Power Soul Fitness',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
