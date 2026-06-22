import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AUTH_ENABLED } from "../config";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";
import PageBackground from "./PageBackground";
import {
  GaugeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "./icons";

type LayoutProps = { children: ReactNode };

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  ["nav-pill", isActive ? "nav-pill-active" : ""].filter(Boolean).join(" ");

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const showAuthNav = AUTH_ENABLED && user;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="relative min-h-svh">
      <PageBackground />

      <div className="relative z-10 flex min-h-svh flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <header className="glass-card animate-fade-in mx-auto mb-6 flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandLogo />

          <nav className="flex items-center gap-1 sm:gap-2">
            {showAuthNav ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboardIcon className="hidden h-4 w-4 sm:block" />
                  Dashboard
                </NavLink>
                <NavLink to="/teams" className={navLinkClass}>
                  <UsersIcon className="hidden h-4 w-4 sm:block" />
                  Teams
                </NavLink>
                <NavLink to="/setups" className={navLinkClass}>
                  <SettingsIcon className="hidden h-4 w-4 sm:block" />
                  Setups
                </NavLink>
                <button
                  className="nav-pill"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : AUTH_ENABLED ? (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Sign in
              </NavLink>
            ) : (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboardIcon className="hidden h-4 w-4 sm:block" />
                  Dashboard
                </NavLink>
                <NavLink to="/teams" className={navLinkClass}>
                  <UsersIcon className="hidden h-4 w-4 sm:block" />
                  Teams
                </NavLink>
                <NavLink to="/setups" className={navLinkClass}>
                  <GaugeIcon className="hidden h-4 w-4 sm:block" />
                  Setups
                </NavLink>
              </>
            )}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1">{children}</main>
      </div>
    </div>
  );
}
