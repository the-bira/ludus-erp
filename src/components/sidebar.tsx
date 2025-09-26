"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  GraduationCap,
  DollarSign,
  Receipt,
  Calendar,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  user?: {
    nome: string;
    email: string;
    tipo: "admin" | "professor";
  };
  onClose?: () => void;
}

export function Sidebar({ user, onClose }: SidebarProps) {
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
    <div className="flex h-full flex-col bg-ludus-secondary">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="relative w-8 h-8">
            <Image
              src="/ludus.png"
              alt="Logo Ludus"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black">LUDUS</span>
          </div>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col px-3 py-4">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      isActive
                        ? "text-white bg-blue-900"
                        : "text-slate-700 hover:bg-blue-900 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Informações do Usuário */}
      {user && (
        <div className="border-t border-slate-600 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-ludus-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.nome}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user.tipo}</p>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-300 bg-ludus-accent hover:bg-ludus-accent hover:text-white"
              asChild
            >
              <Link href="/configuracoes">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-300 hover:bg-red-500/20 hover:text-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
