"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  Menu,
  Home,
  Users,
  GraduationCap,
  DollarSign,
  Receipt,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user?: {
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, adminOnly: false },
    { href: "/pessoas", label: "Pessoas", icon: Users, adminOnly: true },
    { href: "/turmas", label: "Turmas", icon: GraduationCap, adminOnly: true },
    {
      href: "/financeiro",
      label: "Financeiro",
      icon: DollarSign,
      adminOnly: true,
    },
    { href: "/custos", label: "Custos", icon: Receipt, adminOnly: true },
    {
      href: "/presencas",
      label: "Presenças",
      icon: Calendar,
      adminOnly: false,
    },
  ];

  const filteredNavItems =
    user?.tipo === "admin"
      ? navigationItems
      : navigationItems.filter((item) => !item.adminOnly);

  return (
    <header className="bg-white border-b border-ludus-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/ludus.png"
                  alt="Logo Ludus"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-ludus-secondary">
                  LUDUS
                </span>
              </div>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "text-white"
                        : "text-slate-700 hover:bg-ludus-accent hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Menu do Usuário */}
          {user && (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.nome}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-slate-600 border-b border-slate-200">
                    <div className="font-medium">{user.nome}</div>
                    <div className="text-xs">{user.email}</div>
                    <div className="text-xs capitalize">{user.tipo}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/configuracoes"
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
