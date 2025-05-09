import Breadcrumbs from "./BreadCrumbs";

export default function TopNav() {
    return (
      <header className="w-full h-16 bg-[#fafafa] dark:bg-[#121212] flex flex-col justify-center px-6 shadow">
        <h1 className="text-xl font-semibold dark:text-gray-100 text-gray-800">Welcome</h1>
        <Breadcrumbs />
      </header>
    );
  }
  
  