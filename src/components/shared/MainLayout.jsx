import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
            <Breadcrumbs />
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default MainLayout;
