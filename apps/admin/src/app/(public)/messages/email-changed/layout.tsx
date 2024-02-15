import MessageLayout from "@/components/layouts/MessageLayout";

export const metadata = {
  title: "Letterpad - Email Changed",
};
const Layout = ({ children }) => {
  return <MessageLayout>{children}</MessageLayout>;
};

export default Layout;
