export default function SidebarSectionTitle({ children }) {
    return (
      <h3 className="
        uppercase text-xs font-semibold tracking-wider mt-6 mb-2 
        text-gray-500 dark:text-gray-400 
        text-center md:text-left
        md:text-[0.7rem] lg:text-xs
        hidden md:block
      ">
        {children}
      </h3>
    );
  }
  