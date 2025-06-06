import { Link } from "react-router-dom";
import "./Navigation.scss";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full bg-background border-b">
      <div className="container mx-auto px-4 flex justify-between items-center hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="navigation__button">
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/about"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">
                        About Us
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn more about our company and mission.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/createVolunteer"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  Create Volunteer
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/showEvents"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  show Event
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/createEvent"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  Create Event
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/Email"
                  className="px-4 py-2 text-foreground hover:text-primary"
                >
                  Create Email
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <Link to="/" className="text-lg font-bold text-foreground">
            Brand
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="px-2 py-1 text-sm rounded-md bg-secondary text-secondary-foreground"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="px-2 py-1 text-sm rounded-md bg-secondary text-secondary-foreground"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t bg-card">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                to="/"
                className="block px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/showEvents"
                className="block px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                List of Events
              </Link>
              <Link
                to="/createVolunteer"
                className="block px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create a Volunteer
              </Link>
              <Link
                to="/createVolunteer"
                className="block px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create an Event
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
